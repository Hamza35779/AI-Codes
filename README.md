# Wholesale Hardware Store - Pakistan

A full-stack wholesale hardware store management system tailored for the Pakistani market with support for PKR currency, JazzCash, Easypaisa, and GST compliance.

## Features

### Core Features
- **Multi-role Authentication**: Admin, Manager, Sales, Warehouse, Customer
- **Product Catalog**: SKU-based products with Pakistani GST rates
- **Multi-warehouse Inventory**: Real-time stock tracking with reorder alerts
- **B2B Customer Management**: NTN/GST tracking, credit limits, business types
- **Wholesale Pricing**: Tiered pricing system for bulk orders

### Phase 3: Pakistani Localization
- **Currency**: PKR (₨) throughout the system
- **Payment Methods**: 
  - JazzCash integration
  - Easypaisa integration
  - Bank Transfer (IBFT) - HBL, Meezan Bank
  - Cash on Delivery (up to ₨500,000)
  - Cheque payments
  - Cash
- **Tax Compliance**: 17% GST calculation, GST reports for FBR
- **Business Fields**: NTN, GST Number, business types (retailer, wholesaler, contractor, etc.)
- **Pakistani Cities & Provinces**: Lahore, Karachi, Islamabad, Faisalabad, etc.

### Phase 4: Advanced Features Added
- **Reporting Dashboard**:
  - Sales reports with charts
  - GST reports for FBR
  - Inventory valuation reports
  - Top customers analysis
- **SMS Notifications**: Twilio & Drip integration for Pakistani phone numbers
- **PDF Generation**: 
  - Invoices with GST breakdown
  - Quotations with validity period
- **Barcode/QR Codes**: Generate barcodes for products, print barcode sheets
- **Loyalty Points System**: Earn and redeem points (1 point per ₨100 spent)
- **WhatsApp Business API**: Send order confirmations, shipping updates
- **Email Notifications**: SMTP integration with templates (welcome, order confirmation, etc.)
- **Product Comparison**: Compare specifications and prices side-by-side
- **Invoices & Quotations**: Dedicated pages with PDF download

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+ with Sequelize ORM
- **Cache**: Redis
- **Authentication**: JWT with refresh tokens
- **Payments**: JazzCash, Easypaisa, Stripe (optional)
- **Notifications**: WhatsApp, SMS (Twilio/Drip), Email (Nodemailer)
- **Reports**: PDFKit, Chart.js (backend APIs)

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context API
- **Routing**: React Router v6
- **Charts**: Chart.js with react-chartjs-2
- **Currency**: PKR formatting with Intl.NumberFormat

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx with SSL termination
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions
- **Deployment**: Automated deployment script

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+ (if running without Docker)
- Pakistan-based payment gateway accounts (JazzCash, Easypaisa)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd wholesale-hardware-store
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   cp .env.prod.example .env.prod
   # Edit .env and .env.prod with your actual values
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Or run locally**
   ```bash
   # Backend
   cd backend && npm install && npm run dev
   
   # Frontend (new terminal)
   cd frontend && npm install && npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `POST /api/products` - Create product (admin/manager)
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/submit` - Submit order

### Payments
- `GET /api/payments/methods` - Get available payment methods
- `POST /api/payments/jazzcash/initiate` - Initiate JazzCash payment
- `POST /api/payments/easypaisa/initiate` - Initiate Easypaisa payment
- `POST /api/payments/bank-transfer` - Record bank transfer
- `POST /api/payments/cheque` - Record cheque payment

### Reports
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/gst` - GST report
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/top-customers` - Top customers

### Loyalty
- `GET /api/loyalty/customer/:customerId` - Get loyalty points
- `POST /api/loyalty/award` - Award points for order
- `POST /api/loyalty/redeem` - Redeem points

## Deployment

### Production Deployment
```bash
# Configure production environment
cp .env.prod.example .env.prod
# Edit .env.prod with production values

# Run deployment script
./deploy.sh
```

### Monitoring
- **Prometheus**: http://your-server:9090
- **Grafana**: http://your-server:3002
  - Default login: admin / (set GRAFANA_PASSWORD in .env.prod)

### Database Backup
```bash
chmod +x backup.sh
./backup.sh
```

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Run with coverage
cd backend && npm run test:coverage
```

## Project Structure

```
wholesale-hardware-store/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, payment configs
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utilities (PDF, SMS, Email, etc.)
│   ├── migrations/        # Database migrations
│   ├── tests/             # Unit & integration tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   └── utils/          # Frontend utilities
│   └── package.json
├── nginx/                # Nginx configuration
├── monitoring/            # Prometheus & Grafana configs
├── docker-compose.yml    # Development
├── docker-compose.prod.yml  # Production
├── deploy.sh             # Production deployment script
├── backup.sh             # Database backup script
└── README.md
```

## Environment Variables

See `.env.example` and `.env.prod.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email info@hardware-store.pk or WhatsApp at +92-300-1234567.

---

**Built with ❤️ for Pakistani hardware businesses**
