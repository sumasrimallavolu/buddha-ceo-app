# Email Setup Guide for OTP Verification

This guide will help you set up email functionality for OTP verification in the Buddha CEO App.

## Prerequisites

You need a **Resend** account to send emails. Resend is a modern email API service.

## Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (includes 3,000 emails/month on the free tier)
3. Verify your email address

## Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "Buddha CEO App - Dev")
5. Select the appropriate permissions (Full access for development)
6. Copy the API key (it starts with `re_`)
7. **Important**: Save this key securely - you won't be able to see it again!

## Step 3: Configure Your Domain (Optional but Recommended)

For production, you should verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `buddhaceo.app`)
4. Follow the DNS verification steps
5. Wait for DNS propagation (usually 5-30 minutes)

For development/testing, you can skip this step and use Resend's test domain.

## Step 4: Set Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=Buddha CEO App <noreply@yourdomain.com>
```

### Important Notes:

- **RESEND_API_KEY**: Your Resend API key (starts with `re_`)
- **EMAIL_FROM**: 
  - Format: `Name <email@domain.com>`
  - For development: Use `onboarding@resend.dev` if you haven't verified a domain
  - For production: Use your verified domain (e.g., `noreply@buddhaceo.app`)

## Step 5: Test Email Sending

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try to sign up with a real email address
3. Check the terminal/console for email sending logs:
   - ✅ Success: `Email sent successfully. ID: xxx`
   - ❌ Error: Will show the specific error

## Troubleshooting

### Error: "Email service not configured"
- Make sure `RESEND_API_KEY` is set in your `.env.local` file
- Restart your development server after adding the variable

### Error: "Failed to send email: Invalid from address"
- If you haven't verified a domain, use `onboarding@resend.dev` as your `EMAIL_FROM`
- For production, verify your domain in Resend dashboard first

### Email not received
1. **Check spam folder**: OTP emails might be flagged
2. **Check Resend logs**: Go to your Resend dashboard → Emails to see delivery status
3. **Verify email address**: Make sure you're using a valid email
4. **Check console logs**: Look for error messages in your terminal

### Rate Limits
- Free tier: 3,000 emails/month, 100 emails/day
- If you hit limits, consider upgrading your Resend plan

## Email Templates

The app sends OTP emails for:
- **Sign Up**: Verify email during account creation
- **Event Registration**: Verify email before registering for events
- **Volunteer Application**: Verify email for volunteer opportunities
- **Teacher Application**: Verify email for teaching applications

All emails use the same styled template with:
- 6-digit OTP code
- 10-minute expiration time
- Modern, branded design matching your app theme

## Testing in Development

For testing, you can:
1. Use your personal email
2. Use [temp-mail.org](https://temp-mail.org) for disposable emails
3. Check Resend dashboard for email delivery status

## Production Checklist

Before going to production:
- [ ] Verify your domain in Resend
- [ ] Update `EMAIL_FROM` to use your verified domain
- [ ] Update `NEXT_PUBLIC_APP_URL` to your production URL
- [ ] Test email delivery from production environment
- [ ] Monitor Resend dashboard for delivery issues
- [ ] Consider upgrading Resend plan if needed

## Support

- **Resend Documentation**: https://resend.com/docs
- **Resend Status**: https://status.resend.com
- **Need Help?**: Check Resend's Discord or support channels
