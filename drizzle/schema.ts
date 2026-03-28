import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
  index,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with medical professional information for healthcare context.
 */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin", "doctor"])
      .default("user")
      .notNull(),

    // Medical professional fields
    organization: varchar("organization", { length: 255 }),
    specialty: varchar("specialty", { length: 100 }),
    licenseNumber: varchar("licenseNumber", { length: 100 }),
    isVerified: boolean("isVerified").default(false).notNull(),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  table => ({
    emailIdx: index("email_idx").on(table.email),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Documents table - represents medical documents or cases
 */
export const documents = mysqlTable(
  "documents",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    documentType: mysqlEnum("documentType", [
      "medical",
      "report",
      "scan",
      "other",
    ])
      .default("medical")
      .notNull(),
    status: mysqlEnum("status", [
      "draft",
      "pending",
      "analyzed",
      "reviewed",
      "archived",
    ])
      .default("draft")
      .notNull(),

    // Patient information (should be encrypted in production)
    patientName: varchar("patientName", { length: 255 }),
    patientAge: int("patientAge"),
    patientGender: mysqlEnum("patientGender", ["male", "female", "other"]),
    patientId: varchar("patientId", { length: 100 }),

    // Metadata stored as JSON for flexibility
    metadata: json("metadata").$type<{
      tags?: string[];
      notes?: string;
      referringPhysician?: string;
      [key: string]: any;
    }>(),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userIdIdx: index("userId_idx").on(table.userId),
    statusIdx: index("status_idx").on(table.status),
    createdAtIdx: index("createdAt_idx").on(table.createdAt),
    // Composite index for common query: user's documents by status and creation date
    userStatusCreatedIdx: index("user_status_created_idx").on(
      table.userId,
      table.status,
      table.createdAt
    ),
  })
);

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Images table - stores medical images for analysis
 */
export const images = mysqlTable(
  "images",
  {
    id: int("id").autoincrement().primaryKey(),
    documentId: int("documentId").references(() => documents.id, {
      onDelete: "cascade",
    }),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    originalName: varchar("originalName", { length: 255 }).notNull(),
    fileKey: varchar("fileKey", { length: 500 }).notNull(),
    fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
    fileSize: int("fileSize"),
    mimeType: varchar("mimeType", { length: 100 }),

    width: int("width"),
    height: int("height"),

    // Medical image specific fields
    imageType: mysqlEnum("imageType", [
      "xray",
      "mri",
      "ct",
      "ultrasound",
      "photo",
      "document",
      "other",
    ]),
    bodyPart: varchar("bodyPart", { length: 100 }),

    status: mysqlEnum("status", ["pending", "analyzing", "analyzed", "failed"])
      .default("pending")
      .notNull(),

    metadata: json("metadata").$type<{
      orientation?: string;
      compression?: string;
      [key: string]: any;
    }>(),

    uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  },
  table => ({
    documentIdIdx: index("documentId_idx").on(table.documentId),
    userIdIdx: index("userId_idx").on(table.userId),
    statusIdx: index("status_idx").on(table.status),
    // Composite index for common query: user's images by status and upload date
    userStatusUploadedIdx: index("user_status_uploaded_idx").on(
      table.userId,
      table.status,
      table.uploadedAt
    ),
  })
);

export type Image = typeof images.$inferSelect;
export type InsertImage = typeof images.$inferInsert;

/**
 * Analysis results table - stores AI/ML analysis outputs
 */
export const analysisResults = mysqlTable(
  "analysisResults",
  {
    id: int("id").autoincrement().primaryKey(),
    imageId: int("imageId")
      .notNull()
      .references(() => images.id, { onDelete: "cascade" }),

    modelName: varchar("modelName", { length: 100 }).notNull(),
    modelVersion: varchar("modelVersion", { length: 50 }),

    // Confidence score (0-100)
    confidenceScore: int("confidenceScore"),

    // Main findings and predictions stored as JSON
    predictions: json("predictions")
      .$type<{
        labels?: Array<{ name: string; confidence: number }>;
        detections?: Array<{
          bbox: number[];
          label: string;
          confidence: number;
        }>;
        [key: string]: any;
      }>()
      .notNull(),

    findings: json("findings").$type<string[]>(),
    recommendations: json("recommendations").$type<string[]>(),

    severity: mysqlEnum("severity", [
      "normal",
      "mild",
      "moderate",
      "severe",
      "critical",
    ]),

    processingTimeMs: int("processingTimeMs"),

    // Review by medical professional
    reviewedBy: int("reviewedBy").references(() => users.id),
    reviewNotes: text("reviewNotes"),
    reviewedAt: timestamp("reviewedAt"),

    analyzedAt: timestamp("analyzedAt").defaultNow().notNull(),

    metadata: json("metadata").$type<{
      rawResponse?: any;
      errors?: string[];
      [key: string]: any;
    }>(),
  },
  table => ({
    imageIdIdx: index("imageId_idx").on(table.imageId),
    analyzedAtIdx: index("analyzedAt_idx").on(table.analyzedAt),
    // Composite index for common query: filtering by severity and analysis date
    severityAnalyzedIdx: index("severity_analyzed_idx").on(
      table.severity,
      table.analyzedAt
    ),
  })
);

export type AnalysisResult = typeof analysisResults.$inferSelect;
export type InsertAnalysisResult = typeof analysisResults.$inferInsert;

/**
 * Audit logs table - for compliance and security tracking
 */
export const auditLogs = mysqlTable(
  "auditLogs",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").references(() => users.id),

    action: varchar("action", { length: 100 }).notNull(),
    resourceType: varchar("resourceType", { length: 50 }),
    resourceId: int("resourceId"),

    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: text("userAgent"),

    details: json("details").$type<{
      before?: any;
      after?: any;
      [key: string]: any;
    }>(),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index("userId_idx").on(table.userId),
    createdAtIdx: index("createdAt_idx").on(table.createdAt),
    actionIdx: index("action_idx").on(table.action),
  })
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Subscriptions table - for managing user plans and billing
 */
export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    planType: mysqlEnum("planType", ["free", "basic", "pro", "enterprise"])
      .default("free")
      .notNull(),
    status: mysqlEnum("status", ["active", "canceled", "expired", "suspended"])
      .default("active")
      .notNull(),

    analysesLimit: int("analysesLimit").default(10).notNull(),
    analysesUsed: int("analysesUsed").default(0).notNull(),

    // Price in cents to avoid decimal issues
    priceCents: int("priceCents").default(0),
    currency: varchar("currency", { length: 3 }).default("USD"),

    billingCycle: mysqlEnum("billingCycle", ["monthly", "yearly"]),

    startedAt: timestamp("startedAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt"),

    autoRenew: boolean("autoRenew").default(true).notNull(),

    metadata: json("metadata").$type<{
      paymentMethod?: string;
      lastPaymentDate?: string;
      [key: string]: any;
    }>(),
  },
  table => ({
    userIdIdx: index("userId_idx").on(table.userId),
    statusIdx: index("status_idx").on(table.status),
    expiresAtIdx: index("expiresAt_idx").on(table.expiresAt),
  })
);

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
