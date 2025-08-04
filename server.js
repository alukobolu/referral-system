/**
 * Referral System Server
 * @module server
 * @description Main server file for the referral system application
 */

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');

// Import configuration and utilities
const config = require('./config/config');
const logger = require('./utils/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Import routes
const apiRoutes = require('./routes/api');

// Initialize Express app
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
 * Static file serving (only for local development)
 */
if (process.env.NODE_ENV !== 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
}

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
 * Root endpoint - serve frontend (only for local development)
 */
if (process.env.NODE_ENV !== 'production') {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

/**
 * 404 handler for non-API routes
 */
app.use(notFound);

/**
 * Global error handler
 */
app.use(errorHandler);

/**
 * Graceful shutdown handling
 */
const gracefulShutdown = (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    process.exit(0);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection', err);
    process.exit(1);
});

/**
 * Start server
 */
const startServer = () => {
    const server = app.listen(config.server.port, config.server.host, () => {
        logger.info(`🚀 Server started successfully`, {
            port: config.server.port,
            host: config.server.host,
            environment: config.server.environment,
            version: config.app.version
        });
        
        console.log(`\n📋 Server Information:`);
        console.log(`  🌐 Frontend: http://${config.server.host}:${config.server.port}`);
        console.log(`  🔗 API Documentation: http://${config.server.host}:${config.server.port}/api`);
        console.log(`  💚 Health Check: http://${config.server.host}:${config.server.port}/health`);
        console.log(`\n📋 Available API Endpoints:`);
        console.log(`  GET  http://${config.server.host}:${config.server.port}/api`);
        console.log(`  GET  http://${config.server.host}:${config.server.port}/api/users`);
        console.log(`  POST http://${config.server.host}:${config.server.port}/api/register`);
        console.log(`  GET  http://${config.server.host}:${config.server.port}/api/users/:referralCode`);
        console.log(`\n🔧 Environment: ${config.server.environment}`);
        console.log(`📦 Version: ${config.app.version}`);
    });

    // Handle server errors
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            logger.error(`Port ${config.server.port} is already in use`);
            process.exit(1);
        } else {
            logger.error('Server error', error);
        }
    });

    return server;
};

// Start the server if this file is run directly
if (require.main === module) {
    startServer();
}

// Export for serverless deployment
module.exports = { app, startServer };
module.exports.handler = serverless(app);