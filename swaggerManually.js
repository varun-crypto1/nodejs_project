const swaggerJSDoc = require('swagger-jsdoc');

// Swagger JSDoc setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Demo project',
      description: 'You can see APIs for Demo project',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Specify where the route files are located
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;