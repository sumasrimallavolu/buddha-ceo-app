import { sendEmail } from './email';
import {
  getTeacherApplicationConfirmationTemplate,
  getVolunteerApplicationConfirmationTemplate,
  getEventRegistrationConfirmationTemplate,
  getTeacherApprovalTemplate,
  getVolunteerApprovalTemplate,
  type TeacherApplicationConfirmationData,
  type VolunteerApplicationConfirmationData,
  type EventRegistrationConfirmationData,
  type TeacherApprovalData,
  type VolunteerApprovalData,
} from './email-templates';

/**
 * Send teacher application confirmation email
 */
export async function sendTeacherApplicationConfirmation(data: TeacherApplicationConfirmationData) {
  const html = getTeacherApplicationConfirmationTemplate(data);
  
  return await sendEmail({
    to: data.email,
    subject: '🎓 Your Teacher Application Has Been Received - Buddha CEO',
    html,
  });
}

/**
 * Send volunteer application confirmation email
 */
export async function sendVolunteerApplicationConfirmation(data: VolunteerApplicationConfirmationData) {
  const html = getVolunteerApplicationConfirmationTemplate(data);
  
  return await sendEmail({
    to: data.email,
    subject: `❤️ Thank You for Volunteering - ${data.opportunityTitle}`,
    html,
  });
}

/**
 * Send event registration confirmation email
 */
export async function sendEventRegistrationConfirmation(data: EventRegistrationConfirmationData) {
  const html = getEventRegistrationConfirmationTemplate(data);
  
  return await sendEmail({
    to: data.email,
    subject: `🎉 Registration Confirmed - ${data.eventTitle}`,
    html,
  });
}

/**
 * Send teacher approval email
 */
export async function sendTeacherApproval(data: TeacherApprovalData) {
  const html = getTeacherApprovalTemplate(data);
  
  return await sendEmail({
    to: data.email,
    subject: '🎊 Congratulations! Your Teacher Application Has Been Approved',
    html,
  });
}

/**
 * Send volunteer approval email
 */
export async function sendVolunteerApproval(data: VolunteerApprovalData) {
  const html = getVolunteerApprovalTemplate(data);
  
  return await sendEmail({
    to: data.email,
    subject: `🎉 You're Approved! Welcome to the Volunteer Team - ${data.opportunityTitle}`,
    html,
  });
}
