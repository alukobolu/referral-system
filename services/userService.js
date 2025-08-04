/**
 * User service for handling user-related business logic
 * @module services/userService
 */

const crypto = require('crypto');
const config = require('../config/config');
const logger = require('../utils/logger');
const { validateUserInput, sanitizeUserInput } = require('../utils/validation');

/**
 * User service class
 */
class UserService {
    constructor() {
        // Initialize with sample users
        this.users = [
            {
                id: 1,
                name: "Alice Johnson",
                email: "alice@example.com",
                referralCode: "ABC123",
                points: 0,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01')
            },
            {
                id: 2,
                name: "Bob Smith",
                email: "bob@example.com",
                referralCode: "DEF456",
                points: 20,
                createdAt: new Date('2024-01-02'),
                updatedAt: new Date('2024-01-02')
            },
            {
                id: 3,
                name: "Carol Davis",
                email: "carol@example.com",
                referralCode: "GHI789",
                points: 50,
                createdAt: new Date('2024-01-03'),
                updatedAt: new Date('2024-01-03')
            }
        ];
        
        this.nextUserId = 4;
    }

    /**
     * Generate a unique referral code
     * @returns {string} Unique 6-character referral code
     */
    generateReferralCode() {
        let code;
        let attempts = 0;
        const maxAttempts = 100;

        do {
            // Generate 6-character alphanumeric code
            code = crypto.randomBytes(3).toString('hex').toUpperCase();
            if (code.length < config.validation.referralCodeLength) {
                code = code.padEnd(config.validation.referralCodeLength, '0');
            }
            attempts++;
        } while (this.users.some(user => user.referralCode === code) && attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            logger.error('Failed to generate unique referral code after maximum attempts');
            throw new Error('Unable to generate unique referral code');
        }

        logger.debug('Generated referral code', { code, attempts });
        return code;
    }

    /**
     * Find user by referral code
     * @param {string} referralCode - Referral code to search for
     * @returns {Object|null} User object or null if not found
     */
    findUserByReferralCode(referralCode) {
        if (!referralCode || typeof referralCode !== 'string') {
            return null;
        }

        const normalizedCode = referralCode.trim().toUpperCase();
        return this.users.find(user => user.referralCode === normalizedCode);
    }

    /**
     * Find user by email
     * @param {string} email - Email to search for
     * @returns {Object|null} User object or null if not found
     */
    findUserByEmail(email) {
        if (!email || typeof email !== 'string') {
            return null;
        }

        const normalizedEmail = email.trim().toLowerCase();
        return this.users.find(user => user.email === normalizedEmail);
    }

    /**
     * Get all users
     * @returns {Array} Array of user objects
     */
    getAllUsers() {
        return this.users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            referralCode: user.referralCode,
            points: user.points,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
    }

    /**
     * Get user by ID
     * @param {number} id - User ID
     * @returns {Object|null} User object or null if not found
     */
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    /**
     * Register a new user
     * @param {Object} userData - User data
     * @param {string} userData.name - User's name
     * @param {string} userData.email - User's email
     * @param {string} [userData.referralCode] - Optional referral code
     * @returns {Object} Registration result
     */
    registerUser(userData) {
        try {
            // Sanitize input
            const sanitizedData = sanitizeUserInput(userData);

            // Validate input
            const validation = validateUserInput(sanitizedData);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors.join(', '),
                    statusCode: 400
                };
            }

            // Check if email already exists
            const existingUser = this.findUserByEmail(sanitizedData.email);
            if (existingUser) {
                return {
                    success: false,
                    error: 'Email already exists',
                    statusCode: 409
                };
            }

            // Validate referral code if provided
            if (sanitizedData.referralCode) {
                const referrer = this.findUserByReferralCode(sanitizedData.referralCode);
                if (!referrer) {
                    return {
                        success: false,
                        error: 'Invalid referral code',
                        statusCode: 400
                    };
                }
            }

            // Create new user
            const newUser = {
                id: this.nextUserId++,
                name: sanitizedData.name,
                email: sanitizedData.email,
                referralCode: this.generateReferralCode(),
                points: config.points.initialPoints,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Add user to store
            this.users.push(newUser);

            // Award points to referrer if applicable
            if (sanitizedData.referralCode) {
                const referrer = this.findUserByReferralCode(sanitizedData.referralCode);
                if (referrer) {
                    referrer.points += config.points.referralBonus;
                    referrer.updatedAt = new Date();
                    
                    logger.info('Awarded referral points', {
                        referrerId: referrer.id,
                        referrerName: referrer.name,
                        newUser: newUser.name,
                        pointsAwarded: config.points.referralBonus
                    });
                }
            }

            logger.info('User registered successfully', {
                userId: newUser.id,
                userEmail: newUser.email,
                referralCode: newUser.referralCode
            });

            return {
                success: true,
                user: newUser,
                statusCode: 201
            };

        } catch (error) {
            logger.error('Error registering user', error, { userData });
            return {
                success: false,
                error: 'Internal server error',
                statusCode: 500
            };
        }
    }

    /**
     * Update user points
     * @param {number} userId - User ID
     * @param {number} points - Points to add/subtract
     * @returns {Object} Update result
     */
    updateUserPoints(userId, points) {
        try {
            const user = this.getUserById(userId);
            if (!user) {
                return {
                    success: false,
                    error: 'User not found',
                    statusCode: 404
                };
            }

            const oldPoints = user.points;
            user.points += points;
            user.updatedAt = new Date();

            logger.info('Updated user points', {
                userId: user.id,
                userEmail: user.email,
                oldPoints,
                newPoints: user.points,
                pointsChange: points
            });

            return {
                success: true,
                user: user,
                statusCode: 200
            };

        } catch (error) {
            logger.error('Error updating user points', error, { userId, points });
            return {
                success: false,
                error: 'Internal server error',
                statusCode: 500
            };
        }
    }

    /**
     * Get user statistics
     * @returns {Object} User statistics
     */
    getUserStatistics() {
        const totalUsers = this.users.length;
        const totalPoints = this.users.reduce((sum, user) => sum + user.points, 0);
        const averagePoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;
        const topUsers = this.users
            .sort((a, b) => b.points - a.points)
            .slice(0, 5)
            .map(user => ({
                name: user.name,
                email: user.email,
                points: user.points
            }));

        return {
            totalUsers,
            totalPoints,
            averagePoints,
            topUsers
        };
    }
}

module.exports = new UserService(); 