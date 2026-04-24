const JazzCashConfig = {
  enabled: true,
  merchantId: process.env.JAZZCASH_MERCHANT_ID || '',
  password: process.env.JAZZCASH_PASSWORD || '',
  salt: process.env.JAZZCASH_SALT || '',
  returnUrl: process.env.JAZZCASH_RETURN_URL || 'http://localhost:3000/api/payments/jazzcash/callback',
  apiUrl: 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/InterBank/Transaction/IBTransaction',
  integritySalt: process.env.JAZZCASH_INTEGRITY_SALT || ''
};

const EasypaisaConfig = {
  enabled: true,
  storeId: process.env.EASYPAISA_STORE_ID || '',
  apiKey: process.env.EASYPAISA_API_KEY || '',
  apiUrl: 'https://easypay.easypaisa.com.pk',
  returnUrl: process.env.EASYPAISA_RETURN_URL || 'http://localhost:3000/api/payments/easypaisa/callback'
};

const BankTransferConfig = {
  enabled: true,
  bankAccounts: [
    {
      bankName: 'HBL (Habib Bank Limited)',
      accountTitle: 'Hardware Store Pvt Ltd',
      accountNumber: '1234-5678901234',
      iban: 'PK01HABB0012345678901234'
    },
    {
      bankName: 'Meezan Bank',
      accountTitle: 'Hardware Store Pvt Ltd',
      accountNumber: '9876-5432109876',
      iban: 'PK02MEZN9876543210987654'
    }
  ]
};

const CODConfig = {
  enabled: true,
  charges: 0,
  maxAmount: 500000 // PKR 500,000 max for COD
};

module.exports = {
  JazzCashConfig,
  EasypaisaConfig,
  BankTransferConfig,
  CODConfig,
  currency: 'PKR',
  currencySymbol: '₨',
  taxRate: 0.17, // 17% GST in Pakistan
  taxName: 'GST'
};
