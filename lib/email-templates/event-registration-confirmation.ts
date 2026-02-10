export interface EventRegistrationConfirmationData {
  name: string;
  email: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  isOnline: boolean;
  registeredAt: string;
}

export function getEventRegistrationConfirmationTemplate(data: EventRegistrationConfirmationData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Registration Confirmed</title>
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
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
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
    .success-badge {
      background-color: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      display: inline-block;
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 20px;
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
    .event-card {
      background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%);
      border: 2px solid #3b82f6;
      padding: 30px;
      border-radius: 12px;
      margin: 30px 0;
    }
    .event-card h2 {
      color: #1e40af;
      margin: 0 0 20px 0;
      font-size: 24px;
      text-align: center;
    }
    .event-details {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      margin-top: 15px;
    }
    .detail-row {
      display: flex;
      align-items: start;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .detail-icon {
      font-size: 20px;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .detail-content {
      flex: 1;
    }
    .detail-label {
      font-size: 12px;
      text-transform: uppercase;
      color: #6b7280;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .detail-value {
      font-size: 16px;
      color: #1f2937;
      font-weight: 500;
    }
    .info-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .info-box h3 {
      color: #92400e;
      margin-top: 0;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .info-box p {
      color: #78350f;
      margin: 8px 0;
      font-size: 14px;
      line-height: 1.5;
    }
    .reminder-box {
      background-color: #e0e7ff;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .reminder-box h3 {
      color: #3730a3;
      margin-top: 0;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .reminder-item {
      display: flex;
      align-items: start;
      margin-bottom: 12px;
    }
    .reminder-item:last-child {
      margin-bottom: 0;
    }
    .check-icon {
      color: #10b981;
      margin-right: 10px;
      font-weight: bold;
      flex-shrink: 0;
    }
    .reminder-text {
      color: #4338ca;
      font-size: 14px;
      line-height: 1.5;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
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
      <h1>🎉 Registration Confirmed!</h1>
    </div>
    
    <div class="content">
      <div style="text-align: center;">
        <span class="success-badge">✓ You're Registered</span>
      </div>
      
      <p class="greeting">Dear ${data.name},</p>
      
      <p class="message">
        Great news! Your registration for our upcoming event has been confirmed. 
        We're thrilled to have you join us for this transformative experience.
      </p>
      
      <div class="event-card">
        <h2>${data.eventTitle}</h2>
        
        <div class="event-details">
          <div class="detail-row">
            <div class="detail-icon">📅</div>
            <div class="detail-content">
              <div class="detail-label">Date</div>
              <div class="detail-value">${data.eventDate}</div>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-icon">🕐</div>
            <div class="detail-content">
              <div class="detail-label">Time</div>
              <div class="detail-value">${data.eventTime}</div>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-icon">${data.isOnline ? '💻' : '📍'}</div>
            <div class="detail-content">
              <div class="detail-label">${data.isOnline ? 'Online Event' : 'Location'}</div>
              <div class="detail-value">${data.eventLocation}</div>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-icon">✉️</div>
            <div class="detail-content">
              <div class="detail-label">Registered Email</div>
              <div class="detail-value">${data.email}</div>
            </div>
          </div>
        </div>
      </div>
      
      ${data.isOnline ? `
      <div class="info-box">
        <h3>📱 Online Event Information</h3>
        <p>
          This is an online event. We'll send you the meeting link and access details 
          <strong>24 hours before the event</strong>. Please check your email and ensure 
          you have a stable internet connection.
        </p>
      </div>
      ` : `
      <div class="info-box">
        <h3>📍 Venue Information</h3>
        <p>
          Please arrive <strong>15 minutes early</strong> for registration and to find your seat. 
          Bring this email confirmation with you to the event.
        </p>
      </div>
      `}
      
      <div class="reminder-box">
        <h3>📝 Important Reminders</h3>
        
        <div class="reminder-item">
          <span class="check-icon">✓</span>
          <span class="reminder-text">We'll send you a reminder email 24 hours before the event</span>
        </div>
        
        <div class="reminder-item">
          <span class="check-icon">✓</span>
          <span class="reminder-text">Please arrive on time to make the most of the experience</span>
        </div>
        
        <div class="reminder-item">
          <span class="check-icon">✓</span>
          <span class="reminder-text">Bring a notebook and pen to capture insights</span>
        </div>
        
        <div class="reminder-item">
          <span class="check-icon">✓</span>
          <span class="reminder-text">Wear comfortable clothing suitable for meditation</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message">
        If you have any questions or need to make changes to your registration, 
        please don't hesitate to contact us. We're here to help!
      </p>
      
      <p class="message">
        We look forward to seeing you at the event!
      </p>
      
      <p class="message">
        With mindful regards,<br>
        <strong>The Buddha CEO Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Buddha CEO - Meditation & Mindfulness</strong></p>
      <p>Transforming lives through mindfulness and meditation</p>
      <p style="margin-top: 15px; font-size: 12px;">
        Registration confirmed for ${data.email} on ${data.registeredAt}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
