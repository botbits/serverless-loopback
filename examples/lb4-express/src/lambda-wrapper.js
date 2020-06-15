'use strict';

const {ExpressServer} = require('./server');
const serverless = require('serverless-http');

let app;

async function main(options) {
  const server = new ExpressServer(options);
  app = serverless(server.app);
  await server.boot();
  await server.start();
  console.log('Server is running at http://127.0.0.1:3000');
}

exports.handler = async function handler(request, ...context) {
  if (app === undefined) {
    // Run the application
    const config = {
      rest: {
        port: +(process.env.PORT ? process.env.PORT : 3000),
        host: process.env.HOST ? process.env.HOST : 'localhost',
        openApiSpec: {
          // useful when used with OpenAPI-to-GraphQL to locate your application
          setServersFromRequest: true,
        },
        // Use the LB4 application as a route. It should not be listening.
        listenOnStart: false,
      },
    };
    await main(config).catch(err => {
      console.error('Cannot start the application.', err);
      process.exit(1);
    });
  }
  return app(request, ...context);
};
