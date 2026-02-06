import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import { User, logActivity } from './models';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          // Log failed login attempt - user not found
          await logActivity({
            userId: 'unknown',
            userName: 'Unknown',
            userEmail: credentials.email,
            action: 'login_attempt',
            resource: 'authentication',
            details: { reason: 'User not found' },
            status: 'failure',
          });
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          // Log failed login attempt - invalid password
          await logActivity({
            userId: user._id.toString(),
            userName: user.name,
            userEmail: user.email,
            action: 'login_attempt',
            resource: 'authentication',
            details: { reason: 'Invalid password' },
            status: 'failure',
          });
          throw new Error('Invalid email or password');
        }

        // Log successful login
        await logActivity({
          userId: user._id.toString(),
          userName: user.name,
          userEmail: user.email,
          action: 'login',
          resource: 'authentication',
          details: { role: user.role },
          status: 'success',
        });

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
