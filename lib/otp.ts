import connectDB from './mongodb';
import EmailOtp, { OtpPurpose, IEmailOtpDocument } from './models/EmailOtp';
import { sendOtpEmail } from './email';

function generateOtpCode(): string {
  // 6-digit numeric code, zero-padded
  const code = Math.floor(100000 + Math.random() * 900000);
  return String(code);
}

function getPurposeLabel(purpose: OtpPurpose): string {
  switch (purpose) {
    case 'signup':
      return 'Sign Up';
    case 'event_registration':
      return 'Event Registration';
    case 'volunteer_application':
      return 'Volunteer Application';
    case 'teacher_application':
      return 'Teacher Application';
    case 'teacher_enrollment':
      return 'Teacher Enrollment';
    default:
      return 'Verification';
  }
}

interface CreateOtpOptions {
  email: string;
  purpose: OtpPurpose;
}

export async function createAndSendOtp({ email, purpose }: CreateOtpOptions): Promise<void> {
  console.log('\n========== OTP CREATION DEBUG ==========');
  console.log('🔧 Starting OTP creation process...');
  console.log('  - Email (raw):', email);
  console.log('  - Purpose:', purpose);
  
  console.log('🔌 Connecting to database...');
  await connectDB();
  console.log('✅ Database connected');

  const normalizedEmail = email.toLowerCase().trim();
  console.log('  - Email (normalized):', normalizedEmail);

  // Clean up any previous OTPs for this email + purpose
  console.log('🧹 Cleaning up old OTPs...');
  const deleteResult = await EmailOtp.deleteMany({ email: normalizedEmail, purpose });
  console.log(`  - Deleted ${deleteResult.deletedCount} old OTP(s)`);

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  console.log('🔐 Generated OTP details:');
  console.log('  - Code:', code);
  console.log('  - Expires at:', expiresAt.toISOString());
  console.log('  - Expires in:', '10 minutes');

  console.log('💾 Saving OTP to database...');
  const otpRecord = await EmailOtp.create({
    email: normalizedEmail,
    code,
    purpose,
    expiresAt,
    consumedAt: null,
    attempts: 0,
  });
  console.log('✅ OTP saved to database with ID:', otpRecord._id);

  // Helpful for local development / debugging when email might not be delivered
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔑 [DEV MODE] OTP CODE: ${code}`);
    console.log(`   Use this code for ${purpose} with ${normalizedEmail}\n`);
  }

  const purposeLabel = getPurposeLabel(purpose);
  console.log('  - Purpose label:', purposeLabel);

  console.log('📧 Sending OTP email...');
  try {
    await sendOtpEmail({
      to: normalizedEmail,
      otp: code,
      purposeLabel,
    });
    console.log('✅ OTP email sent successfully');
  } catch (emailError) {
    console.error('❌ Failed to send OTP email:', emailError);
    throw emailError;
  }
  
  console.log('========================================\n');
}

interface VerifyOtpOptions {
  email: string;
  code: string;
  purpose: OtpPurpose;
  maxAttempts?: number;
}

export async function verifyOtp({
  email,
  code,
  purpose,
  maxAttempts = 5,
}: VerifyOtpOptions): Promise<{ valid: boolean; error?: string }> {
  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();
  const trimmedCode = code.trim();

  const now = new Date();

  const otpDoc: IEmailOtpDocument | null = await EmailOtp.findOne({
    email: normalizedEmail,
    purpose,
    expiresAt: { $gt: now },
    consumedAt: null,
  }).sort({ createdAt: -1 });

  if (!otpDoc) {
    return { valid: false, error: 'OTP is invalid or has expired' };
  }

  if (otpDoc.attempts >= maxAttempts) {
    return { valid: false, error: 'Too many invalid attempts. Please request a new OTP.' };
  }

  if (otpDoc.code !== trimmedCode) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    return { valid: false, error: 'Incorrect OTP. Please try again.' };
  }

  otpDoc.consumedAt = now;
  otpDoc.attempts += 1;
  await otpDoc.save();

  return { valid: true };
}

