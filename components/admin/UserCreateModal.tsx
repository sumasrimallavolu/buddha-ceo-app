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
import { Loader2, CheckCircle2, UserPlus } from 'lucide-react';
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
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                User created successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* User Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              User Information
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-600">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-600">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-600">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 6 characters
                </p>
              </div>
            </div>
          </div>

          {/* Role & Permissions */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Role & Permissions
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role <span className="text-red-600">*</span></Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content_manager">
                      <div className="flex flex-col">
                        <span className="font-medium">Content Manager</span>
                        <span className="text-xs text-gray-500">
                          Can create and edit content
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="content_reviewer">
                      <div className="flex flex-col">
                        <span className="font-medium">Content Reviewer</span>
                        <span className="text-xs text-gray-500">
                          Can review and approve content
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex flex-col">
                        <span className="font-medium">Admin</span>
                        <span className="text-xs text-gray-500">
                          Full system access
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Role Permissions:
                </p>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>• <strong className="text-gray-900 dark:text-gray-200">Content Manager:</strong> Can create and edit content</p>
                  <p>• <strong className="text-gray-900 dark:text-gray-200">Content Reviewer:</strong> Can review and approve/reject content</p>
                  <p>• <strong className="text-gray-900 dark:text-gray-200">Admin:</strong> Full system access</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col gap-3 sm:flex-row border-t border-gray-200 dark:border-gray-700 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading || success}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white"
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
