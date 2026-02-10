# Email Templates Integration Guide

This guide shows you how to integrate the email confirmation templates into your existing API routes.

## 🎯 Quick Integration Examples

### 1. Event Registration Confirmation

Add this to `app/api/events/[id]/register/route.ts` after successfully creating the registration:

```typescript
import { sendEventRegistrationConfirmation } from '@/lib/email-helpers';

// After creating the registration
const registration = await EventRegistration.create({
  eventId: params.id,
  name: data.name,
  email: data.email,
  phone: data.phone,
  city: data.city,
  profession: data.profession,
});

// Send confirmation email
try {
  await sendEventRegistrationConfirmation({
    name: registration.name,
    email: registration.email,
    eventTitle: event.title,
    eventDate: new Date(event.startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    eventTime: new Date(event.startDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' - ' + new Date(event.endDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    eventLocation: event.location?.online 
      ? 'Online Event (Link will be sent 24 hours before)' 
      : `${event.location?.venue || 'TBA'}, ${event.location?.city || ''}`,
    isOnline: event.location?.online || false,
    registeredAt: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  });
  console.log('✅ Event registration confirmation email sent');
} catch (emailError) {
  console.error('❌ Failed to send event confirmation email:', emailError);
  // Don't fail the registration if email fails
}
```

### 2. Teacher Application Confirmation

Add this to `app/api/teacher-application/route.ts` after saving the application:

```typescript
import { sendTeacherApplicationConfirmation } from '@/lib/email-helpers';

// After creating the application
const application = await TeacherApplication.create({
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  // ... other fields
});

// Send confirmation email
try {
  await sendTeacherApplicationConfirmation({
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    submittedAt: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  });
  console.log('✅ Teacher application confirmation email sent');
} catch (emailError) {
  console.error('❌ Failed to send teacher confirmation email:', emailError);
}
```

### 3. Volunteer Application Confirmation

Add this to `app/api/volunteer-opportunities/[id]/apply/route.ts` after saving the application:

```typescript
import { sendVolunteerApplicationConfirmation } from '@/lib/email-helpers';

// After creating the application
const application = await VolunteerApplication.create({
  opportunityId: params.id,
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  // ... other fields
});

// Send confirmation email
try {
  await sendVolunteerApplicationConfirmation({
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    opportunityTitle: opportunity.title,
    submittedAt: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  });
  console.log('✅ Volunteer application confirmation email sent');
} catch (emailError) {
  console.error('❌ Failed to send volunteer confirmation email:', emailError);
}
```

### 4. Teacher Enrollment Confirmation

Add this to `app/api/teacher-enrollment/route.ts` after saving the enrollment:

```typescript
import { sendTeacherApplicationConfirmation } from '@/lib/email-helpers';

// After creating the enrollment
const enrollment = await TeacherEnrollment.create({
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  // ... other fields
});

// Send confirmation email (using the same template as teacher application)
try {
  await sendTeacherApplicationConfirmation({
    firstName: enrollment.firstName,
    lastName: enrollment.lastName,
    email: enrollment.email,
    submittedAt: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  });
  console.log('✅ Teacher enrollment confirmation email sent');
} catch (emailError) {
  console.error('❌ Failed to send teacher enrollment confirmation email:', emailError);
}
```

## 🔐 Admin Approval Emails

### Teacher Approval

Create a new admin API route: `app/api/admin/teachers/[id]/approve/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TeacherApplication } from '@/lib/models';
import { sendTeacherApproval } from '@/lib/email-helpers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { trainingStartDate, nextSteps } = body;

    // Update application status
    const application = await TeacherApplication.findByIdAndUpdate(
      params.id,
      {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: session.user.id,
      },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Send approval email
    await sendTeacherApproval({
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      approvedAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      trainingStartDate,
      nextSteps: nextSteps || 'Our program coordinator will contact you within 48 hours to schedule your welcome call and provide training materials.',
    });

    console.log('✅ Teacher approval email sent');

    return NextResponse.json({ 
      success: true, 
      message: 'Teacher application approved and email sent' 
    });

  } catch (error: any) {
    console.error('Error approving teacher:', error);
    return NextResponse.json(
      { error: 'Failed to approve application', details: error.message },
      { status: 500 }
    );
  }
}
```

