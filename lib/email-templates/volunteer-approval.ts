export interface VolunteerApprovalData {
  firstName: string;
  lastName: string;
  email: string;
  opportunityTitle: string;
  approvedAt: string;
  startDate?: string;
  contactPerson?: string;
  contactEmail?: string;
  nextSteps: string;
}

export function getVolunteerApprovalTemplate(data: VolunteerApprovalData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Volunteer Application Approved</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f7fa;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
      padding: 50px 20px;
      text-align: center;
    }
    .header .celebration {
      font-size: 48px;
      margin-bottom: 15px;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .success-banner {
      background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%);
      border: 3px solid #ec4899;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 30px;
    }
    .success-banner h2 {
      color: #9f1239;
      margin: 0 0 10px 0;
      font-size: 26px;
    }
    .success-banner p {
      color: #be185d;
      font-size: 16px;
      margin: 0;
    }
    .greeting {
      font-size: 18px;
      color: #2d3748;
      margin-bottom: 20px;
    }
    .message {
      color: #4a5568;
      line-height: 1.6;
      font-size: 16px;
      margin-bottom: 20px;
    }
    .opportunity-card {
      background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
      border: 2px solid #3b82f6;
      padding: 25px;
      border-radius: 12px;
      margin: 30px 0;
      text-align: center;
    }
    .opportunity-card h3 {
      color: #1e40af;
      margin: 0 0 15px 0;
      font-size: 22px;
    }
    .opportunity-card .badge {
      background-color: #10b981;
      color: white;
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
    }
    ${data.startDate ? `
    .start-date-box {
      background-color: #fef3c7;
      border: 2px solid #f59e0b;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
      text-align: center;
    }
    .start-date-box h3 {
      color: #92400e;
      margin: 0 0 10px 0;
      font-size: 18px;
    }
    .start-date-box .date {
      color: #78350f;
      font-size: 20px;
      font-weight: 600;
    }
    ` : ''}
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .info-box h3 {
      color: #1e40af;
      margin-top: 0;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .info-box p {
      color: #1e3a8a;
      margin: 8px 0;
      font-size: 14px;
      line-height: 1.5;
    }
    ${data.contactPerson ? `
    .contact-card {
      background-color: #f9fafb;
      border: 2px solid #d1d5db;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .contact-card h3 {
      color: #1f2937;
      margin-top: 0;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .contact-detail {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .contact-detail:last-child {
      margin-bottom: 0;
    }
    .contact-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .contact-text {
      color: #4b5563;
      font-size: 15px;
    }
    ` : ''}
    .guidelines-section {
      background-color: #f0fdf4;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .guidelines-section h3 {
      color: #065f46;
      margin-top: 0;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .guideline-item {
      display: flex;
      align-items: start;
      margin-bottom: 12px;
    }
    .guideline-item:last-child {
      margin-bottom: 0;
    }
    .guideline-icon {
      color: #10b981;
      margin-right: 10px;
      font-weight: bold;
      font-size: 18px;
      flex-shrink: 0;
    }
    .guideline-text {
      color: #047857;
      font-size: 14px;
      line-height: 1.5;
    }
    .appreciation-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #f59e0b;
      padding: 25px;
      border-radius: 12px;
      margin: 30px 0;
      text-align: center;
    }
    .appreciation-box p {
      color: #78350f;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
      font-style: italic;
    }
    .footer {
      background-color: #2d3748;
      color: #a0aec0;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer p {
      margin: 5px 0;
    }
    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="celebration">🎉</div>
      <h1>You're Approved!</h1>
    </div>
    
    <div class="content">
      <div class="success-banner">
        <h2>Welcome to Our Volunteer Team!</h2>
        <p>Your application has been approved</p>
      </div>
      
      <p class="greeting">Dear ${data.firstName} ${data.lastName},</p>
      
      <p class="message">
        We're thrilled to inform you that your volunteer application has been <strong>approved</strong>! 
        Welcome to the Buddha CEO volunteer family. ❤️
      </p>
      
      <div class="opportunity-card">
        <h3>${data.opportunityTitle}</h3>
        <div class="badge">✓ Approved</div>
      </div>
      
      <p class="message">
        Your enthusiasm, skills, and dedication to making a positive impact truly impressed us. 
        We're excited to have you join our mission of spreading mindfulness and creating meaningful 
        change in our community.
      </p>
      
      ${data.startDate ? `
      <div class="start-date-box">
        <h3>📅 Your Volunteer Start Date</h3>
        <div class="date">${data.startDate}</div>
      </div>
      ` : ''}
      
      <div class="info-box">
        <h3>📋 Next Steps</h3>
        <p>${data.nextSteps}</p>
      </div>
      
      ${data.contactPerson ? `
      <div class="contact-card">
        <h3>👤 Your Point of Contact</h3>
        <div class="contact-detail">
          <span class="contact-icon">👋</span>
          <span class="contact-text"><strong>${data.contactPerson}</strong></span>
        </div>
        ${data.contactEmail ? `
        <div class="contact-detail">
          <span class="contact-icon">✉️</span>
          <span class="contact-text">${data.contactEmail}</span>
        </div>
        ` : ''}
        <p style="margin-top: 15px; color: #6b7280; font-size: 14px;">
          Feel free to reach out with any questions or concerns!
        </p>
      </div>
      ` : ''}
      
      <div class="guidelines-section">
        <h3>📌 Volunteer Guidelines</h3>
        
        <div class="guideline-item">
          <span class="guideline-icon">✓</span>
          <span class="guideline-text">
            <strong>Commitment:</strong> Please honor your volunteering schedule. If you need to make changes, inform us at least 24 hours in advance.
          </span>
        </div>
        
        <div class="guideline-item">
          <span class="guideline-icon">✓</span>
          <span class="guideline-text">
            <strong>Communication:</strong> Stay connected with your team coordinator and attend orientation sessions.
          </span>
        </div>
        
        <div class="guideline-item">
          <span class="guideline-icon">✓</span>
          <span class="guideline-text">
            <strong>Professionalism:</strong> Represent Buddha CEO values of mindfulness, compassion, and integrity in all interactions.
          </span>
        </div>
        
        <div class="guideline-item">
          <span class="guideline-icon">✓</span>
          <span class="guideline-text">
            <strong>Feedback:</strong> We value your input! Share your experiences and suggestions to help us improve.
          </span>
        </div>
      </div>
      
      <div class="appreciation-box">
        <p>
          "Volunteering is the ultimate exercise in democracy. You vote in elections once a year, 
          but when you volunteer, you vote every day about the kind of community you want to live in."
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p class="message">
        Thank you for choosing to dedicate your time and energy to our cause. Together, we're 
        creating a more mindful, compassionate world, one moment at a time.
      </p>
      
      <p class="message">
        We can't wait to work with you!
      </p>
      
      <p class="message">
        With heartfelt gratitude,<br>
        <strong>The Buddha CEO Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Buddha CEO - Meditation & Mindfulness</strong></p>
      <p>Together, we make a difference</p>
      <p style="margin-top: 15px; font-size: 12px;">
        Application approved for ${data.email} on ${data.approvedAt}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
