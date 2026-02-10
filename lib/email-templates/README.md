# Email Templates Documentation

This directory contains professionally designed HTML email templates for various user interactions in the Buddha CEO application.

## 📧 Available Templates

### 1. Teacher Application Confirmation
**File:** `teacher-application-confirmation.ts`  
**Purpose:** Sent immediately after a teacher submits their application  
**Features:**
- Confirmation of application receipt
- Application details summary
- Next steps timeline (review, interview, training)
- Professional gradient design (purple theme)

### 2. Volunteer Application Confirmation
**File:** `volunteer-application-confirmation.ts`  
**Purpose:** Sent immediately after a volunteer submits their application  
**Features:**
- Thank you message and impact statement
- Opportunity details card
- Review timeline (3-5 business days)
- Warm, welcoming design (green theme)

### 3. Event Registration Confirmation
**File:** `event-registration-confirmation.ts`  
**Purpose:** Sent immediately after someone registers for an event  
**Features:**
- Event details (date, time, location)
- Online vs in-person event handling
- Important reminders checklist
- What to bring/prepare
- Modern design (blue/purple gradient)

### 4. Teacher Approval
**File:** `teacher-approval.ts`  
**Purpose:** Sent when a teacher application is approved  
**Features:**
- Celebration banner
- Training program information
- Detailed next steps
- Benefits list
- Mentorship details
- Inspiring design (green success theme)

### 5. Volunteer Approval
**File:** `volunteer-approval.ts`  
**Purpose:** Sent when a volunteer application is approved  
**Features:**
- Welcome message
- Start date information
- Point of contact details
- Volunteer guidelines
- Inspirational quote
- Vibrant design (pink/purple gradient)

## 🚀 Usage

### Basic Usage

```typescript
import {
  sendTeacherApplicationConfirmation,
  sendVolunteerApplicationConfirmation,
  sendEventRegistrationConfirmation,
  sendTeacherApproval,
  sendVolunteerApproval,
} from '@/lib/email-helpers';

// Send teacher application confirmation
await sendTeacherApplicationConfirmation({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  submittedAt: 'January 15, 2024 at 10:30 AM',
});

// Send event registration confirmation
await sendEventRegistrationConfirmation({
  name: 'Jane Smith',
  email: 'jane@example.com',
  eventTitle: 'Mindfulness Meditation Workshop',
  eventDate: 'Saturday, February 10, 2024',
  eventTime: '10:00 AM - 12:00 PM EST',
  eventLocation: 'Zoom Online Event',
  isOnline: true,
  registeredAt: 'January 15, 2024',
});

// Send teacher approval
await sendTeacherApproval({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  approvedAt: 'January 20, 2024',
  trainingStartDate: 'February 1, 2024',
  nextSteps: 'Our program coordinator will contact you within 48 hours.',
});
```

### Integration with API Routes

#### Example: Event Registration

```typescript
// app/api/events/[id]/register/route.ts
import { sendEventRegistrationConfirmation } from '@/lib/email-helpers';

export async function POST(request: NextRequest) {
  // ... registration logic ...

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
      eventTime: `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`,
      eventLocation: event.location.online 
        ? 'Zoom Online Event' 
        : `${event.location.venue}, ${event.location.city}`,
      isOnline: event.location.online,
      registeredAt: new Date().toLocaleDateString('en-US'),
    });
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
    // Don't fail the registration if email fails
  }

  return NextResponse.json({ success: true });
}
```

#### Example: Teacher Application

```typescript
// app/api/teacher-application/route.ts
import { sendTeacherApplicationConfirmation } from '@/lib/email-helpers';

export async function POST(request: NextRequest) {
  // ... save application logic ...

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
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
  }

  return NextResponse.json({ success: true });
}
```

#### Example: Admin Approval

