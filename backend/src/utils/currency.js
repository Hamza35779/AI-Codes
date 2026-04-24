const formatter = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  minimumFractionDigits: 2
});

function formatPKR(amount) {
  if (amount === null || amount === undefined) return '₨0.00';
  return formatter.format(amount);
}

function parsePKR(formatted) {
  if (!formatted) return 0;
  return parseFloat(formatted.replace(/[₨,]/g, '').trim());
}

function calculateGST(amount, rate = 17) {
  return (amount * rate) / 100;
}

function calculateTotal(subtotal, gstRate = 17) {
  const gst = calculateGST(subtotal, gstRate);
  return subtotal + gst;
}

module.exports = {
  formatPKR,
  parsePKR,
  calculateGST,
  calculateTotal
};
