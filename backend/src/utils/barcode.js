const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');
const PDFDocument = require('pdfkit');

// Generate barcode for product
function generateBarcode(sku, format = 'CODE128') {
  try {
    const canvas = createCanvas();
    JsBarcode(canvas, sku, {
      format: format,
      lineColor: '#000',
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 16,
      margin: 10
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Barcode generation failed:', error);
    return null;
  }
}

// Generate QR code for product/inventory
function generateQRCode(data) {
  // Simple QR code using a library
  const QRCode = require('qrcode');
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(data, { errorCorrectionLevel: 'M' }, (err, url) => {
      if (err) reject(err);
      else resolve(url);
    });
  });
}

// Generate barcode sheet for printing
function generateBarcodeSheet(products) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.fontSize(16).text('Barcode Sheet', { align: 'center' });
    doc.moveDown();

    let x = 50;
    let y = 100;
    const barcodeWidth = 200;
    const barcodeHeight = 100;

    products.forEach((product, index) => {
      // Generate barcode image
      const barcodeDataUrl = generateBarcode(product.sku);
      
      if (barcodeDataUrl) {
        // Convert data URL to image
        const base64Data = barcodeDataUrl.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        doc.image(buffer, x, y, { width: barcodeWidth });
        doc.fontSize(10).text(product.sku, x, y + barcodeHeight, { width: barcodeWidth, align: 'center' });
        doc.fontSize(8).text(product.name, x, y + barcodeHeight + 15, { width: barcodeWidth, align: 'center' });
        
        x += barcodeWidth + 20;
        
        if ((index + 1) % 3 === 0) {
          x = 50;
          y += barcodeHeight + 60;
        }
      }
    });

    doc.end();
  });
}

module.exports = {
  generateBarcode,
  generateQRCode,
  generateBarcodeSheet
};
