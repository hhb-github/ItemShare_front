const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 代理所有/api请求到后端服务器
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8081/api',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // 移除/api前缀，后端已经配置了context-path为/api
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:8081/api${proxyReq.path}`);
      },
    })
  );
};