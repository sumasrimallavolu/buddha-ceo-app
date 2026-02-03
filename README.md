# Meditation Institute Website

A comprehensive website for a Meditation Institute with dynamic content management, role-based access control, and public-facing pages.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js v5
- **Deployment:** Vercel

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas account)
- Git (optional)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/meditation-institute
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create an account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and paste it in `.env.local` as `MONGODB_URI`

### 4. Seed the Database

```bash
npm run db:seed
```

This will create:
- 3 users (admin, content manager, content reviewer)
- Sample events
- Sample testimonials
- Sample achievements
- Sample resources

**Login Credentials:**
- **Admin:** admin@meditation.org / admin123
- **Content Manager:** manager@meditation.org / manager123
- **Content Reviewer:** reviewer@meditation.org / reviewer123

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Pages

### Public Pages (No Login Required)
- **Home** (/) - Hero, testimonials, recent events
- **About** (/about) - Achievements, CEO, vision, mission, team, services
- **Resources** (/resources) - Books, videos, magazines, links
- **Events** (/events) - Event listings and registration
- **Contact** (/contact) - Contact form and information

### Admin Pages (Login Required)
- **Login** (/login) - Admin login
- **Dashboard** (/admin) - Admin dashboard (coming soon)
- **User Management** (/admin/users) - Manage users (admin only)
- **Content Management** (/admin/content) - CMS for all content
- **Event Management** (/admin/events) - Manage events
- **Resource Management** (/admin/resources) - Manage resources
- **Contact Messages** (/admin/contact-messages) - View contact form submissions
- **Newsletter** (/admin/subscribers) - Manage subscribers

## User Roles

### Admin
- Create and manage users
- Full access to all features
- Can perform all content manager and reviewer tasks

### Content Manager
- Create and edit content
- Submit content for review
- View own content
- Cannot publish without reviewer approval

### Content Reviewer
- Review submitted content
- Approve or reject content
- View all content
- Access to all admin features

## Project Structure

```
meditation-institute/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (public)/        # Public pages
│   ├── (admin)/         # Admin pages
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Header, Footer
│   ├── home/            # Home page components
│   ├── about/           # About page components
│   └── forms/           # Form components
├── lib/
│   ├── mongodb.ts       # MongoDB connection
│   ├── models/          # Mongoose models
│   ├── auth.ts          # NextAuth config
│   └── seed.ts          # Database seed script
├── types/               # TypeScript definitions
├── middleware.ts        # NextAuth middleware
└── public/              # Static assets
```

## API Routes

- `/api/auth/[...nextauth]` - NextAuth authentication
- `/api/contact` - Contact form submissions
- `/api/subscribers` - Newsletter subscriptions
- More routes to be added for admin features

## Database Models

- **User** - User accounts with roles
- **Content** - Generic CMS for posters, testimonials, team members, etc.
- **Event** - Events and programs
- **Registration** - Event registrations
- **Resource** - Resources (books, videos, magazines, links)
- **ContactMessage** - Contact form submissions
- **Subscriber** - Newsletter subscribers

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
MONGODB_URI=<your-mongodb-atlas-connection-string>
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<your-generated-secret>
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Development

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## Features Implemented

✅ Project setup with Next.js 15 and TypeScript
✅ Database models with Mongoose (7 models)
✅ Authentication with NextAuth.js v5
✅ Role-based access control (Admin, Content Manager, Content Reviewer)
✅ Public pages (Home, About, Resources, Events, Contact)
✅ Layout components (Header, Footer with newsletter)
✅ Admin dashboard with statistics
✅ User management system (CRUD operations)
✅ Content management system with approval workflow
✅ Event management interface
✅ Resource management interface
✅ Contact messages inbox
✅ Newsletter subscriber management
✅ Contact form API
✅ Newsletter subscription API
✅ All admin API routes with proper authorization
✅ Responsive design with Tailwind CSS
✅ shadcn/ui components
✅ Database seed script with sample data
✅ Protected routes with middleware

## API Routes Implemented

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `GET /api/admin/stats` - Dashboard statistics

### User Management (Admin Only)
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### Content Management
- `GET /api/admin/content` - List content with filters
- `POST /api/admin/content` - Create content
- `PUT /api/admin/content/[id]` - Update content
- `DELETE /api/admin/content/[id]` - Delete content
- `POST /api/admin/content/[id]/submit` - Submit for review
- `POST /api/admin/content/[id]/approve` - Approve content
- `POST /api/admin/content/[id]/reject` - Reject content

### Event Management
- `GET /api/admin/events` - List all events
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/[id]` - Update event
- `DELETE /api/admin/events/[id]` - Delete event

### Resource Management
- `GET /api/admin/resources` - List all resources
- `POST /api/admin/resources` - Create resource
- `PUT /api/admin/resources/[id]` - Update resource
- `DELETE /api/admin/resources/[id]` - Delete resource

### Contact Messages
- `POST /api/contact` - Submit contact form
- `GET /api/admin/contact-messages` - List all messages
- `PUT /api/admin/contact-messages/[id]` - Update message status
- `DELETE /api/admin/contact-messages/[id]` - Delete message

### Newsletter Subscribers
- `POST /api/subscribers` - Subscribe to newsletter
- `GET /api/admin/subscribers` - List all subscribers

## To Be Implemented

⏳ Content creation forms (rich text editor)
⏳ Event creation/edit forms
⏳ Resource upload functionality (PDF files, images)
⏳ Email notifications for new registrations
⏳ Email notifications for new contact messages
⏳ Event registration system for public users
⏳ File upload integration with Vercel Blob
⏳ Search functionality across content
⏳ Advanced filtering and sorting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is proprietary and confidential.

## Support

For support, email info@meditation.org or contact through the website.
