const { createProxyMiddleware } = require('http-proxy-middleware');

const backendPort = process.env.BACKEND_PORT || '8080'

module.exports = function(app) {
    app
        .use(
            createProxyMiddleware(
                '/graphql',
                {
                    target: `http://localhost:${backendPort}`,
                    changeOrigin: true,
                }
            )
        )
        .use(
            createProxyMiddleware(
                '/subscription',
                {
                    target: `ws://localhost:${backendPort}`,
                    changeOrigin: true,
                    ws: true,
                }
            )
        )
};