export function formatPKR(amount) {
  if (amount === null || amount === undefined) return '₨0.00';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 2
  }).format(amount);
}

export function parsePKR(formatted) {
  if (!formatted) return 0;
  return parseFloat(formatted.replace(/[₨,]/g, '').trim());
}
