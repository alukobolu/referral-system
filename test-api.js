/**
 * Simple test script to verify API functionality
 */

const { handler } = require('./api/index.js');

// Mock event and context for testing
const mockEvent = {
    httpMethod: 'GET',
    path: '/test',
    headers: {
        'Content-Type': 'application/json'
    },
    body: null
};

const mockContext = {};

async function testAPI() {
    console.log('🧪 Testing API functionality...\n');
    
    try {
        // Test the handler
        const result = await handler(mockEvent, mockContext);
        
        console.log('✅ API Handler Response:');
        console.log('Status Code:', result.statusCode);
        console.log('Headers:', result.headers);
        console.log('Body:', result.body);
        
        // Parse and display the body
        try {
            const body = JSON.parse(result.body);
            console.log('\n📋 Parsed Response:');
            console.log(JSON.stringify(body, null, 2));
        } catch (parseError) {
            console.log('❌ Failed to parse response body:', parseError.message);
        }
        
    } catch (error) {
        console.log('❌ API Handler Error:', error.message);
        console.log('Stack:', error.stack);
    }
}

// Run the test
testAPI(); 