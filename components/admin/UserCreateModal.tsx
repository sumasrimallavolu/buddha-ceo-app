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
      <SheetContent side="right" className="w-full sm:max-w-md bg-slate-950 border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white">Create New User</SheetTitle>
          <SheetDescription className="text-slate-400">
            Add a new admin user to the system
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
          {error && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                User created successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
              <h3 className="text-sm font-semibold text-white">User Information</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                />
                <p className="text-xs text-slate-500">Password must be at least 6 characters</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
              <h3 className="text-sm font-semibold text-white">Role & Permissions</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-300">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content_manager">Content Manager</SelectItem>
                    <SelectItem value="content_reviewer">Content Reviewer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                <p className="text-xs text-slate-400 font-semibold mb-2">Role Permissions:</p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">• <strong className="text-slate-300">Content Manager:</strong> Can create and edit content (auto-publish enabled)</p>
                  <p className="text-xs text-slate-500">• <strong className="text-slate-300">Content Reviewer:</strong> Can review and approve/reject content</p>
                  <p className="text-xs text-slate-500">• <strong className="text-slate-300">Admin:</strong> View-only access to all features</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col gap-3 sm:flex-row border-t border-white/10 pt-6 px-6 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading || success}
            className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-blue-500/25"
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
