const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || ''
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Send email
async function sendEmail(to, subject, htmlContent, textContent = '') {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Hardware Store" <info@hardware-store.pk>',
      to,
      subject,
      text: textContent,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
}

// Email templates
const emailTemplates = {
  orderConfirmation: (orderNumber, customerName, total) => ({
    subject: `Order Confirmed: ${orderNumber}`,
    html: `
      <h2>Dear ${customerName},</h2>
      <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
      <p><strong>Total Amount:</strong> ₨${total.toFixed(2)}</p>
      <p>You can track your order at: <a href="https://hardware-store.pk/orders/${orderNumber}">Track Order</a></p>
      <p>Thank you for your business!</p>
    `,
    text: `Dear ${customerName},\n\nYour order ${orderNumber} has been confirmed.\nTotal: ₨${total.toFixed(2)}\n\nThank you!`
  }),

  welcomeCustomer: (customerName, companyName) => ({
    subject: 'Welcome to Hardware Store!',
    html: `
      <h2>Welcome ${customerName}!</h2>
      <p>Your business account for <strong>${companyName}</strong> is now active.</p>
      <p>Enjoy wholesale prices on 1000+ hardware products.</p>
      <p><a href="https://hardware-store.pk/products">Start Shopping</a></p>
    `,
    text: `Welcome ${customerName}!\n\nYour account for ${companyName} is active.\n\nStart shopping at https://hardware-store.pk`
  }),

  lowStockAlert: (productName, sku, currentStock) => ({
    subject: `Low Stock Alert: ${productName}`,
    html: `
      <h2>Low Stock Alert</h2>
      <p><strong>Product:</strong> ${productName} (${sku})</p>
      <p><strong>Current Stock:</strong> ${currentStock}</p>
      <p>Please reorder soon to avoid stockout.</p>
    `,
    text: `Low Stock Alert: ${productName} (${sku})\nCurrent Stock: ${currentStock}\nPlease reorder soon.`
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};
