const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Basic middleware
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test endpoint working',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Referral System API',
        endpoints: {
            test: '/test',
            health: '/health',
            api: '/api'
        }
    });
});

// Simple API routes
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'API is working',
        endpoints: {
            users: '/api/users',
            register: '/api/register'
        }
    });
});

app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        count: 3,
        users: [
            {
                id: 1,
                name: "Alice Johnson",
                email: "alice@example.com",
                referralCode: "ABC123",
                points: 0
            },
            {
                id: 2,
                name: "Bob Smith",
                email: "bob@example.com",
                referralCode: "DEF456",
                points: 20
            },
            {
                id: 3,
                name: "Carol Davis",
                email: "carol@example.com",
                referralCode: "GHI789",
                points: 50
            }
        ]
    });
});

app.post('/api/register', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            error: 'Name and email are required'
        });
    }
    
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: 4,
            name,
            email,
            referralCode: 'XYZ789',
            points: 0
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Export for serverless deployment
module.exports.handler = serverless(app);
    