const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');

// Import configuration and utilities
const config = require('../config/config');
const logger = require('../utils/logger');
const { notFound, errorHandler } = require('../middleware/errorHandler');

// Import routes
const apiRoutes = require('../routes/api');

const app = express();

/**
 * Security and CORS configuration
 */
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://referal-app-a2aab6c9cdb9.herokuapp.com', 'https://referral-system-alpha.vercel.app']
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};

/**
 * Middleware setup
 */
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

/**
 * API Routes
 */
app.use('/api', apiRoutes);

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.server.environment,
        version: config.app.version
    });
});

/**
 * Root endpoint for API
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Referral System API',
        version: config.app.version,
        environment: config.server.environment,
        endpoints: {
            health: '/health',
            api: '/api',
            users: '/api/users',
            register: '/api/register'
        }
    });
});

/**
 * 404 handler for non-API routes
 */
app.use(notFound);

/**
 * Global error handler
 */
app.use(errorHandler);

// Export for serverless deployment
module.exports.handler = serverless(app);
    