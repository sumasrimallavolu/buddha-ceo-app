export interface VolunteerApplicationConfirmationData {
  firstName: string;
  lastName: string;
  email: string;
  opportunityTitle: string;
  submittedAt: string;
}

export function getVolunteerApplicationConfirmationTemplate(data: VolunteerApplicationConfirmationData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Volunteer Application Received</title>
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
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
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
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #10b981;
      padding: 25px;
      border-radius: 12px;
      margin: 30px 0;
      text-align: center;
    }
    .opportunity-card h3 {
      color: #065f46;
      margin: 0 0 10px 0;
      font-size: 20px;
    }
    .opportunity-card .badge {
      background-color: #10b981;
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      display: inline-block;
      margin-top: 10px;
    }
    .info-box {
      background-color: #f7fafc;
      border-left: 4px solid #10b981;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .info-box h3 {
      color: #2d3748;
      margin-top: 0;
      font-size: 18px;
    }
    .info-box p {
      color: #4a5568;
      margin: 8px 0;
      font-size: 14px;
    }
    .impact-section {
      background-color: #fef3c7;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
      border: 2px solid #f59e0b;
    }
    .impact-section h3 {
      color: #92400e;
      margin-top: 0;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .impact-section p {
      color: #78350f;
      line-height: 1.6;
      font-size: 15px;
      margin: 0;
    }
    .next-steps {
      background-color: #edf2f7;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .next-steps h3 {
      color: #2d3748;
      margin-top: 0;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .step {
      display: flex;
      align-items: start;
      margin-bottom: 15px;
    }
    .step-icon {
      color: #10b981;
      font-size: 24px;
      margin-right: 15px;
      flex-shrink: 0;
    }
    .step-text {
      color: #4a5568;
      line-height: 1.5;
      font-size: 15px;
    }
    .highlight {
      color: #10b981;
      font-weight: 600;
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
      <h1>❤️ Thank You for Volunteering!</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Dear ${data.firstName} ${data.lastName},</p>
      
      <p class="message">
        Thank you for your generous offer to volunteer with <strong>Buddha CEO</strong>! 
        Your willingness to contribute your time and energy to our community is truly appreciated.
      </p>
      
      <div class="opportunity-card">
        <h3>${data.opportunityTitle}</h3>
        <div class="badge">Application Received ✓</div>
      </div>
      
      <div class="info-box">
        <h3>Application Details</h3>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Submitted:</strong> ${data.submittedAt}</p>
        <p><strong>Status:</strong> <span class="highlight">Under Review</span></p>
      </div>
      
      <div class="impact-section">
        <h3>🌟 Your Impact Matters</h3>
        <p>
          Volunteers like you are the heart of our community. Your contribution helps us spread 
          mindfulness and meditation practices, creating positive change in countless lives. 
          Thank you for being part of this meaningful journey!
        </p>
      </div>
      
      <div class="next-steps">
        <h3>What Happens Next?</h3>
        
        <div class="step">
          <div class="step-icon">📋</div>
          <div class="step-text">
            <strong>Application Review</strong><br>
            We'll review your application within <span class="highlight">3-5 business days</span>.
          </div>
        </div>
        
        <div class="step">
          <div class="step-icon">📞</div>
          <div class="step-text">
            <strong>Contact & Orientation</strong><br>
            If selected, we'll reach out to schedule a brief orientation and discuss the opportunity details.
          </div>
        </div>
        
        <div class="step">
          <div class="step-icon">🚀</div>
          <div class="step-text">
            <strong>Start Volunteering</strong><br>
            Once onboarded, you'll receive all the information you need to begin your volunteer journey with us!
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message">
        While you wait, feel free to explore our website and join our community events. 
        We're excited about the possibility of working together!
      </p>
      
      <p class="message">
        With deep gratitude,<br>
        <strong>The Buddha CEO Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Buddha CEO - Meditation & Mindfulness</strong></p>
      <p>Together, we create a more mindful world</p>
      <p style="margin-top: 15px; font-size: 12px;">
        This email was sent to ${data.email}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
