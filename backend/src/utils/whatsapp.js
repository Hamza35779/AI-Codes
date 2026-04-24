const axios = require('axios');

// WhatsApp Business API configuration
const whatsappConfig = {
  apiKey: process.env.WHATSAPP_API_KEY || '',
  phoneNumberId: process.env.WHATSAPP_PHONE_ID || '',
  businessAccountId: process.env.WHATSAPP_BUSINESS_ID || '',
  apiUrl: 'https://graph.facebook.com/v17.0'
};

// Send WhatsApp message via Facebook WhatsApp Business API
async function sendWhatsApp(phone, message, mediaUrl = null) {
  try {
    // Format phone number to Pakistani format
    let formattedPhone = phone.replace(/[\s\-()]/g, '');
    if (!formattedPhone.startsWith('92')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '92' + formattedPhone.substring(1);
      } else {
        formattedPhone = '92' + formattedPhone;
      }
    }

    const payload = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: mediaUrl ? 'image' : 'text',
      ... (mediaUrl ? {
        image: { link: mediaUrl }
      } : {
        text: { body: message }
      })
    };

    const response = await axios.post(
      `${whatsappConfig.apiUrl}/${whatsappConfig.phoneNumberId}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${whatsappConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return { success: true, messageId: response.data.messages?.[0]?.id };
  } catch (error) {
    console.error('WhatsApp send failed:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

// Predefined WhatsApp templates
const whatsappTemplates = {
  orderConfirmation: (orderNumber, amount) => 
    `Dear Customer,\n\nYour order ${orderNumber} of ₨${amount} has been confirmed.\n\nTrack at: hardware-store.pk/orders/${orderNumber}\n\nThank you for your business!`,
  
  orderShipped: (orderNumber, trackingNo) => 
    `Your order ${orderNumber} has been shipped!\n\nTracking: ${trackingNo}\n\nExpected delivery: 2-3 working days.`,
  
  paymentReceived: (orderNumber, amount) => 
    `Payment of ₨${amount} received for order ${orderNumber}.\n\nInvoice: hardware-store.pk/invoices/${orderNumber}\n\nThank you!`,
  
  welcomeMessage: (customerName) => 
    `Welcome to Hardware Store, ${customerName}!\n\nYour account is ready. Enjoy wholesale prices on 1000+ hardware products.\n\nVisit: hardware-store.pk`,
};

module.exports = {
  sendWhatsApp,
  whatsappTemplates
};
