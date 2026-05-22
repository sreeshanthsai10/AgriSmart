const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AgriSmart API',
            version: '1.0.0',
            description: 'API documentation for AgriSmart backend'
        },
        servers: [
            {
                url: 'http://localhost:5000'
            }
        ]
    },
    apis: ['./src/routes/*.js'] // where docs will be written
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;