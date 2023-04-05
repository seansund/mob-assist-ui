FROM registry.access.redhat.com/ubi9/nodejs-18:1-35 as builder

COPY --chown=default . .

RUN npm install && npm run build

FROM registry.access.redhat.com/ubi9/nginx-120:1-95

COPY --chown=default --from=builder /opt/app-root/src/build .
COPY --chown=default nginx/nginx.conf "${NGINX_CONF_PATH}"
COPY --chown=default nginx/nginx-default-cfg/*.conf "${NGINX_DEFAULT_CONF_PATH}"

RUN echo "nginx config path: ${NGINX_CONFIGURATION_PATH}"
RUN echo "nginx default config: ${NGINX_DEFAULT_CONF_PATH}"
RUN echo "nginx config: ${NGINX_CONF_PATH}"

CMD nginx -g "daemon off;"
