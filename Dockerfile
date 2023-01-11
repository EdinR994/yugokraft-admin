FROM node:13.12.0-alpine as build

WORKDIR /app

RUN apk add git

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/admin/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

