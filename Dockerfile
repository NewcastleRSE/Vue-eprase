FROM node:10 as builder
ARG PROD=false
RUN mkdir /usr/local/app
ADD . /usr/local/app
WORKDIR /usr/local/app
RUN npm install -g @vue/cli && npm install
RUN npm run build --prod=${PROD}

FROM nginx
RUN mkdir -p /etc/nginx/certs
COPY --from=builder /usr/local/app/dist/eprase-app /usr/share/nginx/html
