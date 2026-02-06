/**
 * Reusable form components for admin pages
 */

import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RequiredLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  tooltip?: string;
}

/**
 * Label component that shows a required asterisk when needed
 */
export function RequiredLabel({ htmlFor, children, required = false, tooltip }: RequiredLabelProps) {
  return (
    <div className="flex items-center gap-1">
      <Label htmlFor={htmlFor} className="flex items-center gap-1">
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  tooltip?: string;
}

/**
 * Wrapper for form fields with consistent spacing and error display
 */
export function FormField({ label, htmlFor, required = false, error, children, tooltip }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <RequiredLabel htmlFor={htmlFor || label.toLowerCase().replace(/\s+/g, '-')} required={required} tooltip={tooltip}>
        {label}
      </RequiredLabel>
      {children}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
