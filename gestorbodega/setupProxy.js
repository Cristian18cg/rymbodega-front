const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/inventarios', // El path relativo que estás usando en tus solicitudes
    createProxyMiddleware({
      target: 'https://api.worldoffice.cloud',
      changeOrigin: true,
    })
  );
};
