import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@misfitministries.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured. Email not sent.');
    return;
  }

  try {
    await sgMail.send({
      to: options.to,
      from: FROM_EMAIL,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendOrderConfirmation(
  customerEmail: string,
  orderId: string,
  amount: number,
  items: Array<{ name: string; quantity: number; price: number }>
): Promise<void> {
  const itemsHtml = items
    .map(
      item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d4af37;">Order Confirmation</h2>
      <p>Thank you for your order! Your purchase supports Narcan distribution and Misfit First Responders training.</p>
      
      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #d4af37; color: #000;">
            <th style="padding: 8px; text-align: left;">Item</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <p style="color: #666; font-size: 12px;">
        100% of proceeds fund Narcan distribution and Misfit First Responders training.
      </p>
      <p style="color: #666; font-size: 12px;">
        Questions? Contact us at support@misfitministries.com
      </p>
    </div>
  `;

  await sendEmail({
    to: customerEmail,
    subject: `Order Confirmation #${orderId}`,
    html,
  });
}

export async function sendCrisisAlert(
  adminEmail: string,
  prayerName: string,
  keywords: string[]
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ff0000;">🚨 Crisis Prayer Alert</h2>
      <p>A prayer has been flagged for crisis keywords and requires immediate attention.</p>
      
      <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff0000;">
        <p><strong>From:</strong> ${prayerName}</p>
        <p><strong>Keywords Detected:</strong> ${keywords.join(', ')}</p>
      </div>

      <p style="color: #666;">
        <strong>Resources:</strong>
      </p>
      <ul style="color: #666;">
        <li>988 Suicide & Crisis Lifeline: Call or text 988</li>
        <li>Crisis Text Line: Text HOME to 741741</li>
        <li>SAMHSA National Helpline: 1-800-662-4357</li>
      </ul>

      <p style="color: #666; font-size: 12px;">
        <a href="https://misfitministries.com/forge" style="color: #d4af37;">Go to Forge Dashboard</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: '🚨 Crisis Prayer Alert - Immediate Action Required',
    html,
  });
}

export async function sendShipmentNotification(
  adminEmail: string,
  shipmentId: string,
  quantity: number,
  location: string,
  trackingNumber?: string
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d4af37;">📦 Narcan Shipment Arrived</h2>
      <p>A Narcan shipment has arrived and is ready for distribution.</p>
      
      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Shipment ID:</strong> ${shipmentId}</p>
        <p><strong>Quantity:</strong> ${quantity} kits</p>
        <p><strong>Location:</strong> ${location}</p>
        ${trackingNumber ? `<p><strong>Tracking:</strong> ${trackingNumber}</p>` : ''}
      </div>

      <p style="color: #666;">
        <a href="https://misfitministries.com/forge/narcan-supply-chain" style="color: #d4af37; font-weight: bold;">View Supply Chain Dashboard</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `📦 Narcan Shipment Arrived - ${shipmentId}`,
    html,
  });
}
