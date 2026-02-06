import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import connectDB from '@/lib/mongodb';
import { ActivityLog } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const session = await requirePermission('view:stats');

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const status = searchParams.get('status');

    // Build query
    const query: any = {};

    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (status) query.status = status;

    // Get logs with pagination
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(query),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error?.digest === 'NEXT_REDIRECT') {
      throw error;
    }

    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
