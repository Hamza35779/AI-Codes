const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate invoice PDF
async function generateInvoice(order, customer, products) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Company info
    doc.fontSize(12).text('Hardware Store Pvt Ltd', { continued: false });
    doc.fontSize(10).text('123 Main Boulevard, Lahore, Pakistan');
    doc.text('Phone: 042-1234567 | Email: info@hardware-store.pk');
    doc.text('NTN: 1234567-8 | GST: 1234567-8-9');
    doc.moveDown();

    // Invoice details
    doc.fontSize(12).text(`Invoice #: INV-${order.orderNumber}`);
    doc.fontSize(10).text(`Date: ${new Date(order.orderDate).toLocaleDateString('en-PK')}`);
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.moveDown();

    // Customer info
    doc.fontSize(12).text('Bill To:');
    doc.fontSize(10).text(customer.companyName);
    doc.text(customer.address?.street || '');
    doc.text(`${customer.address?.city || ''}, ${customer.address?.province || ''}`);
    doc.text(`Phone: ${customer.phone}`);
    doc.text(`NTN: ${customer.ntn || 'N/A'}`);
    doc.moveDown();

    // Items table
    const tableTop = doc.y;
    doc.fontSize(10);
    
    // Table headers
    doc.text('SKU', 50, tableTop)
       .text('Product', 150, tableTop)
       .text('Qty', 350, tableTop)
       .text('Price', 400, tableTop)
       .text('Total', 470, tableTop);
    
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    
    let yPosition = tableTop + 25;
    let subtotal = 0;

    order.OrderItems.forEach((item, index) => {
      const product = products.find(p => p.id === item.productId);
      const lineTotal = item.quantity * item.unitPrice * (1 - item.discountPercent / 100);
      subtotal += lineTotal;

      doc.text(product?.sku || '', 50, yPosition)
         .text(product?.name || '', 150, yPosition)
         .text(item.quantity.toString(), 350, yPosition)
         .text(`₨${item.unitPrice.toFixed(2)}`, 400, yPosition)
         .text(`₨${lineTotal.toFixed(2)}`, 470, yPosition);
      
      yPosition += 20;
    });

    // Totals
    doc.moveTo(400, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 10;

    const gstAmount = subtotal * 0.17;
    const total = subtotal + gstAmount;

    doc.text('Subtotal:', 400, yPosition).text(`₨${subtotal.toFixed(2)}`, 470, yPosition);
    yPosition += 20;
    doc.text('GST (17%):', 400, yPosition).text(`₨${gstAmount.toFixed(2)}`, 470, yPosition);
    yPosition += 20;
    doc.fontSize(12).text('Total:', 400, yPosition).text(`₨${total.toFixed(2)}`, 470, yPosition);

    // Footer
    doc.fontSize(8).text('All prices in Pakistani Rupee (PKR). GST paid as per Sales Tax Act 1990.', 
      50, doc.page.height - 50, { align: 'center', width: 500 });

    doc.end();
  });
}

// Generate quotation PDF
async function generateQuotation(quotation, customer, products) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('QUOTATION', { align: 'center' });
    doc.moveDown();
    
    // Similar structure to invoice
    doc.fontSize(12).text('Hardware Store Pvt Ltd', { continued: false });
    doc.fontSize(10).text('Quotation #: QT-${quotation.quotationNumber}');
    doc.text(`Date: ${new Date().toLocaleDateString('en-PK')}`);
    doc.text(`Valid Until: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-PK')}`);
    
    // Customer and items similar to invoice...
    
    doc.end();
  });
}

module.exports = {
  generateInvoice,
  generateQuotation
};
