# build stage
FROM node:20.9.0-alpine3.18 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# launch stage
FROM nginx:stable-alpine as launch-stage
# Add nginx config
COPY nginx.conf /temp/nginx.conf
RUN envsubst /app < /temp/nginx.conf > /etc/nginx/conf.d/default.conf
# Copy dist folder
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
