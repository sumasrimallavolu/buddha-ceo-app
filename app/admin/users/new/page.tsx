'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, CheckCircle2, UserPlus, Shield, Eye } from 'lucide-react';
import Link from 'next/link';

export default function NewUserPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'content_manager',
  });

  // Redirect non-admin users
  if (session?.user?.role !== 'admin') {
    router.push('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/users');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <UserPlus className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create New User</h1>
              <p className="text-sm text-slate-400">
                Add a new user to the admin panel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            User created successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information Card */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white">User Information</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              Basic user details and credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white"
                  required
                  minLength={6}
                />
                <p className="text-xs text-slate-500">
                  Must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role & Permissions Card */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Role & Permissions</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              Assign user role and access level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Role <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="role" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">Admin</span>
                        <span className="text-xs text-muted-foreground">
                          Full access to all features
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="content_manager">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">Content Manager</span>
                        <span className="text-xs text-muted-foreground">
                          Create and edit content
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="content_reviewer">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">Content Reviewer</span>
                        <span className="text-xs text-muted-foreground">
                          Review and approve content
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Description */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                {formData.role === 'admin' && <><Shield className="h-4 w-4 text-red-400" /> Admin Permissions</>}
                {formData.role === 'content_manager' && <><Eye className="h-4 w-4 text-blue-400" /> Content Manager Permissions</>}
                {formData.role === 'content_reviewer' && <><CheckCircle2 className="h-4 w-4 text-green-400" /> Content Reviewer Permissions</>}
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {formData.role === 'admin' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      Create and manage user accounts
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      Full access to all admin features
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      Approve or reject any content
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      Manage events, resources, and all content
                    </li>
                  </>
                )}
                {formData.role === 'content_manager' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      Create and edit content
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      Submit content for review
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      View own content
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">!</span>
                      Cannot publish without reviewer approval
                    </li>
                  </>
                )}
                {formData.role === 'content_reviewer' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      Review submitted content
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      Approve or reject content
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      View all content
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      Access to most admin features
                    </li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Link href="/admin/users">
            <Button 
              type="button" 
              variant="outline" 
              disabled={loading}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating User...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
