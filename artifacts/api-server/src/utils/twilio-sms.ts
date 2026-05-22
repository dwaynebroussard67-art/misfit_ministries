import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: any = null;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

export async function sendSMS(phoneNumber: string, message: string): Promise<void> {
  if (!twilioClient) {
    console.warn('Twilio not configured. SMS not sent.');
    return;
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`SMS sent to ${phoneNumber}. SID: ${result.sid}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export async function sendOTPSMS(phoneNumber: string, otp: string): Promise<void> {
  const message = `Your Misfit Ministries verification code is: ${otp}. Valid for 10 minutes.`;
  await sendSMS(phoneNumber, message);
}

export async function sendCrisisAlertSMS(phoneNumber: string, prayerName: string): Promise<void> {
  const message = `🚨 Crisis Alert: A prayer from ${prayerName} has been flagged. Please check Forge dashboard immediately. Call 988 if needed.`;
  await sendSMS(phoneNumber, message);
}

export async function sendNarcanAlertSMS(phoneNumber: string, location: string, distance: string): Promise<void> {
  const message = `🚨 NARCAN NEEDED: OD in progress at ${location} (${distance} away). Tap to respond: https://misfitministries.com/help-now`;
  await sendSMS(phoneNumber, message);
}

export async function sendShipmentNotificationSMS(phoneNumber: string, quantity: number, location: string): Promise<void> {
  const message = `📦 Narcan shipment arrived! ${quantity} kits ready for pickup at ${location}. Update your inventory in Forge.`;
  await sendSMS(phoneNumber, message);
}

export function isTwilioConfigured(): boolean {
  return !!twilioClient;
}
