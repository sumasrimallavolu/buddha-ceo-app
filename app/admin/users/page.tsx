'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserPlus, MoreVertical, Edit, Trash, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { UserCreateModal, UserEditModal } from '@/components/admin';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setDeleting(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((u) => u._id !== userId));
      } else {
        setError('Failed to delete user');
      }
    } catch (error) {
      setError('An error occurred while deleting user');
    } finally {
      setDeleting(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: Shield,
        };
      case 'content_manager':
        return {
          label: 'Content Manager',
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: ShieldCheck,
        };
      case 'content_reviewer':
        return {
          label: 'Reviewer',
          className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: ShieldAlert,
        };
      default:
        return {
          label: role,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: Shield,
        };
    }
  };

  // Only admins can access user management
  if (session?.user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">
            Manage user accounts and permissions
          </p>
        </div>
        <UserCreateModal
          trigger={
            <Button className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          }
          onSuccess={fetchUsers}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            All Users ({users.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-slate-400 font-medium">Name</TableHead>
                <TableHead className="text-slate-400 font-medium">Email</TableHead>
                <TableHead className="text-slate-400 font-medium">Role</TableHead>
                <TableHead className="text-slate-400 font-medium">Created</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Shield className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const RoleIcon = roleBadge.icon;

                  return (
                    <TableRow key={user._id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{user.name}</TableCell>
                      <TableCell className="text-slate-400">{user.email}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${roleBadge.className}`}>
                          <RoleIcon className="h-3 w-3" />
                          {roleBadge.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                            <UserEditModal
                              userId={user._id}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              }
                              onSuccess={fetchUsers}
                            />
                            {user._id !== session?.user?.id && (
                              <DropdownMenuItem
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                                onClick={() => handleDelete(user._id)}
                                disabled={deleting === user._id}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {deleting === user._id ? 'Deleting...' : 'Delete'}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
