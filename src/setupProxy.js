const { createProxyMiddleware } = require('http-proxy-middleware');

const backendPort = process.env.BACKEND_PORT || '8080'

module.exports = function(app) {
    app
        .use(
            createProxyMiddleware(
                '/graphql',
                {
                    target: `https://mob-assist-api-mob-assist-dev.toolkit-dev-gitops-42-2ab66b053c14936810608de9a1deac9c-0000.us-east.containers.appdomain.cloud`,
                    changeOrigin: true,
                }
            )
        )
        .use(
            createProxyMiddleware(
                '/subscription',
                {
                    target: `ws://mob-assist-api-mob-assist-dev.toolkit-dev-gitops-42-2ab66b053c14936810608de9a1deac9c-0000.us-east.containers.appdomain.cloud`,
                    changeOrigin: true,
                    ws: true,
                }
            )
        )
};