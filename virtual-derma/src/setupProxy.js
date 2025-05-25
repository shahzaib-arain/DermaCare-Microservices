const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // For security-service routes
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'http://localhost:9092',
      changeOrigin: true,
      pathRewrite: {
        '^/auth': '/auth' // Maintains exact gateway path
      }
    })
  );

  // For user-service routes
  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: 'http://localhost:9092',
      changeOrigin: true,
      pathRewrite: {
        '^/api/auth': '/api/auth' // Matches gateway route
      }
    })
  );

  // For dermacare-service routes
  app.use(
    '/api/appointment',
    createProxyMiddleware({
      target: 'http://localhost:9092',
      changeOrigin: true,
      pathRewrite: {
        '^/api/appointment': '/api/appointment' // Exact match
      }
    })
  );

  app.use(
    '/api/diagnosis',
    createProxyMiddleware({
      target: 'http://localhost:9092',
      changeOrigin: true,
      pathRewrite: {
        '^/api/diagnosis': '/api/diagnosis'
      }
    })
  );

  app.use(
    '/api/pharmacy',
    createProxyMiddleware({
      target: 'http://localhost:9092',
      changeOrigin: true,
      pathRewrite: {
        '^/api/pharmacy': '/api/pharmacy'
      }
    })
  );

  // For admin/doctor/patient specific routes
  app.use(
    '/api/admin',
    createProxyMiddleware({
      target: 'http://localhost:9092',
      changeOrigin: true
    })
  );

  app.use(
    '/api/doctor',
    createProxyMiddleware({
      target: 'http://localhost:9092',
      changeOrigin: true
    })
  );

  app.use(
    '/api/patient',
    createProxyMiddleware({
      target: 'http://localhost:9092',
      changeOrigin: true
    })
  );
};