```typescript
// app/api/admin/teachers/[id]/approve/route.ts
import { sendTeacherApproval } from '@/lib/email-helpers';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // ... approval logic ...

  // Send approval email
  await sendTeacherApproval({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    approvedAt: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    trainingStartDate: 'March 1, 2024', // Optional
    nextSteps: 'Our program coordinator will contact you within 48 hours to schedule your welcome call.',
  });

  return NextResponse.json({ success: true });
}
```

## 🎨 Template Customization

All templates feature:
- **Responsive design** - Works on mobile and desktop
- **Beautiful gradients** - Color-coded by purpose
- **Professional typography** - Clean, readable fonts
- **Structured layout** - Clear sections and hierarchy
- **Brand consistency** - Buddha CEO theme throughout

### Color Themes

- **Teacher Application/Approval:** Purple gradient (#667eea → #764ba2 / Green #10b981)
- **Volunteer Application/Approval:** Green gradient (#10b981 → #059669 / Pink #ec4899)
- **Event Registration:** Blue gradient (#3b82f6 → #8b5cf6)

## 📝 Data Requirements

### Teacher Application Confirmation
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  submittedAt: string; // e.g., "January 15, 2024 at 10:30 AM"
}
```

### Volunteer Application Confirmation
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  opportunityTitle: string;
  submittedAt: string;
}
```

### Event Registration Confirmation
```typescript
{
  name: string;
  email: string;
  eventTitle: string;
  eventDate: string; // e.g., "Saturday, February 10, 2024"
  eventTime: string; // e.g., "10:00 AM - 12:00 PM EST"
  eventLocation: string;
  isOnline: boolean;
  registeredAt: string;
}
```

### Teacher Approval
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  approvedAt: string;
  trainingStartDate?: string; // Optional
  nextSteps: string;
}
```

### Volunteer Approval
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  opportunityTitle: string;
  approvedAt: string;
  startDate?: string; // Optional
  contactPerson?: string; // Optional
  contactEmail?: string; // Optional
  nextSteps: string;
}
```

## 🔧 Testing

To test email templates in development:

1. **Use Resend Test Domain:**
   ```env
   EMAIL_FROM=onboarding@resend.dev
   ```

2. **Send test emails:**
   ```typescript
   // In a test API route or script
   await sendTeacherApplicationConfirmation({
     firstName: 'Test',
     lastName: 'User',
     email: 'your-email@example.com',
     submittedAt: new Date().toLocaleString(),
   });
   ```

3. **Check Resend Dashboard:**
   - View sent emails
   - Check delivery status
   - Preview HTML rendering

## 📱 Mobile Responsiveness

All templates are optimized for:
- Desktop email clients (Outlook, Thunderbird, etc.)
- Web email clients (Gmail, Yahoo, etc.)
- Mobile devices (iOS Mail, Android Gmail, etc.)

## 🎯 Best Practices

1. **Always wrap email sending in try-catch** - Don't let email failures break the main flow
2. **Log email errors** - Track delivery issues for debugging
3. **Use meaningful subjects** - Include emojis for better open rates
4. **Test before deploying** - Send test emails to various clients
5. **Include unsubscribe options** - For production, add opt-out links
6. **Format dates consistently** - Use readable date formats

## 🚨 Error Handling

```typescript
try {
  await sendTeacherApplicationConfirmation(data);
  console.log('✅ Confirmation email sent successfully');
} catch (error) {
  console.error('❌ Failed to send confirmation email:', error);
  // Log to monitoring service (e.g., Sentry)
  // Continue with application flow - email is not critical
}
```

## 🔮 Future Enhancements

Potential additions:
- **Reminder emails** - 24 hours before events
- **Follow-up emails** - Post-event surveys
- **Welcome series** - Multi-step onboarding
- **Newsletter templates** - Community updates
- **Password reset** - Security emails
- **Notification templates** - System alerts

## 📞 Support

For issues or questions about email templates:
- Check the main email configuration in `lib/email.ts`
- Review Resend API documentation
- Ensure `RESEND_API_KEY` is set correctly
- Verify sender domain is verified in Resend dashboard
