# build environment
FROM node:12 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install @vue/cli@4.2.2 -g
COPY . /app
RUN npm run build --prod

# target environment
FROM nginx
ARG target
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.${target}.conf /etc/nginx/nginx.conf

