export interface TeacherApplicationConfirmationData {
  firstName: string;
  lastName: string;
  email: string;
  submittedAt: string;
}

export function getTeacherApplicationConfirmationTemplate(data: TeacherApplicationConfirmationData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teacher Application Received</title>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    .info-box {
      background-color: #f7fafc;
      border-left: 4px solid #667eea;
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
    .step-number {
      background-color: #667eea;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      margin-right: 15px;
      flex-shrink: 0;
    }
    .step-text {
      color: #4a5568;
      line-height: 1.5;
      font-size: 15px;
    }
    .highlight {
      color: #667eea;
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
      <h1>🎓 Teacher Application Received</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Dear ${data.firstName} ${data.lastName},</p>
      
      <p class="message">
        Thank you for applying to become a meditation teacher with <strong>Buddha CEO</strong>! 
        We're excited about your interest in joining our teaching community.
      </p>
      
      <div class="info-box">
        <h3>Application Details</h3>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Submitted:</strong> ${data.submittedAt}</p>
        <p><strong>Status:</strong> <span class="highlight">Under Review</span></p>
      </div>
      
      <p class="message">
        Your application has been successfully received and is currently under review by our team. 
        We carefully evaluate each application to ensure the best fit for our community.
      </p>
      
      <div class="next-steps">
        <h3>What Happens Next?</h3>
        
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-text">
            <strong>Application Review</strong><br>
            Our team will review your application and experience within <span class="highlight">5-7 business days</span>.
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-text">
            <strong>Interview Process</strong><br>
            If selected, we'll contact you to schedule an interview to discuss your meditation practice and teaching aspirations.
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-text">
            <strong>Training Program</strong><br>
            Approved candidates will be invited to join our comprehensive teacher training program.
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message">
        In the meantime, feel free to explore our resources and connect with our community. 
        If you have any questions, please don't hesitate to reach out to us.
      </p>
      
      <p class="message">
        With gratitude,<br>
        <strong>The Buddha CEO Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Buddha CEO - Meditation & Mindfulness</strong></p>
      <p>Cultivating inner peace, one breath at a time</p>
      <p style="margin-top: 15px; font-size: 12px;">
        This email was sent to ${data.email}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
