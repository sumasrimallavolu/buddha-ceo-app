export interface TeacherApprovalData {
  firstName: string;
  lastName: string;
  email: string;
  approvedAt: string;
  trainingStartDate?: string;
  nextSteps: string;
}

export function getTeacherApprovalTemplate(data: TeacherApprovalData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teacher Application Approved</title>
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
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      border: 3px solid #10b981;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 30px;
    }
    .success-banner h2 {
      color: #065f46;
      margin: 0 0 10px 0;
      font-size: 26px;
    }
    .success-banner p {
      color: #047857;
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
    .training-card {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #f59e0b;
      padding: 25px;
      border-radius: 12px;
      margin: 30px 0;
    }
    .training-card h3 {
      color: #92400e;
      margin-top: 0;
      font-size: 20px;
      margin-bottom: 15px;
    }
    .training-card .date-badge {
      background-color: #f59e0b;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
      margin-top: 10px;
    }
    .steps-section {
      background-color: #f9fafb;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .steps-section h3 {
      color: #1f2937;
      margin-top: 0;
      font-size: 20px;
      margin-bottom: 20px;
    }
    .step {
      display: flex;
      align-items: start;
      margin-bottom: 20px;
      padding: 15px;
      background-color: white;
      border-radius: 8px;
      border-left: 4px solid #10b981;
    }
    .step:last-child {
      margin-bottom: 0;
    }
    .step-number {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      margin-right: 15px;
      flex-shrink: 0;
    }
    .step-content h4 {
      color: #1f2937;
      margin: 0 0 8px 0;
      font-size: 16px;
    }
    .step-content p {
      color: #6b7280;
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
    .benefits-list {
      background-color: #f0fdf4;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .benefits-list h3 {
      color: #065f46;
      margin-top: 0;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .benefit-item {
      display: flex;
      align-items: start;
      margin-bottom: 12px;
    }
    .benefit-item:last-child {
      margin-bottom: 0;
    }
    .benefit-icon {
      color: #10b981;
      margin-right: 10px;
      font-weight: bold;
      font-size: 18px;
      flex-shrink: 0;
    }
    .benefit-text {
      color: #047857;
      font-size: 15px;
      line-height: 1.5;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 16px 40px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 20px auto;
      text-align: center;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
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
      <div class="celebration">🎊</div>
      <h1>Congratulations!</h1>
    </div>
    
    <div class="content">
      <div class="success-banner">
        <h2>Your Application Has Been Approved!</h2>
        <p>Welcome to the Buddha CEO Teaching Community</p>
      </div>
      
      <p class="greeting">Dear ${data.firstName} ${data.lastName},</p>
      
      <p class="message">
        We are absolutely delighted to inform you that your application to become a meditation 
        teacher with <strong>Buddha CEO</strong> has been <strong>approved</strong>! 🎉
      </p>
      
      <p class="message">
        After careful review of your application, meditation experience, and dedication to 
        mindfulness practice, we believe you will be an excellent addition to our teaching community. 
        Your passion for helping others find peace and clarity truly stood out.
      </p>
      
      ${data.trainingStartDate ? `
      <div class="training-card">
        <h3>🎓 Your Teacher Training Program</h3>
        <p style="color: #78350f; line-height: 1.6; margin: 0;">
          You're now enrolled in our comprehensive teacher training program designed to 
          equip you with advanced meditation techniques and teaching methodologies.
        </p>
        <div class="date-badge">Starts: ${data.trainingStartDate}</div>
      </div>
      ` : ''}
      
      <div class="steps-section">
        <h3>📋 Next Steps</h3>
        
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Welcome Call</h4>
            <p>Our program coordinator will contact you within 48 hours to schedule a welcome call and orientation session.</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Training Materials</h4>
            <p>You'll receive access to our comprehensive training portal with videos, guides, and teaching resources.</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Mentorship Program</h4>
            <p>You'll be paired with an experienced teacher who will guide you through your training journey.</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>Begin Teaching</h4>
            <p>Upon completion of training, you'll start leading meditation sessions and events with full support from our team.</p>
          </div>
        </div>
      </div>
      
      <div class="benefits-list">
        <h3>🌟 What You'll Gain</h3>
        
        <div class="benefit-item">
          <span class="benefit-icon">✓</span>
          <span class="benefit-text">Advanced meditation and mindfulness teaching certification</span>
        </div>
        
        <div class="benefit-item">
          <span class="benefit-icon">✓</span>
          <span class="benefit-text">Access to our exclusive teacher community and resources</span>
        </div>
        
        <div class="benefit-item">
          <span class="benefit-icon">✓</span>
          <span class="benefit-text">Ongoing mentorship and professional development opportunities</span>
        </div>
        
        <div class="benefit-item">
          <span class="benefit-icon">✓</span>
          <span class="benefit-text">Platform to share your unique teaching style and reach students globally</span>
        </div>
        
        <div class="benefit-item">
          <span class="benefit-icon">✓</span>
          <span class="benefit-text">Opportunity to make a meaningful impact in people's lives</span>
        </div>
      </div>
      
      ${data.nextSteps ? `
      <div class="info-box">
        <h3>📌 Important Information</h3>
        <p>${data.nextSteps}</p>
      </div>
      ` : ''}
      
      <div class="divider"></div>
      
      <p class="message">
        This is the beginning of an incredible journey. We're honored to have you as part of 
        our mission to spread mindfulness and meditation to the world.
      </p>
      
      <p class="message">
        If you have any questions, please don't hesitate to reach out. We're here to support 
        you every step of the way!
      </p>
      
      <p class="message">
        With deep gratitude and excitement,<br>
        <strong>The Buddha CEO Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Buddha CEO - Meditation & Mindfulness</strong></p>
      <p>Empowering teachers to transform lives</p>
      <p style="margin-top: 15px; font-size: 12px;">
        Application approved for ${data.email} on ${data.approvedAt}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
