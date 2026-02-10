# Debug Checklist for Email OTP

## Added Comprehensive Logging ✅

I've added detailed logs to help diagnose the email issue. Now when you try to sign up, you'll see:

### What You'll See in Terminal

```
========== SIGNUP OTP REQUEST ==========
📥 Received send-otp request
📦 Request body: { "email": "test@example.com" }
📧 Processing email: test@example.com
✅ Email format valid
🔌 Connecting to database...
✅ Database connected
🔍 Checking if user exists...
✅ Email available for registration
🚀 Creating and sending OTP...

========== OTP CREATION DEBUG ==========
🔧 Starting OTP creation process...
  - Email (raw): test@example.com
  - Purpose: signup
🔌 Connecting to database...
✅ Database connected
  - Email (normalized): test@example.com
🧹 Cleaning up old OTPs...
  - Deleted 0 old OTP(s)
🔐 Generated OTP details:
  - Code: 123456
  - Expires at: 2026-02-10T16:00:00.000Z
  - Expires in: 10 minutes
💾 Saving OTP to database...
✅ OTP saved to database with ID: xxx
🔑 [DEV MODE] OTP CODE: 123456    <-- YOU CAN USE THIS TO TEST!
   Use this code for signup with test@example.com
  - Purpose label: Sign Up
📧 Sending OTP email...

========== EMAIL SERVICE DEBUG ==========
🔧 Starting email send process...
📝 Environment check:
  - RESEND_API_KEY exists: true
  - RESEND_API_KEY length: 48
  - RESEND_API_KEY starts with "re_": true
  - EMAIL_FROM: onboarding@resend.dev
  - EMAIL_FROM env var: onboarding@resend.dev

📧 Email details:
  - To: test@example.com
  - From: onboarding@resend.dev
  - Subject: Your verification code for Sign Up
  - Has HTML: true
  - Has Text: true

🚀 Initializing Resend client...
📤 Calling Resend API...
```

## Steps to Debug

### 1. Restart Your Dev Server
```bash
# Press Ctrl+C to stop, then:
npm run dev
```

### 2. Check Your .env.local File

Make sure it has:
```bash
RESEND_API_KEY=re_your_actual_key_here
EMAIL_FROM=onboarding@resend.dev
```

**Important**: 
- Use EXACTLY `onboarding@resend.dev` (no quotes, no angle brackets, no display name)
- Make sure there are no spaces around the `=` sign

### 3. Try Signup Again

Go to http://localhost:3000/signup and try to register.

### 4. Watch the Terminal

Look for these specific log sections:

**✅ SUCCESS indicators:**
- `✅ Database connected`
- `✅ Email format valid`
- `✅ OTP saved to database`
- `✅ Email sent successfully`
- `Email ID: xxx` (means email was accepted by Resend)

**❌ ERROR indicators:**
- `❌ RESEND_API_KEY is not configured`
- `❌ Resend API error:`
- `❌ Failed to send email`
- Look for the error details printed below

### 5. Development Mode Shortcut

In development, the OTP code is printed in the terminal:
```
🔑 [DEV MODE] OTP CODE: 123456
```

You can use this code even if the email doesn't arrive!

## Common Issues and Solutions

### Issue 1: "The onboarding.zysec.ai domain is not verified"
**Solution**: Change `EMAIL_FROM` to `onboarding@resend.dev` in `.env.local`

### Issue 2: "RESEND_API_KEY is not configured"
**Solution**: 
- Check your `.env.local` file exists in project root
- Check the API key is correct (starts with `re_`)
- Restart dev server after adding/changing

### Issue 3: "Invalid API key"
**Solution**:
- Go to resend.com dashboard
- Create a new API key
- Copy the entire key (including `re_` prefix)
- Update `.env.local`
- Restart server

### Issue 4: Email not received
**Solutions**:
1. Check spam folder
2. Use the OTP code printed in terminal (dev mode only)
3. Check Resend dashboard → Emails for delivery status
4. Try a different email address

## What the Logs Tell You

| Log Message | Meaning |
|------------|---------|
| `RESEND_API_KEY exists: false` | API key not found in environment |
| `RESEND_API_KEY starts with "re_": false` | Wrong API key format |
| `EMAIL_FROM env var: (not set, using default)` | Using default sender, might not work |
| `Deleted X old OTP(s)` | Previous OTP codes were removed |
| `Email ID: xxx` | Email successfully sent to Resend |
| `Failed to send email: XXX` | Specific error from Resend |

## Next Steps

After you see the logs, share:
1. The section that shows the error (the ❌ parts)
2. The environment check section
3. Any error messages at the end

This will help me identify exactly what's wrong!
