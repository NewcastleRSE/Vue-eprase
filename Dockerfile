# build environment
FROM node:12 as build
WORKDIR /app
ARG TARGET
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install @vue/cli@4.2.2 -g
COPY . /app
RUN npm run build --prod

# target environment, the minified application is copied into the nginx/html folder
FROM nginx
ARG VERSION
ARG TARGET
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.${TARGET}.conf /etc/nginx/nginx.conf
RUN sed -i "s|APPVERSION|${VERSION}|g" /usr/share/nginx/html/index.html