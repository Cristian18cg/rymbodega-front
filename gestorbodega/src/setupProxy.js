const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',  // Define el path donde quieres aplicar el proxy
    createProxyMiddleware({
      target: 'https://api.worldoffice.cloud/api/v1', // URL de tu API
      changeOrigin: true,
    })
  );
};
