/**
 * Application configuration
 * @module config
 */

const config = {
    // Server configuration
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        environment: process.env.NODE_ENV || 'development'
    },
    
    // Database configuration (for future use)
    database: {
        url: process.env.DATABASE_URL || 'memory',
        type: 'in-memory'
    },
    
    // Application settings
    app: {
        name: 'Referral System',
        version: '1.0.0',
        description: 'A referral system with points tracking'
    },
    
    // Validation settings
    validation: {
        minNameLength: 2,
        maxNameLength: 50,
        minEmailLength: 5,
        maxEmailLength: 100,
        referralCodeLength: 6
    },
    
    // Points system
    points: {
        referralBonus: 10,
        initialPoints: 0
    }
};

module.exports = config; 