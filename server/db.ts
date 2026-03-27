import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  documents,
  InsertDocument,
  images,
  InsertImage,
  analysisResults,
  InsertAnalysisResult,
  auditLogs,
  InsertAuditLog,
  subscriptions,
  InsertSubscription,
} from "../drizzle/schema";
import type { User } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { logger } from "./_core/logger";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      logger.warn("[Database] Failed to connect", {}, error instanceof Error ? error : new Error(String(error)));
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    logger.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = [
      "name",
      "email",
      "loginMethod",
      "organization",
      "specialty",
      "licenseNumber",
    ] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (user.isVerified !== undefined) {
      values.isVerified = user.isVerified;
      updateSet.isVerified = user.isVerified;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    logger.error("[Database] Failed to upsert user", {}, error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    logger.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Document queries
export async function getUserDocuments(userId: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt))
    .limit(limit);
}

export async function getDocumentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDocument(doc: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(documents).values(doc);
  return Number(result[0].insertId);
}

export async function updateDocument(
  id: number,
  updates: Partial<InsertDocument>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(documents).set(updates).where(eq(documents.id, id));
}

export async function deleteDocument(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(documents).where(eq(documents.id, id));
}

// Image queries
export async function getDocumentImages(documentId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(images)
    .where(eq(images.documentId, documentId))
    .orderBy(desc(images.uploadedAt));
}

export async function getUserImages(userId: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(images)
    .where(eq(images.userId, userId))
    .orderBy(desc(images.uploadedAt))
    .limit(limit);
}

export async function getImageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(images)
    .where(eq(images.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createImage(image: InsertImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(images).values(image);
  return Number(result[0].insertId);
}

export async function updateImage(id: number, updates: Partial<InsertImage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(images).set(updates).where(eq(images.id, id));
}

// Analysis results queries
export async function getImageAnalysis(imageId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(analysisResults)
    .where(eq(analysisResults.imageId, imageId))
    .orderBy(desc(analysisResults.analyzedAt));
}

export async function createAnalysisResult(analysis: InsertAnalysisResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(analysisResults).values(analysis);
  return Number(result[0].insertId);
}

export async function updateAnalysisResult(
  id: number,
  updates: Partial<InsertAnalysisResult>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(analysisResults)
    .set(updates)
    .where(eq(analysisResults.id, id));
}

// Audit log
export async function createAuditLog(log: InsertAuditLog) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(auditLogs).values(log);
  } catch (error) {
    logger.error("[Database] Failed to create audit log", {}, error instanceof Error ? error : new Error(String(error)));
  }
}

export async function getUserAuditLogs(userId: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.userId, userId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
}

// Subscription queries
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active"))
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createSubscription(sub: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values(sub);
  return Number(result[0].insertId);
}

export async function updateSubscription(
  id: number,
  updates: Partial<InsertSubscription>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions).set(updates).where(eq(subscriptions.id, id));
}

export async function incrementAnalysisUsage(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set({ analysesUsed: sql`${subscriptions.analysesUsed} + 1` })
    .where(
      and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active"))
    );
}

// Dashboard statistics
export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db)
    return {
      totalDocuments: 0,
      totalImages: 0,
      totalAnalyses: 0,
      pendingAnalyses: 0,
    };

  // Execute all count queries in parallel to reduce latency
  const [
    [docsCount],
    [imagesCount],
    [analysesCount],
    [pendingCount]
  ] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(documents)
      .where(eq(documents.userId, userId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(images)
      .where(eq(images.userId, userId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(analysisResults)
      .innerJoin(images, eq(analysisResults.imageId, images.id))
      .where(eq(images.userId, userId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(images)
      .where(and(eq(images.userId, userId), eq(images.status, "pending")))
  ]);

  return {
    totalDocuments: Number(docsCount?.count || 0),
    totalImages: Number(imagesCount?.count || 0),
    totalAnalyses: Number(analysesCount?.count || 0),
    pendingAnalyses: Number(pendingCount?.count || 0),
  };
}
