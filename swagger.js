const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Demo project',
    description: 'You can see APIs for Demo project'
  },
  host: 'localhost:3000',  // Your server's host (update this accordingly)
  basePath: '/', // Base path
  schemes: ['http'], // Schemes (http or https)
};

const outputFile = './swagger-output.json';
const routes = ['./routes/*.js']; // Automatically include route files from routes directory

swaggerAutogen(outputFile, routes, doc);