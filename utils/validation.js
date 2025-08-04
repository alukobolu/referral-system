/**
 * Validation utilities for the referral system
 * @module utils/validation
 */

const config = require('../config/config');

/**
 * Validates user input data
 * @param {Object} userData - User data to validate
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} [userData.referralCode] - Optional referral code
 * @returns {Object} Validation result with success status and error message
 */
function validateUserInput(userData) {
    const { name, email, referralCode } = userData;
    const errors = [];

    // Validate name
    if (!name || typeof name !== 'string') {
        errors.push('Name is required and must be a string');
    } else {
        const trimmedName = name.trim();
        if (trimmedName.length === 0) {
            errors.push('Name cannot be empty');
        } else if (trimmedName.length < config.validation.minNameLength) {
            errors.push(`Name must be at least ${config.validation.minNameLength} characters long`);
        } else if (trimmedName.length > config.validation.maxNameLength) {
            errors.push(`Name cannot exceed ${config.validation.maxNameLength} characters`);
        }
    }

    // Validate email
    if (!email || typeof email !== 'string') {
        errors.push('Email is required and must be a string');
    } else {
        const trimmedEmail = email.trim().toLowerCase();
        if (trimmedEmail.length === 0) {
            errors.push('Email cannot be empty');
        } else if (trimmedEmail.length < config.validation.minEmailLength) {
            errors.push(`Email must be at least ${config.validation.minEmailLength} characters long`);
        } else if (trimmedEmail.length > config.validation.maxEmailLength) {
            errors.push(`Email cannot exceed ${config.validation.maxEmailLength} characters`);
        } else if (!isValidEmail(trimmedEmail)) {
            errors.push('Email format is invalid');
        }
    }

    // Validate referral code (if provided)
    if (referralCode !== undefined && referralCode !== null) {
        if (typeof referralCode !== 'string') {
            errors.push('Referral code must be a string');
        } else {
            const trimmedCode = referralCode.trim().toUpperCase();
            if (trimmedCode.length === 0) {
                errors.push('Referral code cannot be empty');
            } else if (trimmedCode.length !== config.validation.referralCodeLength) {
                errors.push(`Referral code must be exactly ${config.validation.referralCodeLength} characters`);
            } else if (!isValidReferralCode(trimmedCode)) {
                errors.push('Referral code must contain only alphanumeric characters');
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} True if email format is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates referral code format
 * @param {string} code - Referral code to validate
 * @returns {boolean} True if referral code format is valid
 */
function isValidReferralCode(code) {
    const codeRegex = /^[A-Z0-9]{6}$/;
    return codeRegex.test(code);
}

/**
 * Validates user ID
 * @param {number} id - User ID to validate
 * @returns {boolean} True if ID is valid
 */
function isValidUserId(id) {
    return typeof id === 'number' && id > 0 && Number.isInteger(id);
}

/**
 * Sanitizes user input
 * @param {Object} userData - User data to sanitize
 * @returns {Object} Sanitized user data
 */
function sanitizeUserInput(userData) {
    const sanitized = {};
    
    if (userData.name) {
        sanitized.name = userData.name.trim();
    }
    
    if (userData.email) {
        sanitized.email = userData.email.trim().toLowerCase();
    }
    
    if (userData.referralCode) {
        sanitized.referralCode = userData.referralCode.trim().toUpperCase();
    }
    
    return sanitized;
}

module.exports = {
    validateUserInput,
    isValidEmail,
    isValidReferralCode,
    isValidUserId,
    sanitizeUserInput
}; 