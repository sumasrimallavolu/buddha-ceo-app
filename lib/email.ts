import { Resend } from 'resend';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  console.log('\n========== EMAIL SERVICE DEBUG ==========');
  console.log('🔧 Starting email send process...');
  
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Buddha CEO App <no-reply@buddhaceo.app>';

  console.log('📝 Environment check:');
  console.log('  - RESEND_API_KEY exists:', !!apiKey);
  console.log('  - RESEND_API_KEY length:', apiKey?.length || 0);
  console.log('  - RESEND_API_KEY starts with "re_":', apiKey?.startsWith('re_') || false);
  console.log('  - EMAIL_FROM:', from);
  console.log('  - EMAIL_FROM env var:', process.env.EMAIL_FROM || '(not set, using default)');

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is not configured in environment variables');
    throw new Error('Email service not configured. Please set RESEND_API_KEY in your .env.local file.');
  }

  try {
    console.log('\n📧 Email details:');
    console.log('  - To:', to);
    console.log('  - From:', from);
    console.log('  - Subject:', subject);
    console.log('  - Has HTML:', !!html);
    console.log('  - Has Text:', !!text);
    
    console.log('\n🚀 Initializing Resend client...');
    const resend = new Resend(apiKey);
    
    console.log('📤 Calling Resend API...');
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('\n❌ Resend API returned an error:');
      console.error('  - Error object:', JSON.stringify(error, null, 2));
      console.error('  - Error message:', error.message);
      console.error('  - Error name:', error.name);
      throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
    }

    console.log('\n✅ Email sent successfully!');
    console.log('  - Email ID:', data?.id);
    console.log('  - Response data:', JSON.stringify(data, null, 2));
    console.log('========================================\n');
    return data;
  } catch (error) {
    console.error('\n❌ Exception caught while sending email:');
    console.error('  - Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('  - Error message:', error instanceof Error ? error.message : String(error));
    console.error('  - Full error:', error);
    console.error('========================================\n');
    throw error;
  }
}

interface SendOtpEmailOptions {
  to: string;
  otp: string;
  purposeLabel: string;
}

export async function sendOtpEmail({ to, otp, purposeLabel }: SendOtpEmailOptions) {
  const subject = `Your verification code for ${purposeLabel}`;

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #0f172a; padding: 24px; color: #e5e7eb;">
      <div style="max-width: 480px; margin: 0 auto; background-color: #020617; border-radius: 16px; border: 1px solid #1e293b; padding: 24px;">
        <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #f9fafb;">
          Verify your email
        </h1>
        <p style="font-size: 14px; color: #9ca3af; margin: 0 0 16px;">
          Use the one-time verification code below to ${purposeLabel.toLowerCase()}.
          This code is valid for <strong>10 minutes</strong>.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <div style="display: inline-block; padding: 12px 24px; border-radius: 999px; background: linear-gradient(to right, #2563eb, #7c3aed); letter-spacing: 0.24em;">
            <span style="font-size: 24px; font-weight: 700; color: #f9fafb;">${otp}</span>
          </div>
        </div>
        <p style="font-size: 13px; color: #9ca3af; margin: 0 0 8px;">
          If you did not request this code, you can safely ignore this email.
        </p>
        <p style="font-size: 12px; color: #6b7280; margin: 16px 0 0;">
          — Buddha CEO App
        </p>
      </div>
    </div>
  `;

  const text = `Your verification code for ${purposeLabel} is ${otp}. It is valid for 10 minutes. If you did not request this, please ignore this email.`;

  await sendEmail({ to, subject, html, text });
}