### Volunteer Approval

Create a new admin API route: `app/api/admin/volunteers/[id]/approve/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { VolunteerApplication } from '@/lib/models';
import { sendVolunteerApproval } from '@/lib/email-helpers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { startDate, contactPerson, contactEmail, nextSteps } = body;

    // Update application status
    const application = await VolunteerApplication.findByIdAndUpdate(
      params.id,
      {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: session.user.id,
      },
      { new: true }
    ).populate('opportunityId');

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Send approval email
    await sendVolunteerApproval({
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      opportunityTitle: application.opportunityId?.title || 'Volunteer Opportunity',
      approvedAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      startDate,
      contactPerson,
      contactEmail,
      nextSteps: nextSteps || 'You will receive orientation details and schedule within the next 24-48 hours. Welcome to the team!',
    });

    console.log('✅ Volunteer approval email sent');

    return NextResponse.json({ 
      success: true, 
      message: 'Volunteer application approved and email sent' 
    });

  } catch (error: any) {
    console.error('Error approving volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to approve application', details: error.message },
      { status: 500 }
    );
  }
}
```

## 📋 Complete Integration Checklist

- [ ] Add event registration confirmation to event registration API
- [ ] Add teacher application confirmation to teacher application API
- [ ] Add teacher enrollment confirmation to teacher enrollment API
- [ ] Add volunteer application confirmation to volunteer application API
- [ ] Create admin approval route for teachers
- [ ] Create admin approval route for volunteers
- [ ] Add approval UI in admin dashboard
- [ ] Test all email templates in development
- [ ] Verify email delivery in production

## 🧪 Testing Your Integration

1. **Test Email Sending:**
```bash
# Make sure your .env.local has:
RESEND_API_KEY=your_api_key
EMAIL_FROM=onboarding@resend.dev  # Use resend.dev for testing
```

2. **Test Each Flow:**
   - Register for an event → Check for confirmation email
   - Submit teacher application → Check for confirmation email
   - Submit volunteer application → Check for confirmation email
   - Approve teacher (admin) → Check for approval email
   - Approve volunteer (admin) → Check for approval email

3. **Check Logs:**
```bash
# You should see these in your terminal:
✅ Event registration confirmation email sent
✅ Teacher application confirmation email sent
✅ Volunteer application confirmation email sent
```

## 🎨 Customization Tips

1. **Change Email Subjects:**
   Edit `lib/email-helpers.ts` and modify the `subject` field

2. **Modify Template Design:**
   Edit the respective template files in `lib/email-templates/`

3. **Add More Data:**
   Update the TypeScript interfaces and add more fields to templates

4. **Translations:**
   Create locale-specific versions of templates

## 🚀 Production Deployment

Before going live:

1. **Verify Sender Domain:**
   - Go to Resend dashboard
   - Add your domain (e.g., `buddhaceo.com`)
   - Add DNS records
   - Verify domain

2. **Update Environment Variable:**
```env
EMAIL_FROM=notifications@buddhaceo.com
```

3. **Test Production Emails:**
   - Send test emails to different email providers
   - Check spam folder placement
   - Verify all links work

4. **Monitor Email Delivery:**
   - Set up Resend webhooks
   - Track bounce rates
   - Monitor delivery failures

## 📊 Monitoring & Analytics

Add email analytics by tracking:
- Email open rates (via Resend dashboard)
- Link click rates
- Delivery success/failure rates
- User engagement post-email

## 🆘 Troubleshooting

**Emails not sending?**
- Check `RESEND_API_KEY` is set
- Verify sender domain is verified
- Check terminal logs for errors
- Review Resend dashboard for failures

**Emails going to spam?**
- Verify your domain in Resend
- Add SPF, DKIM, DMARC records
- Avoid spammy content
- Include unsubscribe link

**Wrong email format?**
- Check date formatting
- Verify all required fields are passed
- Test HTML rendering in email clients

## 🎯 Next Steps

1. Integrate confirmation emails in all API routes
2. Create admin approval routes and UI
3. Test thoroughly in development
4. Deploy to production
5. Monitor email delivery
6. Gather user feedback
7. Iterate and improve templates

---

**Need Help?** Check the main documentation in `lib/email-templates/README.md`
