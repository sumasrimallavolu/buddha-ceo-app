import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      avatar?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  }
}

/**
 * Error codes thrown by authentication system
 */
export type AuthErrorCode =
  | 'MISSING_CREDENTIALS'        // 400 - Email or password missing
  | 'INVALID_CREDENTIALS'        // 401 - Wrong email or password
  | 'AUTH_ERROR'                 // 500 - Generic auth error
  | 'DATABASE_CONNECTION_ERROR'  // 503 - Failed to connect to DB
  | 'DATABASE_TIMEOUT'           // 503 - DB connection timeout
  | 'DATABASE_NOT_CONNECTED'     // 503 - DB not connected
  | 'DATABASE_INITIALIZING'      // 503 - DB bufferCommands error
  | 'DATABASE_ERROR';            // 503 - Generic DB error

/**
 * Extended error interface for authentication errors
 */
export interface AuthError extends Error {
  code: AuthErrorCode;
  statusCode: number;
}
