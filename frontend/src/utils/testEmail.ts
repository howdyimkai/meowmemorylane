import * as emailjs from '@emailjs/browser';
import { generateFirstMessage } from './messageGenerator';

/**
 * Send a test email using EmailJS
 * This is for development and testing purposes only
 */
export async function sendTestEmail(testEmail: string = 'test@example.com'): Promise<boolean> {
  try {
    console.log('🧪 Sending test email to:', testEmail);
    
    // Initialize EmailJS
    const EMAILJS_USER_ID = process.env.REACT_APP_EMAILJS_USER_ID || 'z04zSHHFmbUO57sp8';
    emailjs.init(EMAILJS_USER_ID);
    
    // Generate test message
    const message = generateFirstMessage({
      catName: 'TestCat',
      toyType: 'yarn',
      memory: 'This is a test memory'
    });
    
    // Test data for email
    const emailData = {
      to_email: testEmail,
      from_email: 'noreply@meowmemorylane.com',
      cat_name: 'TestCat',
      monthly_story: message,
      postcard_url: 'https://example.com/test-cat.jpg',
      unsubscribe_url: '#',
      to_name: 'Friend',
      frequency: 'daily'
    };
    
    // Service and template IDs
    const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_eyhgzzc';
    const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_xwr06xh';
    
    console.log('EmailJS Configuration:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      userId: EMAILJS_USER_ID.substring(0, 4) + '...' // Show only first 4 chars for security
    });
    
    // Send the email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailData,
      EMAILJS_USER_ID
    );
    
    console.log('✅ Test email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('❌ Test email failed:', error);
    return false;
  }
}
