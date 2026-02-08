import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from './mongodb';
import { User, logActivity } from './models';

/**
 * Custom error class for authentication errors with proper HTTP status codes
 */
class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Ensure database is connected with retry logic
 */
async function ensureConnection(): Promise<void> {
  const maxRetries = 2; // Reduced from 3 since we increased timeouts
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const connection = await connectDB();

      // Verify connection is actually ready
      if (connection.connection.readyState === 1) {
        return;
      }

      attempts++;
      if (attempts < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    } catch (error) {
      attempts++;

      const err = error as Error;

      // Don't retry on certain errors
      if (err.message.includes('authentication')) {
        throw new AuthError(
          'Database authentication failed. Please check your configuration.',
          'DATABASE_CONNECTION_ERROR',
          503
        );
      }

      if (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED')) {
        throw new AuthError(
          'Cannot reach database server. Please check your network connection.',
          'DATABASE_CONNECTION_ERROR',
          503
        );
      }

      if (attempts >= maxRetries) {
        throw new AuthError(
          err.message || 'Database connection failed. Please try again later.',
          'DATABASE_CONNECTION_ERROR',
          503
        );
      }

      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }

  throw new AuthError(
    'Database connection timeout. Please try again later.',
    'DATABASE_TIMEOUT',
    503
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate input
          if (!credentials?.email || !credentials?.password) {
            throw new AuthError(
              'Email and password are required',
              'MISSING_CREDENTIALS',
              400
            );
          }

          // Ensure database connection
          await ensureConnection();

          // Double-check connection before query
          if (mongoose.connection.readyState !== 1) {
            throw new AuthError(
              'Database not connected. Please try again.',
              'DATABASE_NOT_CONNECTED',
              503
            );
          }

          const user = await User.findOne({ email: credentials.email }).lean();

          if (!user) {
            // Log failed login attempt - user not found
            try {
              await logActivity({
                userId: 'unknown',
                userName: 'Unknown',
                userEmail: credentials.email,
                action: 'login_attempt',
                resource: 'authentication',
                details: { reason: 'User not found' },
                status: 'failure',
              });
            } catch (logError) {
              console.error('Failed to log activity:', logError);
            }

            throw new AuthError(
              'Invalid email or password',
              'INVALID_CREDENTIALS',
              401
            );
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            // Log failed login attempt - invalid password
            try {
              await logActivity({
                userId: user._id.toString(),
                userName: user.name,
                userEmail: user.email,
                action: 'login_attempt',
                resource: 'authentication',
                details: { reason: 'Invalid password' },
                status: 'failure',
              });
            } catch (logError) {
              console.error('Failed to log activity:', logError);
            }

            throw new AuthError(
              'Invalid email or password',
              'INVALID_CREDENTIALS',
              401
            );
          }

          // Log successful login
          try {
            await logActivity({
              userId: user._id.toString(),
              userName: user.name,
              userEmail: user.email,
              action: 'login',
              resource: 'authentication',
              details: { role: user.role },
              status: 'success',
            });
          } catch (logError) {
            console.error('Failed to log activity:', logError);
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
          };
        } catch (error) {
          // Handle known AuthErrors
          if (error instanceof AuthError) {
            throw error;
          }

          // Handle unexpected errors
          console.error('Authentication error:', error);

          // Handle Mongoose connection errors
          if (error instanceof Error) {
            if (error.message.includes('bufferCommands')) {
              throw new AuthError(
                'Database initialization in progress. Please try again.',
                'DATABASE_INITIALIZING',
                503
              );
            }

            if (error.message.includes('connection')) {
              throw new AuthError(
                'Database connection error. Please try again later.',
                'DATABASE_ERROR',
                503
              );
            }
          }

          throw new AuthError(
            'An unexpected error occurred during authentication. Please try again.',
            'AUTH_ERROR',
            500
          );
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Include all necessary fields in the JWT token
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,

  // Add error handler for better debugging
  debug: process.env.NODE_ENV === 'development',
};
