# build environment
FROM node:12 as build
ARG VERSION
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install @vue/cli@4.2.2 -g
COPY . /app
RUN sed -i "s|APPVERSION|${VERSION}|g" index.html
RUN npm run build --prod

# target environment, the minified application is copied into the nginx/html folder
FROM nginx
ARG TARGET
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.${TARGET}.conf /etc/nginx/nginx.conf

