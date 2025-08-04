const express = require('express');
const serverless = require('serverless-http');
const apiRoutes = require('../routes/api');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Error handler
app.use(errorHandler);

module.exports.handler = serverless(app);
    