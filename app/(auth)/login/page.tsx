'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

/**
 * Error code to message mapping
 */
const ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  MISSING_CREDENTIALS: 'Email and password are required',
  INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_ERROR: 'An unexpected error occurred during authentication. Please try again.',

  // Database errors
  DATABASE_CONNECTION_ERROR: 'Database connection failed. Please try again later.',
  DATABASE_TIMEOUT: 'Database connection timeout. Please try again.',
  DATABASE_NOT_CONNECTED: 'Database not connected. Please try again.',
  DATABASE_INITIALIZING: 'Database initialization in progress. Please try again.',
  DATABASE_ERROR: 'Database connection error. Please try again later.',

  // MongoDB specific errors (raw error messages from mongodb.ts)
  'MongoDB Atlas DNS resolution failed': 'Cannot connect to MongoDB Atlas. Please check your MONGODB_URI.',
  'MongoDB authentication failed': 'Database authentication failed. Please check your credentials.',
  'Cannot reach MongoDB server': 'Cannot reach database server. Please check your network connection.',
  'MongoDB connection timeout': 'Database connection timeout. Please check your network connection.',

  // Default fallback
  DEFAULT: 'An error occurred. Please try again.',
};

/**
 * Get user-friendly error message from error code or raw error
 */
function getErrorMessage(error?: string): string {
  if (!error) return '';

  // Try to match exact error code
  if (error in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error];
  }

  // Check for partial matches with MongoDB error messages
  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (!key.includes('_') && error.toLowerCase().includes(key.toLowerCase())) {
      return message;
    }
  }

  // Return the error as-is if it looks like a user-friendly message
  if (error.includes(' ') && !error.includes('_') && !error.includes('MONGODB_URI')) {
    return error;
  }

  // Default fallback
  return ERROR_MESSAGES.DEFAULT;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for error in URL on mount
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      // Try to decode the error if it's URL encoded
      try {
        const decodedError = decodeURIComponent(urlError);
        setError(getErrorMessage(decodedError));
      } catch {
        setError(getErrorMessage(urlError));
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(getErrorMessage(result.error));
      } else if (result?.ok) {
        // Fetch session to check user role
        const sessionResponse = await fetch('/api/auth/session');
        const session = await sessionResponse.json();

        // Redirect based on role
        if (session?.user?.role === 'user') {
          router.push('/dashboard');
        } else if (session?.user?.role === 'content_reviewer') {
          router.push('/admin/content');
        } else {
          router.push('/admin');
        }
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(ERROR_MESSAGES.DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-2 w-full mt-0">
          <div className="flex justify-center bg-white p-3  rounded-xl">
                            <Link href="/" className="flex items-center group mx-2">
                                <img src="https://static.wixstatic.com/media/ea3b9d_245553e655454481beb6d6201be19c80~mv2.png/v1/fill/w_357,h_94,al_c,lg_1,q_85,enc_avif,quality_auto/255x69%20%20Pixel%20Header%20Logo.png" alt="Meditation Institute" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"/>
                            </Link>
                        </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <p className="text-slate-400 text-sm">
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@meditation.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-blue-500/40"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-slate-400 hover:text-blue-400 transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform mr-1">←</span>
              Back to website
            </Link>
          </div>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Role Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-slate-500 text-center">
              Admins: Sign in to manage your website data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
