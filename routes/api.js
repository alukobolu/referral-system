/**
 * API routes for the referral system
 * @module routes/api
 */

const express = require('express');
const serverless = require('serverless-http');
const userService = require('../services/userService');
const logger = require('../utils/logger');
const config = require('../config/config');

const router = express.Router();

/**
 * Middleware to log API requests
 */
const logApiRequest = (req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        logger.logApiRequest(req, res, responseTime);
    });
    
    next();
};

// Apply logging middleware to all API routes
router.use(logApiRequest);

/**
 * @route GET /api
 * @desc Get API information and documentation
 * @access Public
 */
router.get('/', (req, res) => {
    try {
        const apiInfo = {
            success: true,
            message: 'Welcome to the Referral System API',
            version: config.app.version,
            description: config.app.description,
            endpoints: {
                'GET /api': 'Get API information',
                'GET /api/users': 'Get all users',
                'POST /api/register': 'Register a new user',
                'GET /api/users/:referralCode': 'Get user by referral code'
            },
            sampleUsers: userService.getAllUsers().slice(0, 3).map(user => ({
                name: user.name,
                email: user.email,
                referralCode: user.referralCode,
                points: user.points
            }))
        };

        res.json(apiInfo);
    } catch (error) {
        logger.error('Error in API info endpoint', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Public
 */
router.get('/users', (req, res) => {
    try {
        const users = userService.getAllUsers();
        
        res.json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        logger.error('Error fetching users', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * @route POST /api/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', (req, res) => {
    try {
        const { name, email, referralCode } = req.body;
        
        const result = userService.registerUser({ name, email, referralCode });
        
        res.status(result.statusCode).json({
            success: result.success,
            ...(result.success ? { 
                message: 'User registered successfully',
                user: result.user 
            } : { 
                error: result.error 
            })
        });
        
    } catch (error) {
        logger.error('Error in registration endpoint', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * @route GET /api/users/:referralCode
 * @desc Get user by referral code
 * @access Public
 */
router.get('/users/:referralCode', (req, res) => {
    try {
        const { referralCode } = req.params;
        
        if (!referralCode || typeof referralCode !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Invalid referral code format'
            });
        }
        
        const user = userService.findUserByReferralCode(referralCode);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                referralCode: user.referralCode,
                points: user.points,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
        
    } catch (error) {
        logger.error('Error fetching user by referral code', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});



module.exports = router; 