# ViScan - AI-Powered Medical Image Analysis Platform

![ViScan Logo](https://i.imgur.com/CKmuNYI.png)

## 🌟 Overview

ViScan is a comprehensive medical image analysis platform that combines cutting-edge AI/ML technology with traditional diagnostic methods to provide accurate health assessments. The platform specializes in analyzing medical images (X-Ray, MRI, CT, Ultrasound) and implements specialized diagnostic systems including Face Mapping, Iridology (iris analysis), and Palm Reading.

## ✨ Key Features

### 🤖 AI-Powered Analysis

- **5 Specialized AI Models**:
  - **FaceAnalyzer** (CNN + ResNet): Facial feature analysis and health mapping
  - **IrisScanner** (VGG + U-Net): Comprehensive iris analysis with 7-zone mapping
  - **PalmReader** (MediaPipe + CNN): Palm reading with Arabic knowledge integration
  - **ReportExtractor** (BERT + NER): Medical report text extraction
  - **HealthPredictor** (Ensemble Models): Health prediction and risk assessment

### 🔬 Traditional Diagnostic Systems

- **Face Mapping System**: Analyzes facial lines (forehead, eyebrow, crow's feet, mouth, lip) for organ health indicators
- **Iridology System**: Independent rule-based iris analysis covering 8 body systems
- **Palm Reading System**: Arabic knowledge-based palm analysis including lines, mounts, colors, and textures

### 💼 Professional Features

- HIPAA-ready architecture with comprehensive audit logging
- Multi-language support (English/Arabic)
- Subscription-based business model (Freemium $9.99-$29.99/month)
- Secure document and image management
- Real-time analysis with confidence scoring

## 🏗️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Material-UI** for professional medical interface
- **tRPC** for type-safe API calls
- **Tailwind CSS 4** for responsive design
- **Vite** for fast development and building

### Backend

- **Node.js 20** with Express
- **TypeScript** for type safety
- **tRPC 11** for end-to-end type safety
- **Drizzle ORM** for database management
- **PostgreSQL** for data storage

### AI/ML

- **TensorFlow.js** for model inference
- **OpenAI GPT-4 Vision** for advanced image analysis
- **MediaPipe** for palm detection
- **BERT** for text extraction
- Custom CNN, ResNet, VGG, and U-Net models

### Deployment

- **Vercel** for serverless deployment
- **DigitalOcean** for alternative hosting
- **PM2** for process management
- **Nginx** for reverse proxy

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or pnpm
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/s200077761/viscan-app.git
cd viscan-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Authentication
JWT_SECRET=your_jwt_secret
OAUTH_SERVER_URL=your_oauth_server
OWNER_OPEN_ID=owner_openid
OWNER_NAME=owner_name

# Application
VITE_APP_ID=your_app_id
VITE_APP_TITLE=ViScan
VITE_APP_LOGO=https://i.imgur.com/CKmuNYI.png
VITE_OAUTH_PORTAL_URL=your_oauth_portal

# AI Services
BUILT_IN_FORGE_API_URL=your_ai_api_url
BUILT_IN_FORGE_API_KEY=your_ai_api_key

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

## 📦 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**:

```bash
npm install -g vercel
```

2. **Login to Vercel**:

```bash
vercel login
```

3. **Deploy**:

```bash
vercel --prod
```

4. **Configure Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required environment variables from `.env.example`

5. **Configure Custom Domain**:
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain (e.g., viscan.app, viscan.org)

### Deploy to DigitalOcean

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed DigitalOcean deployment instructions.

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Developer Guide](./docs/DEVELOPER.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Transformation Strategy](./viscan-transformation-strategy.md)

## 🎯 Project Structure

```
viscan-app/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities and tRPC client
├── server/                # Backend Express application
│   ├── _core/             # Core server functionality
│   ├── ai-service.ts      # AI model integration
│   ├── facial-diagnosis.ts # Face mapping system
│   ├── iridology-system.ts # Iridology analysis
│   ├── palm-reading-system.ts # Palm reading system
│   ├── db.ts              # Database queries
│   ├── routers.ts         # tRPC routers
│   └── storage.ts         # S3 storage helpers
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
├── api/                   # Vercel serverless functions
└── docs/                  # Documentation

```

## 🔒 Security & Compliance

- **HIPAA-Ready**: Comprehensive audit logging and data encryption
- **GDPR Compliant**: Privacy-first design with user consent management
- **Secure Authentication**: JWT-based authentication with OAuth support
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Audit Trails**: Complete activity logging for compliance

## 🌐 Multi-Language Support

- **English**: Full UI and documentation
- **Arabic**: Palm Reading knowledge base and UI elements

## 📊 Business Model

### Subscription Tiers

- **Free**: 5 analyses per month
- **Basic ($9.99/month)**: 50 analyses per month
- **Professional ($19.99/month)**: 200 analyses per month
- **Enterprise ($29.99/month)**: Unlimited analyses

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Team

- **Lead Developer**: Manus AI
- **Project Owner**: ViScan Team
- **Contributors**: See [CONTRIBUTORS.md](./CONTRIBUTORS.md)

## 📞 Support

- **Email**: support@viscan.app
- **Website**: https://viscan.app
- **Documentation**: https://docs.viscan.app
- **GitHub Issues**: https://github.com/s200077761/viscan-app/issues

## 🙏 Acknowledgments

- OpenAI for GPT-4 Vision API
- TensorFlow team for ML frameworks
- MediaPipe for palm detection
- React and TypeScript communities
- All open-source contributors

---

**Made with ❤️ by the ViScan Team**

**Powered by Manus AI** - Advanced AI development platform
