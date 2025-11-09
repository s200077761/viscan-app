/**
 * Custom error types for ViScan application
 * Provides structured error handling with exit codes
 */

export enum ErrorCode {
  // General errors (1xx)
  UNKNOWN_ERROR = 100,
  INVALID_INPUT = 101,
  VALIDATION_ERROR = 102,

  // Authentication errors (2xx)
  UNAUTHORIZED = 200,
  FORBIDDEN = 201,
  TOKEN_EXPIRED = 202,
  INVALID_CREDENTIALS = 203,

  // Database errors (3xx)
  DATABASE_ERROR = 300,
  RECORD_NOT_FOUND = 301,
  DUPLICATE_RECORD = 302,

  // Firebase errors (4xx)
  FIREBASE_INIT_ERROR = 400,
  FIREBASE_AUTH_ERROR = 401,
  FIREBASE_STORAGE_ERROR = 402,
  FIREBASE_FIRESTORE_ERROR = 403,

  // AI Service errors (5xx)
  AI_SERVICE_ERROR = 500,
  MODEL_LOAD_ERROR = 501,
  INFERENCE_ERROR = 502,
  ANALYSIS_ERROR = 503,

  // Storage errors (6xx)
  STORAGE_ERROR = 600,
  FILE_UPLOAD_ERROR = 601,
  FILE_NOT_FOUND = 602,

  // Network errors (7xx)
  NETWORK_ERROR = 700,
  API_ERROR = 701,
  TIMEOUT_ERROR = 702,
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this);
  }
}

export class FirebaseError extends AppError {
  constructor(message: string, code: ErrorCode, context?: Record<string, unknown>) {
    super(message, code, 500, true, context);
    this.name = 'FirebaseError';
  }

  static initError(message: string, context?: Record<string, unknown>): FirebaseError {
    return new FirebaseError(message, ErrorCode.FIREBASE_INIT_ERROR, context);
  }

  static authError(message: string, context?: Record<string, unknown>): FirebaseError {
    return new FirebaseError(message, ErrorCode.FIREBASE_AUTH_ERROR, context);
  }

  static storageError(message: string, context?: Record<string, unknown>): FirebaseError {
    return new FirebaseError(message, ErrorCode.FIREBASE_STORAGE_ERROR, context);
  }

  static firestoreError(message: string, context?: Record<string, unknown>): FirebaseError {
    return new FirebaseError(message, ErrorCode.FIREBASE_FIRESTORE_ERROR, context);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.DATABASE_ERROR, 500, true, context);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, true, context);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.UNAUTHORIZED, 401, true, context);
    this.name = 'AuthenticationError';
  }
}

export class AIServiceError extends AppError {
  constructor(message: string, code: ErrorCode = ErrorCode.AI_SERVICE_ERROR, context?: Record<string, unknown>) {
    super(message, code, 500, true, context);
    this.name = 'AIServiceError';
  }
}

export class StorageError extends AppError {
  constructor(message: string, code: ErrorCode = ErrorCode.STORAGE_ERROR, context?: Record<string, unknown>) {
    super(message, code, 500, true, context);
    this.name = 'StorageError';
  }
}

/**
 * Helper function to check if error is operational
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Helper function to get exit code from error
 */
export function getExitCode(error: Error): number {
  if (error instanceof AppError) {
    return error.code;
  }
  return ErrorCode.UNKNOWN_ERROR;
}
