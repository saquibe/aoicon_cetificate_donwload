import axios from 'axios';

export async function sendSMS(mobile: string, otp: string) {
  try {
    const apiKey = process.env.SMS_GATEWAY_API_KEY;
    const userId = process.env.SMS_GATEWAY_USER_ID;
    const password = process.env.SMS_GATEWAY_PASSWORD;

    if (!apiKey || !userId || !password) {
      throw new Error('SMS Gateway credentials not configured');
    }

    const message = `Your OTP for AOICON 2026 KOLKATA registration is: ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;

    const response = await axios.get('https://www.smsgatewayhub.com/api/mt/SendSMS', {
      params: {
        APIKey: apiKey,
        senderid: 'AOICON',
        channel: '2',
        DCS: '0',
        flashsms: '0',
        number: mobile,
        text: message,
        route: '1'
      }
    });

    return response.data;
  } catch (error) {
    console.error('SMS sending error:', error);
    throw new Error('Failed to send SMS');
  }
}
