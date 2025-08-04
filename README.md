# Referral System

A modern, scalable referral system built with Node.js and Express, featuring user management, points tracking, and comprehensive API documentation.

## 🚀 Features

- **User Registration**: Secure user registration with email validation
- **Referral System**: Unique referral codes with points tracking
- **Points Management**: Award points to referrers when new users register
- **RESTful API**: Comprehensive API with proper error handling
- **Input Validation**: Robust validation and sanitization
- **Logging**: Structured logging with different levels
- **Documentation**: JSDoc comments throughout the codebase

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
cd referral-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🏃‍♂️ Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:3000
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | Get API information and documentation |
| GET | `/api/users` | Get all users |
| POST | `/api/register` | Register a new user |
| GET | `/api/users/:referralCode` | Get user by referral code |
| GET | `/health` | Health check endpoint |

### Example API Usage

#### Register a new user
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "referralCode": "ABC123"
  }'
```

#### Get all users
```bash
curl http://localhost:3000/api/users
```

#### Get user by referral code
```bash
curl http://localhost:3000/api/users/ABC123
```

## 🏗️ Project Structure

```
referral-system/
├── config/
│   └── config.js          # Application configuration
├── middleware/
│   └── errorHandler.js    # Error handling middleware
├── routes/
│   └── api.js            # API routes
├── services/
│   └── userService.js    # User business logic
├── utils/
│   ├── logger.js         # Logging utility
│   └── validation.js     # Input validation
├── tests/
│   └── userService.test.js # Unit tests
├── public/               # Frontend files
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # Project documentation
```

