# Referral System - Serverless

A modern referral system with points tracking and user management, now optimized for serverless deployment on Vercel.

## 🚀 Features

- **Serverless Architecture**: Deploy on Vercel with zero server management
- **Referral System**: Track user referrals and points
- **RESTful API**: Clean, documented API endpoints
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and logging
- **Health Checks**: Built-in health monitoring
- **Security**: Security headers and input validation

## 📋 Prerequisites

- Node.js 18+ 
- Vercel CLI (for deployment)
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd referral-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   ```

## 🏃‍♂️ Local Development

### Start Development Server
```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## 🚀 Serverless Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Deploy to preview
   npm run deploy:dev
   
   # Deploy to production
   npm run deploy
   ```

### Manual Deployment
```bash
vercel --prod
```

### Environment Variables
Set these in your Vercel dashboard:
- `NODE_ENV=production`
- Add any other environment variables your app needs

## 📡 API Endpoints

### Base URL
- **Local**: `http://localhost:3000`
- **Production**: `https://your-vercel-domain.vercel.app`

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/api` | API documentation |
| GET | `/api/users` | Get all users |
| POST | `/api/register` | Register new user |
| GET | `/api/users/:referralCode` | Get user by referral code |

### Example API Usage

```javascript
// Register a new user
const response = await fetch('https://your-domain.vercel.app/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    referralCode: 'ABC123'
  })
});

// Get all users
const users = await fetch('https://your-domain.vercel.app/api/users');
```

## 🏗️ Architecture

### Serverless Structure
```
referral-system/
├── api/
│   └── index.js          # Serverless function entry point
├── config/
│   └── config.js         # Configuration management
├── middleware/
│   └── errorHandler.js   # Error handling middleware
├── public/               # Static files (served by Vercel)
├── routes/
│   └── api.js           # API routes
├── services/
│   └── userService.js   # Business logic
├── utils/
│   ├── logger.js        # Logging utility
│   └── validation.js    # Input validation
├── server.js            # Local development server
├── vercel.json         # Vercel configuration
└── package.json
```

### Key Components

- **`api/index.js`**: Serverless function handler for Vercel
- **`server.js`**: Traditional Express server for local development
- **`vercel.json`**: Vercel deployment configuration
- **Static Files**: Served directly by Vercel CDN

## 🔧 Configuration

### Vercel Configuration (`vercel.json`)
- Routes API requests to serverless function
- Serves static files from `public/` directory
- Sets function timeout to 30 seconds

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (local development only)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring

### Health Check
Visit `/health` endpoint to check server status:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "1.0.0"
}
```

### Vercel Analytics
- Function execution times
- Error rates
- Request volumes
- Cold start performance

## 🔒 Security

- CORS protection
- Security headers
- Input validation
- Error handling without exposing internals

## 📈 Performance

### Serverless Benefits
- **Auto-scaling**: Handles traffic spikes automatically
- **Pay-per-use**: Only pay for actual usage
- **Global CDN**: Static files served from edge locations
- **Cold start optimization**: Functions optimized for quick startup

### Optimization Tips
- Keep dependencies minimal
- Use environment variables for configuration
- Implement proper error handling
- Monitor function execution times

## 🐛 Troubleshooting

### Common Issues

1. **Cold Start Delays**
   - Normal for serverless functions
   - Subsequent requests are faster

2. **Function Timeout**
   - Default timeout is 30 seconds
   - Optimize database queries and external API calls

3. **CORS Errors**
   - Check CORS configuration in `api/index.js`
   - Update allowed origins for your domain

4. **Environment Variables**
   - Set in Vercel dashboard
   - Redeploy after changes

### Debugging
```bash
# View Vercel logs
vercel logs

# View function logs
vercel logs --function api/index.js
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check Vercel documentation for deployment issues
- Review logs in Vercel dashboard

