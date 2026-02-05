# Dynamic Content System Documentation

## Overview

The Dynamic Content System allows administrators to create, edit, and manage various types of content that can be displayed throughout the website. Content is stored in MongoDB and managed through an admin interface with role-based permissions.

## Content Types

The system supports the following content types:

1. **Photo Collage** (`photo_collage`) - Multiple photos in grid/masonry/slider layouts
2. **Video Content** (`video_content`) - YouTube/Vimeo embedded videos
3. **Book Publication** (`book_publication`) - Books with covers, authors, download/purchase links
4. **Mixed Media** (`mixed_media`) - Rich text articles with embedded media
5. **Testimonial** (`testimonial`) - User testimonials with quotes/videos
6. **Team Member** (`team_member`) - Team member profiles
7. **Achievement** (`achievement`) - Achievements with highlights
8. **Service** (`service`) - Vision/mission descriptions
9. **Poster** (`poster`) - Simple posters/images

## Content Workflow

Content goes through the following workflow states:

- **draft** - Content is being created/edited
- **pending_review** - Waiting for reviewer approval
- **published** - Live on the website
- **archived** - Hidden but preserved

## Database Schema

### Content Model

```typescript
{
  title: string;              // Content title
  type: ContentType;          // Type of content
  status: ContentStatus;      // Workflow status
  content: Record<string, any>;  // Flexible content data
  createdBy: ObjectId;        // User who created
  reviewedBy?: ObjectId;      // User who reviewed
  rejectionReason?: string;   // Reason if rejected
  thumbnailUrl?: string;      // Preview image
  layout?: ContentLayout;     // For photo collages
  mediaOrder?: string[];      // Order of media items
  isFeatured?: boolean;       // Highlight on homepage
  publishedAt?: Date;         // When published
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Public APIs

- `GET /api/content/public` - Fetch published content
  - Query params: `type`, `limit`, `featured`, `skip`

### Admin APIs

- `GET /api/admin/content` - List all content (with filters)
  - Query params: `status`, `type`
- `POST /api/admin/content` - Create new content
- `GET /api/admin/content/[id]` - Get single content
- `PUT /api/admin/content/[id]` - Update content (draft only)
- `DELETE /api/admin/content/[id]` - Delete content
- `POST /api/admin/content/[id]/submit` - Submit for review
- `POST /api/admin/content/[id]/approve` - Approve content
- `POST /api/admin/content/[id]/reject` - Reject content

## React Hooks

### useDynamicContent

Fetch dynamic content from the database with filtering options.

```typescript
import { useDynamicContent } from '@/lib/hooks/useDynamicContent';

function MyComponent() {
  const { data, loading, error, refetch } = useDynamicContent({
    type: 'team_member',
    status: 'published',
    isFeatured: false,
    limit: 10,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item._id}>{item.title}</div>
      ))}
    </div>
  );
}
```

### useContentType

Convenience hook for fetching a specific content type.

```typescript
import { useContentType } from '@/lib/hooks/useDynamicContent';

const { data } = useContentType('video_content');
```

### useFeaturedContent

Fetch featured content for homepage display.

```typescript
import { useFeaturedContent } from '@/lib/hooks/useDynamicContent';

const { data } = useFeaturedContent('photo_collage');
```

## Modal Components

### ContentCreateModal

Quick content creation modal.

```typescript
import { ContentCreateModal } from '@/components/admin';
import { Button } from '@/components/ui/button';

function AdminPage() {
  return (
    <ContentCreateModal
      defaultType="photo_collage"
      onSuccess={() => {
        // Refresh content list
      }}
      trigger={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      }
    />
  );
}
```

### ContentEditModal

Quick content editing modal.

```typescript
import { ContentEditModal } from '@/components/admin';

function ContentItem({ contentId }) {
  return (
    <ContentEditModal
      contentId={contentId}
      onSuccess={() => {
        // Refresh content
      }}
      trigger={
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      }
    />
  );
}
```

## Converting Static Components to Dynamic

### Example: Team Members

**Before (Static):**
```typescript
const teamMembers = [
  { name: 'Dr. Chandra', role: 'CEO', ... },
  // ... hardcoded data
];
```

**After (Dynamic):**
```typescript
import { useContentType } from '@/lib/hooks/useDynamicContent';

export function TeamMembers() {
  const { data: teamMembersData, loading } = useContentType('team_member');

  const teamMembers = teamMembersData.map((item) => ({
    name: item.title,
    role: item.content.role,
    image: item.content.image,
    bio: item.content.bio,
  }));

  // Fallback to static data if no dynamic content
  const displayMembers = teamMembers.length > 0 ? teamMembers : fallbackTeamMembers;

  return <div>{/* render displayMembers */}</div>;
}
```

## Admin Pages

### Create New Content

Navigate to `/admin/content/new` to access the full content creation form.

### Edit Existing Content

Navigate to `/admin/content/edit/[id]` to edit existing draft content.

### Review Content

Navigate to `/admin/content/review/[id]` to review and approve/reject pending content.

### Content Management

Navigate to `/admin/content` to see all content with filters and bulk actions.

## Creating New Content Types

To add a new content type:

1. **Update the Content model** (`lib/models/Content.ts`):
   ```typescript
   export type ContentType =
     | 'poster'
     | 'testimonial'
     | 'your_new_type'  // Add here
     // ...
   ```

2. **Add form fields** in the create/edit pages

3. **Add preview rendering** in the review page

4. **Add display component** in the appropriate page

## Best Practices

1. **Always use fallback data** - Static data should be preserved as fallback
2. **Validate before submission** - Ensure required fields are present
3. **Use appropriate content types** - Choose the right type for your content
4. **Feature strategically** - Only feature important content on homepage
5. **Test preview** - Always preview before submitting for review
6. **Handle loading states** - Show appropriate loading indicators
7. **Error handling** - Provide meaningful error messages

## Role-Based Permissions

- **Admin**: Full access to create, edit, review, approve, reject, delete
- **Content Manager**: Can create and edit own draft content, submit for review
- **Content Reviewer**: Can review, approve, or reject pending content

## Content Status Rules

- Only draft content can be edited
- Only draft content can be deleted
- Only draft content can be submitted for review
- Only pending_review content can be approved/rejected
- Published content cannot be edited (must create new version)
