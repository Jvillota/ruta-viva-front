# Build the Angular app and serve it with nginx. Only public images and the public npm registry are used.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npx ng build --configuration production

FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/rutaviva-web/browser /usr/share/nginx/html
EXPOSE 80
