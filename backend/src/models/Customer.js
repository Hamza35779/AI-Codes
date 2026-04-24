const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^(\+92|0)?[0-9]{3}[0-9]{7}$/ // Pakistani phone format
    }
  },
  alternatePhone: {
    type: DataTypes.STRING,
  },
  // Pakistani business fields
  ntn: {
    type: DataTypes.STRING,
    comment: 'National Tax Number'
  },
  gstNumber: {
    type: DataTypes.STRING,
    comment: 'GST Registration Number'
  },
  businessType: {
    type: DataTypes.ENUM,
    values: ['retailer', 'wholesaler', 'contractor', 'corporate', 'individual'],
    defaultValue: 'retailer'
  },
  // Address in Pakistan
  address: {
    type: DataTypes.JSONB,
    defaultValue: {
      street: '',
      city: '',
      district: '',
      province: '',
      postalCode: ''
    }
  },
  creditLimit: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  paymentTerms: {
    type: DataTypes.STRING,
    defaultValue: 'cash',
  },
  customerTierId: {
    type: DataTypes.UUID,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  notes: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'customers',
  timestamps: true,
  indexes: [
    { fields: ['ntn'], unique: true, where: { ntn: { [Sequelize.Op.ne]: null } } },
    { fields: ['gstNumber'], unique: true, where: { gstNumber: { [Sequelize.Op.ne]: null } } }
  ]
});

module.exports = Customer;
