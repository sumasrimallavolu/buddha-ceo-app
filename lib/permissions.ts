import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export type UserRole = 'admin' | 'content_manager' | 'content_reviewer';

// Role hierarchy - higher number = more permissions
const ROLE_LEVELS: Record<UserRole, number> = {
  admin: 3,
  content_manager: 2,
  content_reviewer: 1,
};

// Permissions by role
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'view:dashboard',
    'view:users',
    'view:content',
    'review:content',
    'publish:content',
    'view:events',
    'view:resources',
    'view:messages',
    'delete:message',
    'view:subscribers',
    'delete:subscriber',
    'view:teacher_applications',
    'edit:teacher_application',
    'delete:teacher_application',
    'view:volunteer_applications',
    'edit:volunteer_application',
    'delete:volunteer_application',
    'view:stats',
    'manage:settings',
  ],
  content_manager: [
    'view:dashboard',
    'view:content',
    'create:content',
    'edit:own_content',
    'delete:own_content',
    'submit:content',
    'view:events',
    'create:event',
    'edit:own_event',
    'delete:own_event',
    'view:resources',
    'create:resource',
    'edit:own_resource',
    'delete:own_resource',
    'view:messages',
    'view:subscribers',
    'view:teacher_applications',
    'view:volunteer_applications',
    'view:stats',
  ],
  content_reviewer: [
    'view:dashboard',
    'view:content',
    'review:content',
    'approve:content',
    'reject:content',
    'view:events',
    'view:resources',
    'view:messages',
    'view:subscribers',
    'view:teacher_applications',
    'view:volunteer_applications',
    'view:stats',
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

/**
 * Check if user role has required level or higher
 */
export function hasRoleLevel(userRole: UserRole, requiredLevel: number): boolean {
  return ROLE_LEVELS[userRole] >= requiredLevel;
}

/**
 * Get server session with user and redirect if not authenticated
 */
export async function getAuthenticatedSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  return session;
}

/**
 * Require specific role for server components
 */
export async function requireRole(requiredRole: UserRole) {
  const session = await getAuthenticatedSession();

  if (!hasRoleLevel(session.user.role as UserRole, ROLE_LEVELS[requiredRole])) {
    redirect('/admin?error=insufficient_permissions');
  }

  return session;
}

/**
 * Require specific permission for server components
 */
export async function requirePermission(permission: string) {
  const session = await getAuthenticatedSession();

  if (!hasPermission(session.user.role as UserRole, permission)) {
    redirect('/admin?error=insufficient_permissions');
  }

  return session;
}

/**
 * Check if user can edit content (content_manager only)
 */
export function canEditContent(userRole: UserRole, contentUserId?: string): boolean {
  return userRole === 'content_manager';
}

/**
 * Check if user can delete content (content_manager only)
 */
export function canDeleteContent(userRole: UserRole): boolean {
  return userRole === 'content_manager';
}

/**
 * Check if user can review content
 */
export function canReviewContent(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'content_reviewer';
}

/**
 * Check if user can publish content (content_manager only)
 */
export function canPublishContent(userRole: UserRole): boolean {
  return userRole === 'content_manager';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    admin: 'Administrator',
    content_manager: 'Content Manager',
    content_reviewer: 'Content Reviewer',
  };
  return names[role] || role;
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * API route middleware to check permissions
 */
export function apiRequirePermission(permission: string) {
  return async (req: Request) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!hasPermission(session.user.role as UserRole, permission)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return session;
  };
}

/**
 * API route middleware to check role
 */
export function apiRequireRole(requiredRole: UserRole) {
  return async (req: Request) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!hasRoleLevel(session.user.role as UserRole, ROLE_LEVELS[requiredRole])) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return session;
  };
}
