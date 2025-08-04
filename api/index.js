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

// Log environment information for debugging
logger.info('API Server starting', {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    host: process.env.HOST,
    environment: config.server.environment
});

/**
 * Security and CORS configuration
 */
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://referal-app-a2aab6c9cdb9.herokuapp.com',
            'https://referral-system-alpha.vercel.app',
            // Add your Vercel frontend URL here
            process.env.FRONTEND_URL
        ].filter(Boolean); // Remove undefined values
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // In development, allow all origins
            if (process.env.NODE_ENV === 'development') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
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
    try {
        res.status(200).json({
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: config.server.environment,
            version: config.app.version,
            nodeEnv: process.env.NODE_ENV
        });
    } catch (error) {
        logger.error('Health check error', error);
        res.status(500).json({
            success: false,
            error: 'Health check failed'
        });
    }
});

/**
 * Root endpoint for API
 */
app.get('/', (req, res) => {
    try {
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
    } catch (error) {
        logger.error('Root endpoint error', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
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
    