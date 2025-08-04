/**
 * Unit tests for UserService
 * @module tests/userService.test
 */

const userService = require('../services/userService');
const { validateUserInput, sanitizeUserInput } = require('../utils/validation');

// Mock logger to avoid console output during tests
jest.mock('../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    logApiRequest: jest.fn()
}));

describe('UserService', () => {
    let originalUsers;

    beforeEach(() => {
        // Store original users and reset to initial state
        originalUsers = [...userService.users];
        userService.users = [
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
            }
        ];
        userService.nextUserId = 3;
    });

    afterEach(() => {
        // Restore original users
        userService.users = originalUsers;
    });

    describe('generateReferralCode', () => {
        test('should generate unique 6-character codes', () => {
            const code1 = userService.generateReferralCode();
            const code2 = userService.generateReferralCode();

            expect(code1).toHaveLength(6);
            expect(code2).toHaveLength(6);
            expect(code1).not.toBe(code2);
            expect(code1).toMatch(/^[A-Z0-9]{6}$/);
            expect(code2).toMatch(/^[A-Z0-9]{6}$/);
        });

        test('should not generate duplicate codes', () => {
            const codes = new Set();
            for (let i = 0; i < 10; i++) {
                const code = userService.generateReferralCode();
                expect(codes.has(code)).toBe(false);
                codes.add(code);
            }
        });
    });

    describe('findUserByReferralCode', () => {
        test('should find user by valid referral code', () => {
            const user = userService.findUserByReferralCode('ABC123');
            expect(user).toBeDefined();
            expect(user.name).toBe('Alice Johnson');
        });

        test('should return null for invalid referral code', () => {
            const user = userService.findUserByReferralCode('INVALID');
            expect(user).toBeNull();
        });

        test('should handle case insensitive search', () => {
            const user = userService.findUserByReferralCode('abc123');
            expect(user).toBeDefined();
            expect(user.name).toBe('Alice Johnson');
        });

        test('should return null for null/undefined input', () => {
            expect(userService.findUserByReferralCode(null)).toBeNull();
            expect(userService.findUserByReferralCode(undefined)).toBeNull();
        });
    });

    describe('findUserByEmail', () => {
        test('should find user by valid email', () => {
            const user = userService.findUserByEmail('alice@example.com');
            expect(user).toBeDefined();
            expect(user.name).toBe('Alice Johnson');
        });

        test('should return null for invalid email', () => {
            const user = userService.findUserByEmail('nonexistent@example.com');
            expect(user).toBeNull();
        });

        test('should handle case insensitive search', () => {
            const user = userService.findUserByEmail('ALICE@EXAMPLE.COM');
            expect(user).toBeDefined();
            expect(user.name).toBe('Alice Johnson');
        });
    });

    describe('getAllUsers', () => {
        test('should return all users', () => {
            const users = userService.getAllUsers();
            expect(users).toHaveLength(2);
            expect(users[0].name).toBe('Alice Johnson');
            expect(users[1].name).toBe('Bob Smith');
        });

        test('should return users with all required fields', () => {
            const users = userService.getAllUsers();
            const user = users[0];
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('referralCode');
            expect(user).toHaveProperty('points');
            expect(user).toHaveProperty('createdAt');
            expect(user).toHaveProperty('updatedAt');
        });
    });

    describe('registerUser', () => {
        test('should register user with valid data', () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com'
            };

            const result = userService.registerUser(userData);

            expect(result.success).toBe(true);
            expect(result.user.name).toBe('John Doe');
            expect(result.user.email).toBe('john@example.com');
            expect(result.user.points).toBe(0);
            expect(result.user.referralCode).toHaveLength(6);
            expect(result.statusCode).toBe(201);
        });

        test('should register user with referral code', () => {
            const userData = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                referralCode: 'ABC123'
            };

            const result = userService.registerUser(userData);

            expect(result.success).toBe(true);
            expect(result.user.name).toBe('Jane Doe');
            
            // Check that referrer got points
            const referrer = userService.findUserByReferralCode('ABC123');
            expect(referrer.points).toBe(10); // 0 + 10 bonus
        });

        test('should reject registration with invalid name', () => {
            const userData = {
                name: '',
                email: 'test@example.com'
            };

            const result = userService.registerUser(userData);

            expect(result.success).toBe(false);
            expect(result.error).toContain('Name cannot be empty');
            expect(result.statusCode).toBe(400);
        });

        test('should reject registration with invalid email', () => {
            const userData = {
                name: 'Test User',
                email: 'invalid-email'
            };

            const result = userService.registerUser(userData);

            expect(result.success).toBe(false);
            expect(result.error).toContain('Email format is invalid');
            expect(result.statusCode).toBe(400);
        });

        test('should reject registration with duplicate email', () => {
            const userData = {
                name: 'Test User',
                email: 'alice@example.com'
            };

            const result = userService.registerUser(userData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Email already exists');
            expect(result.statusCode).toBe(409);
        });

        test('should reject registration with invalid referral code', () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                referralCode: 'INVALID'
            };

            const result = userService.registerUser(userData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Invalid referral code');
            expect(result.statusCode).toBe(400);
        });
    });

    describe('updateUserPoints', () => {
        test('should update user points successfully', () => {
            const result = userService.updateUserPoints(1, 50);

            expect(result.success).toBe(true);
            expect(result.user.points).toBe(50);
            expect(result.statusCode).toBe(200);
        });

        test('should return error for non-existent user', () => {
            const result = userService.updateUserPoints(999, 50);

            expect(result.success).toBe(false);
            expect(result.error).toBe('User not found');
            expect(result.statusCode).toBe(404);
        });
    });

    describe('getUserStatistics', () => {
        test('should return correct statistics', () => {
            const stats = userService.getUserStatistics();

            expect(stats.totalUsers).toBe(2);
            expect(stats.totalPoints).toBe(20); // 0 + 20
            expect(stats.averagePoints).toBe(10); // 20 / 2
            expect(stats.topUsers).toHaveLength(2);
            expect(stats.topUsers[0].name).toBe('Bob Smith'); // Highest points
        });
    });
});

describe('Validation Utils', () => {
    describe('validateUserInput', () => {
        test('should validate correct user data', () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com'
            };

            const result = validateUserInput(userData);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('should reject invalid email format', () => {
            const userData = {
                name: 'John Doe',
                email: 'invalid-email'
            };

            const result = validateUserInput(userData);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Email format is invalid');
        });

        test('should reject short name', () => {
            const userData = {
                name: 'A',
                email: 'john@example.com'
            };

            const result = validateUserInput(userData);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Name must be at least 2 characters long');
        });

        test('should validate referral code format', () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                referralCode: 'ABC123'
            };

            const result = validateUserInput(userData);
            expect(result.isValid).toBe(true);
        });

        test('should reject invalid referral code format', () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                referralCode: 'ABC12' // Too short
            };

            const result = validateUserInput(userData);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Referral code must be exactly 6 characters');
        });
    });

    describe('sanitizeUserInput', () => {
        test('should sanitize user input', () => {
            const userData = {
                name: '  John Doe  ',
                email: '  JOHN@EXAMPLE.COM  ',
                referralCode: '  abc123  '
            };

            const sanitized = sanitizeUserInput(userData);

            expect(sanitized.name).toBe('John Doe');
            expect(sanitized.email).toBe('john@example.com');
            expect(sanitized.referralCode).toBe('ABC123');
        });
    });
}); 