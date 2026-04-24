const axios = require('axios');

// Twilio Pakistan configuration
const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  phoneNumber: process.env.TWILIO_PHONE || '+923001234567'
};

// Drip (Pakistani SMS gateway) configuration  
const dripConfig = {
  apiKey: process.env.DRIP_API_KEY || '',
  senderId: process.env.DRIP_SENDER_ID || 'HARDWARE',
  apiUrl: 'https://api.dripsms.pk/sendsms'
};

// Send SMS via Twilio
async function sendViaTwilio(phone, message) {
  try {
    const twilio = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);
    const result = await twilio.messages.create({
      body: message,
      from: twilioConfig.phoneNumber,
      to: phone
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('Twilio SMS failed:', error);
    return { success: false, error: error.message };
  }
}

// Send SMS via Drip (Pakistani gateway)
async function sendViaDrip(phone, message) {
  try {
    const response = await axios.post(dripConfig.apiUrl, {
      api_key: dripConfig.apiKey,
      sender: dripConfig.senderId,
      to: phone,
      message: message
    });
    return { success: true, messageId: response.data.message_id };
  } catch (error) {
    console.error('Drip SMS failed:', error);
    return { success: false, error: error.message };
  }
}

// Main send SMS function
async function sendSMS(phone, message, method = 'drip') {
  // Format phone number to Pakistani format
  let formattedPhone = phone.replace(/[\s\-()]/g, '');
  if (!formattedPhone.startsWith('+92')) {
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+92' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('92')) {
      formattedPhone = '+92' + formattedPhone;
    }
  }

  if (method === 'twilio') {
    return await sendViaTwilio(formattedPhone, message);
  } else {
    return await sendViaDrip(formattedPhone, message);
  }
}

// Predefined SMS templates
const smsTemplates = {
  orderConfirmation: (orderNumber, amount) => 
    `Dear Customer, your order ${orderNumber} of PKR ${amount} has been confirmed. Track at hardware-store.pk`,
  
  orderShipped: (orderNumber, trackingNo) => 
    `Your order ${orderNumber} has been shipped. Tracking: ${trackingNo}. Visit hardware-store.pk`,
  
  paymentReceived: (orderNumber, amount) => 
    `Payment of PKR ${amount} received for order ${orderNumber}. Thank you for your business!`,
  
  lowStockAlert: (productName, stock) => 
    `Alert: ${productName} stock is low (${stock} remaining). Please reorder soon.`
};

module.exports = {
  sendSMS,
  smsTemplates
};
