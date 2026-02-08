import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Session {
  user: SessionUser;
  expires: string;
}

/**
 * Error class for session-related errors
 */
export class SessionError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'SessionError';
  }
}

/**
 * Get session from NextAuth
 * This is the primary authentication method
 */
export async function getSessionFromRequest(request: NextRequest): Promise<Session | null> {
  try {
    const session = await getServerSession(authOptions);
    return session as Session | null;
  } catch (error) {
    console.error('Error getting session:', error);

    // Handle database connection errors specifically
    if (error instanceof Error) {
      if (error.message.includes('bufferCommands')) {
        throw new SessionError(
          'Database initialization in progress. Please try again.',
          'DATABASE_INITIALIZING',
          503
        );
      }

      if (error.message.includes('connection')) {
        throw new SessionError(
          'Database connection error. Please try again.',
          'DATABASE_ERROR',
          503
        );
      }
    }

    throw new SessionError(
      'Failed to verify session. Please try again.',
      'SESSION_ERROR',
      500
    );
  }
}

/**
 * Check if the current request has a valid session
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const session = await getSessionFromRequest(request);
    return session !== null;
  } catch {
    return false;
  }
}

/**
 * Get the user ID from the request
 * @throws SessionError if session is invalid or error occurs
 */
export async function getUserId(request: NextRequest): Promise<string | null> {
  const session = await getSessionFromRequest(request);
  return session?.user?.id || null;
}

/**
 * Get the user role from the request
 * @throws SessionError if session is invalid or error occurs
 */
export async function getUserRole(request: NextRequest): Promise<string | null> {
  const session = await getSessionFromRequest(request);
  return session?.user?.role || null;
}
