'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, RefreshCw } from 'lucide-react';

interface OtpInputProps {
  email: string;
  otpCode: string;
  onOtpChange: (code: string) => void;
  onResendOtp: () => Promise<void>;
  error?: string;
  resending?: boolean;
  showResendLink?: boolean;
}

export function OtpInput({
  email,
  otpCode,
  onOtpChange,
  onResendOtp,
  error,
  resending = false,
  showResendLink = true,
}: OtpInputProps) {
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleResend = async () => {
    if (resendCooldown || resending) return;
    
    setResendCooldown(true);
    await onResendOtp();
    
    // 60 second cooldown
    setTimeout(() => {
      setResendCooldown(false);
    }, 60000);
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-400">
        <Mail className="h-4 w-4" />
        <AlertDescription>
          We've sent a 6-digit verification code to <strong>{email}</strong>. Please check your inbox (and spam folder).
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">
          Enter Verification Code
        </label>
        <Input
          type="text"
          placeholder="000000"
          value={otpCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            onOtpChange(value);
          }}
          maxLength={6}
          className={`bg-white/5 border-white/10 text-white text-center text-2xl font-mono tracking-widest placeholder:text-slate-500 focus:border-blue-500 ${
            error ? 'border-red-500' : ''
          }`}
          autoComplete="one-time-code"
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        
        <p className="text-xs text-slate-500">
          Code expires in 10 minutes
        </p>
      </div>

      {showResendLink && (
        <div className="flex items-center justify-center">
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={resendCooldown || resending}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {resending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : resendCooldown ? (
              'Please wait 60s before resending'
            ) : (
              <>
                <RefreshCw className="mr-2 h-3 w-3" />
                Resend Code
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
