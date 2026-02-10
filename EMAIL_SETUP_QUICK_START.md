# Quick Start: Fix Email Not Sending

## The Problem
You're not receiving OTP emails because the Resend package wasn't installed and the API key is not configured.

## Quick Fix (3 steps)

### 1. Install Resend Package ✅
Already done! The package has been installed.

### 2. Get Your Resend API Key

Go to [resend.com](https://resend.com) and:
- Sign up for a free account (takes 2 minutes)
- Go to **API Keys** in the dashboard
- Click **Create API Key**
- Copy the key (starts with `re_`)

### 3. Add to Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist) and add:

```bash
RESEND_API_KEY=re_paste_your_actual_key_here
EMAIL_FROM=onboarding@resend.dev
```

**Important**: 
- Replace `re_paste_your_actual_key_here` with your real API key from Resend
- For testing, use `onboarding@resend.dev` as the sender
- Restart your dev server after adding these variables: `npm run dev`

## Test It

1. Go to signup page: http://localhost:3000/signup
2. Fill in your details with a **real email address**
3. Click "Send Verification Code"
4. Check your terminal - you should see:
   ```
   📧 Sending email to: your@email.com
   ✅ Email sent successfully. ID: xxx
   ```
5. Check your email inbox (and spam folder!)

## Still Not Working?

Check the console logs in your terminal for specific error messages. Common issues:

- `Email service not configured` → Missing `RESEND_API_KEY` in `.env.local`
- `Invalid from address` → Change `EMAIL_FROM` to `onboarding@resend.dev`
- `Invalid API key` → Double-check you copied the key correctly from Resend

## Need More Help?

See the detailed guide: `docs/EMAIL_SETUP_GUIDE.md`
