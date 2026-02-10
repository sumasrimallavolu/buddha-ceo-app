'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
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
import { Loader2, CheckCircle2, UserPlus, Shield, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface UserCreateModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UserCreateModal({
  trigger,
  onSuccess,
  open: controlledOpen,
  onOpenChange,
}: UserCreateModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'content_manager',
  });

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = (value: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(value);
    } else {
      setOpen(value);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'content_manager',
    });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        resetForm();
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Only admins can create users
  if (session?.user.role !== 'admin') {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={(value) => {
      setIsOpen(value);
      if (!value) resetForm();
    }}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="right" className="w-full sm:max-w-md bg-slate-900 border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white">Create New User</SheetTitle>
          <SheetDescription className="text-slate-400">
            Add a new admin user to the system
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                User created successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* User Information Card */}
          <Card className="bg-white/5 border-white/10">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <UserPlus className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">User Information</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-slate-500">
                    Password must be at least 6 characters
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Role & Permissions Card */}
          <Card className="bg-white/5 border-white/10">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Shield className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Role & Permissions</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">
                    Role <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger id="role" className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-red-500" />
                          <div className="flex flex-col">
                            <span className="font-medium">Admin</span>
                            <span className="text-xs text-gray-500">Full system access</span>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="content_manager">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-blue-500" />
                          <div className="flex flex-col">
                            <span className="font-medium">Content Manager</span>
                            <span className="text-xs text-gray-500">Can create and edit content</span>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="content_reviewer">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <div className="flex flex-col">
                            <span className="font-medium">Content Reviewer</span>
                            <span className="text-xs text-gray-500">Can review and approve content</span>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-white mb-2">
                    {formData.role === 'admin' && 'Admin Permissions:'}
                    {formData.role === 'content_manager' && 'Content Manager Permissions:'}
                    {formData.role === 'content_reviewer' && 'Content Reviewer Permissions:'}
                  </p>
                  <div className="space-y-1 text-xs text-slate-400">
                    {formData.role === 'admin' && (
                      <>
                        <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Full system access</p>
                        <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Manage all users</p>
                        <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Approve/reject content</p>
                      </>
                    )}
                    {formData.role === 'content_manager' && (
                      <>
                        <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Create and edit content</p>
                        <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Submit for review</p>
                        <p className="flex items-start gap-1"><span className="text-yellow-400">!</span> Needs reviewer approval</p>
                      </>
                    )}
                    {formData.role === 'content_reviewer' && (
                      <>
                        <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Review content</p>
                        <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Approve/reject content</p>
                        <p className="flex items-start gap-1"><span className="text-green-400">✓</span> View all content</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <SheetFooter className="flex-col gap-3 sm:flex-row border-t border-white/10 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading || success}
            className="border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
            onClick={handleSubmit}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
