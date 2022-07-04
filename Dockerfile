# build environment
FROM node:12 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install @vue/cli@4.2.2 -g
COPY . /app

# target environment, the minified application is copied into the nginx/html folder
FROM nginx as staging
ARG VERSION
ENV NODE_ENV=staging
RUN npm run build
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.${TARGET}.conf /etc/nginx/nginx.conf
RUN sed -i "s|APPVERSION|${VERSION}|g" /usr/share/nginx/html/index.html

FROM nginx as production
ARG VERSION
ENV NODE_ENV=production
RUN npm run build --prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.${TARGET}.conf /etc/nginx/nginx.conf
RUN sed -i "s|APPVERSION|${VERSION}|g" /usr/share/nginx/html/index.html