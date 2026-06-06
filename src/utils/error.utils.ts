/**
 * Centralized error system for NaiPoMemories.
 * All thrown errors should be instances of these classes
 * to ensure consistent user-facing messages.
 */

// ─── Base Error ───────────────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly code: string;
  public readonly userMessage: string;

  constructor(message: string, code: string, userMessage: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage;
  }
}

// ─── Validation Error ─────────────────────────────────────────────────────────

export class ValidationError extends AppError {
  public readonly fields?: Record<string, string>;

  constructor(userMessage: string, fields?: Record<string, string>) {
    super(userMessage, 'VALIDATION_ERROR', userMessage);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

// ─── Firebase Error ───────────────────────────────────────────────────────────

export class FirebaseAuthError extends AppError {
  constructor(firebaseCode: string) {
    const userMessage = mapFirebaseAuthError(firebaseCode);
    super(`Firebase Auth Error: ${firebaseCode}`, firebaseCode, userMessage);
    this.name = 'FirebaseAuthError';
  }
}

export class FirestoreError extends AppError {
  constructor(firebaseCode: string, context?: string) {
    const userMessage = `Something went wrong${context ? ` with ${context}` : ''}. Please try again.`;
    super(`Firestore Error: ${firebaseCode}`, firebaseCode, userMessage);
    this.name = 'FirestoreError';
  }
}

// ─── Media Error ──────────────────────────────────────────────────────────────

export class MediaError extends AppError {
  constructor(code: string, userMessage: string) {
    super(`Media Error: ${code}`, code, userMessage);
    this.name = 'MediaError';
  }
}

// ─── Network Error ────────────────────────────────────────────────────────────

export class NetworkError extends AppError {
  constructor() {
    super('Network request failed', 'NETWORK_ERROR', 'No internet connection. Please check your network.');
    this.name = 'NetworkError';
  }
}

// ─── Firebase Auth Code Mapping ───────────────────────────────────────────────

function mapFirebaseAuthError(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/requires-recent-login': 'Please log in again to complete this action.',
  };

  return messages[code] ?? 'An unexpected error occurred. Please try again.';
}

// ─── Error Parser Utility ─────────────────────────────────────────────────────

/**
 * Extracts a user-friendly message from any error type.
 * Use this in catch blocks to display a message to the user.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.userMessage;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Wraps Firebase errors into our typed error classes.
 */
export function parseFirebaseError(error: unknown, context?: string): AppError {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;

    if (code.startsWith('auth/')) {
      return new FirebaseAuthError(code);
    }

    if (code.startsWith('firestore/') || code.startsWith('permission-denied')) {
      return new FirestoreError(code, context);
    }
  }

  return new AppError(
    String(error),
    'UNKNOWN_ERROR',
    'An unexpected error occurred. Please try again.',
  );
}
