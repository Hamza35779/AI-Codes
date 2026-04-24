export const provinces = [
  { code: 'PUN', name: 'Punjab' },
  { code: 'SIND', name: 'Sindh' },
  { code: 'KPK', name: 'Khyber Pakhtunkhwa' },
  { code: 'BAL', name: 'Balochistan' },
  { code: 'GB', name: 'Gilgit-Baltistan' },
  { code: 'AJK', name: 'Azad Jammu & Kashmir' },
  { code: 'ICT', name: 'Islamabad Capital Territory' }
];

export const cities = [
  // Punjab
  { name: 'Lahore', province: 'PUN' },
  { name: 'Faisalabad', province: 'PUN' },
  { name: 'Multan', province: 'PUN' },
  { name: 'Rawalpindi', province: 'PUN' },
  { name: 'Gujranwala', province: 'PUN' },
  { name: 'Sialkot', province: 'PUN' },
  { name: 'Sargodha', province: 'PUN' },
  { name: 'Bahawalpur', province: 'PUN' },
  // Sindh
  { name: 'Karachi', province: 'SIND' },
  { name: 'Hyderabad', province: 'SIND' },
  { name: 'Sukkur', province: 'SIND' },
  // KPK
  { name: 'Peshawar', province: 'KPK' },
  { name: 'Mardan', province: 'KPK' },
  // Balochistan
  { name: 'Quetta', province: 'BAL' },
  // ICT
  { name: 'Islamabad', province: 'ICT' }
];

export const paymentMethods = [
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'cod', name: 'Cash on Delivery', icon: '🚚' },
  { id: 'bank_transfer', name: 'Bank Transfer (IBFT)', icon: '🏦' },
  { id: 'jazzcash', name: 'JazzCash', icon: '📱' },
  { id: 'easypaisa', name: 'Easypaisa', icon: '📱' },
  { id: 'cheque', name: 'Cheque', icon: '📄' }
];

export const businessTypes = [
  { id: 'retailer', name: 'Retailer' },
  { id: 'wholesaler', name: 'Wholesaler' },
  { id: 'contractor', name: 'Contractor' },
  { id: 'corporate', name: 'Corporate' },
  { id: 'individual', name: 'Individual' }
];
