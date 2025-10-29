import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { createAuditLog } from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Dashboard statistics
  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      const stats = await db.getUserStats(ctx.user.id);
      const subscription = await db.getUserSubscription(ctx.user.id);
      
      return {
        ...stats,
        subscription: subscription ? {
          plan: subscription.planType,
          analysesLimit: subscription.analysesLimit,
          analysesUsed: subscription.analysesUsed,
          analysesRemaining: subscription.analysesLimit - subscription.analysesUsed,
        } : {
          plan: 'free',
          analysesLimit: 10,
          analysesUsed: 0,
          analysesRemaining: 10,
        }
      };
    }),
  }),

  // Documents management
  documents: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserDocuments(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const doc = await db.getDocumentById(input.id);
        if (!doc || doc.userId !== ctx.user.id) {
          throw new Error("Document not found");
        }
        return doc;
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        documentType: z.enum(["medical", "report", "scan", "other"]).default("medical"),
        patientName: z.string().optional(),
        patientAge: z.number().optional(),
        patientGender: z.enum(["male", "female", "other"]).optional(),
        patientId: z.string().optional(),
        metadata: z.any().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createDocument({
          ...input,
          userId: ctx.user.id,
          status: "draft",
        });
        
        await createAuditLog({
          userId: ctx.user.id,
          action: "document.create",
          resourceType: "document",
          resourceId: id,
          details: { title: input.title },
        });
        
        return { id };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "pending", "analyzed", "reviewed", "archived"]).optional(),
        patientName: z.string().optional(),
        patientAge: z.number().optional(),
        patientGender: z.enum(["male", "female", "other"]).optional(),
        metadata: z.any().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...updates } = input;
        const doc = await db.getDocumentById(id);
        
        if (!doc || doc.userId !== ctx.user.id) {
          throw new Error("Document not found");
        }
        
        await db.updateDocument(id, updates);
        
        await createAuditLog({
          userId: ctx.user.id,
          action: "document.update",
          resourceType: "document",
          resourceId: id,
          details: updates,
        });
        
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const doc = await db.getDocumentById(input.id);
        
        if (!doc || doc.userId !== ctx.user.id) {
          throw new Error("Document not found");
        }
        
        await db.deleteDocument(input.id);
        
        await createAuditLog({
          userId: ctx.user.id,
          action: "document.delete",
          resourceType: "document",
          resourceId: input.id,
        });
        
        return { success: true };
      }),
  }),

  // Images management
  images: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserImages(ctx.user.id);
    }),
    
    listByDocument: protectedProcedure
      .input(z.object({ documentId: z.number() }))
      .query(async ({ input }) => {
        return db.getDocumentImages(input.documentId);
      }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const image = await db.getImageById(input.id);
        if (!image || image.userId !== ctx.user.id) {
          throw new Error("Image not found");
        }
        return image;
      }),
    
    upload: protectedProcedure
      .input(z.object({
        documentId: z.number().optional(),
        originalName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
        imageType: z.enum(["xray", "mri", "ct", "ultrasound", "photo", "document", "other"]).optional(),
        bodyPart: z.string().optional(),
        metadata: z.any().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Decode base64
        const buffer = Buffer.from(input.fileData, 'base64');
        const fileSize = buffer.length;
        
        // Generate unique file key
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(7);
        const fileKey = `users/${ctx.user.id}/images/${timestamp}-${randomSuffix}`;
        
        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        // Save to database
        const imageId = await db.createImage({
          documentId: input.documentId || null,
          userId: ctx.user.id,
          originalName: input.originalName,
          fileKey,
          fileUrl: url,
          fileSize,
          mimeType: input.mimeType,
          imageType: input.imageType || null,
          bodyPart: input.bodyPart || null,
          status: "pending",
          metadata: input.metadata || null,
        });
        
        await createAuditLog({
          userId: ctx.user.id,
          action: "image.upload",
          resourceType: "image",
          resourceId: imageId,
          details: { originalName: input.originalName, fileSize },
        });
        
        return { id: imageId, url };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const image = await db.getImageById(input.id);
        
        if (!image || image.userId !== ctx.user.id) {
          throw new Error("Image not found");
        }
        
        // Note: In production, you might want to delete from S3 as well
        // For now, we just delete the database record
        await db.updateImage(input.id, { status: "failed" }); // Soft delete
        
        await createAuditLog({
          userId: ctx.user.id,
          action: "image.delete",
          resourceType: "image",
          resourceId: input.id,
        });
        
        return { success: true };
      }),
  }),

  // AI Analysis
  analysis: router({
    analyze: protectedProcedure
      .input(z.object({
        imageId: z.number(),
        modelType: z.enum(["gpt4-vision", "basic"]).default("basic"),
      }))
      .mutation(async ({ input, ctx }) => {
        const image = await db.getImageById(input.imageId);
        
        if (!image || image.userId !== ctx.user.id) {
          throw new Error("Image not found");
        }
        
        // Check subscription limits
        const subscription = await db.getUserSubscription(ctx.user.id);
        if (subscription) {
          if (subscription.analysesUsed >= subscription.analysesLimit) {
            throw new Error("Analysis limit reached. Please upgrade your plan.");
          }
        }
        
        // Update image status
        await db.updateImage(input.imageId, { status: "analyzing" });
        
        const startTime = Date.now();
        
        try {
          let analysisData: any;
          
          if (input.modelType === "gpt4-vision") {
            // Use GPT-4 Vision for advanced analysis
            const response = await invokeLLM({
              messages: [
                {
                  role: "system",
                  content: "You are a medical image analysis assistant. Analyze the image and provide findings in JSON format with: findings (array of strings), severity (normal/mild/moderate/severe/critical), recommendations (array of strings), confidence (0-100)."
                },
                {
                  role: "user",
                  content: [
                    { type: "text", text: `Analyze this medical image. Type: ${image.imageType || 'unknown'}, Body part: ${image.bodyPart || 'unknown'}` },
                    { type: "image_url", image_url: { url: image.fileUrl } }
                  ]
                }
              ],
              response_format: {
                type: "json_schema",
                json_schema: {
                  name: "medical_analysis",
                  strict: true,
                  schema: {
                    type: "object",
                    properties: {
                      findings: { type: "array", items: { type: "string" } },
                      severity: { type: "string", enum: ["normal", "mild", "moderate", "severe", "critical"] },
                      recommendations: { type: "array", items: { type: "string" } },
                      confidence: { type: "number" }
                    },
                    required: ["findings", "severity", "recommendations", "confidence"],
                    additionalProperties: false
                  }
                }
              }
            });
            
            const content = response.choices[0].message.content;
            analysisData = JSON.parse(typeof content === 'string' ? content : "{}");
          } else {
            // Basic analysis (placeholder)
            analysisData = {
              findings: ["Image uploaded successfully", "Awaiting detailed analysis"],
              severity: "normal",
              recommendations: ["Please consult with a medical professional"],
              confidence: 50
            };
          }
          
          const processingTime = Date.now() - startTime;
          
          // Save analysis result
          const analysisId = await db.createAnalysisResult({
            imageId: input.imageId,
            modelName: input.modelType,
            modelVersion: "1.0",
            confidenceScore: Math.round(analysisData.confidence || 0),
            predictions: {
              labels: [{ name: analysisData.severity, confidence: analysisData.confidence }]
            },
            findings: analysisData.findings || [],
            recommendations: analysisData.recommendations || [],
            severity: analysisData.severity || "normal",
            processingTimeMs: processingTime,
          });
          
          // Update image status
          await db.updateImage(input.imageId, { status: "analyzed" });
          
          // Increment usage
          if (subscription) {
            await db.incrementAnalysisUsage(ctx.user.id);
          }
          
          await createAuditLog({
            userId: ctx.user.id,
            action: "analysis.create",
            resourceType: "analysis",
            resourceId: analysisId,
            details: { imageId: input.imageId, modelType: input.modelType },
          });
          
          return {
            id: analysisId,
            ...analysisData,
            processingTime
          };
          
        } catch (error) {
          await db.updateImage(input.imageId, { status: "failed" });
          throw error;
        }
      }),
    
    getByImage: protectedProcedure
      .input(z.object({ imageId: z.number() }))
      .query(async ({ input, ctx }) => {
        const image = await db.getImageById(input.imageId);
        if (!image || image.userId !== ctx.user.id) {
          throw new Error("Image not found");
        }
        
        return db.getImageAnalysis(input.imageId);
      }),
  }),

  // Subscriptions
  subscriptions: router({
    current: protectedProcedure.query(async ({ ctx }) => {
      const sub = await db.getUserSubscription(ctx.user.id);
      
      if (!sub) {
        // Create default free subscription
        const id = await db.createSubscription({
          userId: ctx.user.id,
          planType: "free",
          status: "active",
          analysesLimit: 10,
          analysesUsed: 0,
          priceCents: 0,
        });
        
        return db.getUserSubscription(ctx.user.id);
      }
      
      return sub;
    }),
    
    upgrade: protectedProcedure
      .input(z.object({
        planType: z.enum(["basic", "pro", "enterprise"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const currentSub = await db.getUserSubscription(ctx.user.id);
        
        const planLimits = {
          basic: { limit: 100, price: 999 }, // $9.99
          pro: { limit: 1000, price: 2999 }, // $29.99
          enterprise: { limit: 10000, price: 9999 }, // $99.99
        };
        
        const plan = planLimits[input.planType];
        
        if (currentSub) {
          await db.updateSubscription(currentSub.id, {
            planType: input.planType,
            analysesLimit: plan.limit,
            priceCents: plan.price,
            billingCycle: "monthly",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          });
        } else {
          await db.createSubscription({
            userId: ctx.user.id,
            planType: input.planType,
            status: "active",
            analysesLimit: plan.limit,
            analysesUsed: 0,
            priceCents: plan.price,
            billingCycle: "monthly",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        }
        
        await createAuditLog({
          userId: ctx.user.id,
          action: "subscription.upgrade",
          resourceType: "subscription",
          details: { planType: input.planType },
        });
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
