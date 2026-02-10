'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, CheckCircle2, Edit, Shield, Eye, UserCog } from 'lucide-react';
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

interface UserEditModalProps {
  userId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UserEditModal({
  userId,
  trigger,
  onSuccess,
  open: controlledOpen,
  onOpenChange,
}: UserEditModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = (value: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(value);
    } else {
      setOpen(value);
    }
  };

  const fetchUser = async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user');
      }

      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchUser();
      setError('');
      setSuccess(false);
    }
  }, [isOpen, userId]);

  const handleUpdateField = (field: string, value: any) => {
    setUser({
      ...user,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    if (!user.name || !user.email) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const updateData: Record<string, any> = {
        name: user.name,
        email: user.email,
        role: user.role,
      };

      if (user.password) {
        updateData.password = user.password;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  // Only admins can edit users
  if (session?.user.role !== 'admin') {
    return null;
  }

  if (fetching) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent side="right" className="w-full sm:max-w-md bg-slate-950 border-white/10">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="right" className="w-full sm:max-w-md bg-slate-950 border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <UserCog className="h-5 w-5 text-blue-400" />
            Edit User
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            Update user details and permissions
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
                User updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {user && (
            <>
              {/* User Information Card */}
              <Card className="bg-white/5 border-white/10">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                    <Edit className="h-4 w-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-white">User Information</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Full Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) => handleUpdateField('name', e.target.value)}
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
                        value={user.email}
                        onChange={(e) => handleUpdateField('email', e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">
                        New Password <span className="text-slate-500">(Optional)</span>
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={user.password || ''}
                        onChange={(e) => handleUpdateField('password', e.target.value)}
                        placeholder="Leave empty to keep current password"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                      {user.password && user.password.length < 6 && (
                        <p className="text-xs text-red-400">Password must be at least 6 characters</p>
                      )}
                      {!user.password && (
                        <p className="text-xs text-slate-500">Leave empty to keep current password</p>
                      )}
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
                        value={user.role}
                        onValueChange={(value) => handleUpdateField('role', value)}
                        disabled={user._id === session?.user.id}
                      >
                        <SelectTrigger id="role" className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-red-500" />
                              <span>Admin</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="content_manager">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-blue-500" />
                              <span>Content Manager</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="content_reviewer">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>Content Reviewer</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {user._id === session?.user.id && (
                        <p className="text-xs text-yellow-400 flex items-start gap-1">
                          <span className="mt-0.5">⚠️</span> You cannot change your own role
                        </p>
                      )}
                    </div>

                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs font-semibold text-white mb-2">
                        {user.role === 'admin' && 'Admin Permissions:'}
                        {user.role === 'content_manager' && 'Content Manager Permissions:'}
                        {user.role === 'content_reviewer' && 'Content Reviewer Permissions:'}
                      </p>
                      <div className="space-y-1 text-xs text-slate-400">
                        {user.role === 'admin' && (
                          <>
                            <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Full system access</p>
                            <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Manage all users</p>
                            <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Approve/reject content</p>
                          </>
                        )}
                        {user.role === 'content_manager' && (
                          <>
                            <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Create and edit content (with auto-publish)</p>
                            <p className="flex items-start gap-1"><span className="text-green-400">✓</span> Submit for review</p>
                            <p className="flex items-start gap-1"><span className="text-yellow-400">!</span> Needs reviewer approval for some content</p>
                          </>
                        )}
                        {user.role === 'content_reviewer' && (
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
            </>
          )}
        </div>

        <SheetFooter className="border-t border-white/10 pt-6">
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
                Saving...
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
