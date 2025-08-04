/**
 * Logging utility for the referral system
 * @module utils/logger
 */

const config = require('../config/config');

/**
 * Log levels
 */
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

/**
 * Logger class for consistent logging across the application
 */
class Logger {
    constructor() {
        this.logLevel = config.server.environment === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;
        
        // Log initialization
        this.info('Logger initialized', {
            environment: config.server.environment,
            logLevel: this.logLevel
        });
    }

    /**
     * Log an error message
     * @param {string} message - Error message
     * @param {Error} [error] - Error object
     * @param {Object} [context] - Additional context
     */
    error(message, error = null, context = {}) {
        if (this.logLevel >= LOG_LEVELS.ERROR) {
            const logData = {
                level: 'ERROR',
                timestamp: new Date().toISOString(),
                message,
                ...context
            };

            if (error) {
                logData.error = {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                };
            }

        }
    }

    /**
     * Log a warning message
     * @param {string} message - Warning message
     * @param {Object} [context] - Additional context
     */
    warn(message, context = {}) {
        if (this.logLevel >= LOG_LEVELS.WARN) {
            const logData = {
                level: 'WARN',
                timestamp: new Date().toISOString(),
                message,
                ...context
            };

        }
    }

    /**
     * Log an info message
     * @param {string} message - Info message
     * @param {Object} [context] - Additional context
     */
    info(message, context = {}) {
        if (this.logLevel >= LOG_LEVELS.INFO) {
            const logData = {
                level: 'INFO',
                timestamp: new Date().toISOString(),
                message,
                ...context
            };

            console.log('ℹ️  INFO:', logData);
        }
    }

    /**
     * Log a debug message
     * @param {string} message - Debug message
     * @param {Object} [context] - Additional context
     */
    debug(message, context = {}) {
        if (this.logLevel >= LOG_LEVELS.DEBUG) {
            const logData = {
                level: 'DEBUG',
                timestamp: new Date().toISOString(),
                message,
                ...context
            };

            console.log('🔍 DEBUG:', logData);
        }
    }

    /**
     * Log API request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {number} responseTime - Response time in milliseconds
     */
    logApiRequest(req, res, responseTime) {
        try {
            const logData = {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                responseTime: `${responseTime}ms`,
                userAgent: req.get('User-Agent') || 'Unknown',
                ip: req.ip || req.connection?.remoteAddress || 'Unknown',
                environment: config.server.environment
            };

            if (res.statusCode >= 400) {
                this.warn('API Request', logData);
            } else {
                this.info('API Request', logData);
            }
        } catch (error) {
            // Fallback logging if there's an error in the logging itself
            console.error('Logging error:', error);
        }
    }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger; 