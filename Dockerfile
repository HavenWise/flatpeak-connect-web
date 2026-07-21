# Use Node.js as base image
FROM node:latest AS build

ARG CONNECT_API_URL
ENV CONNECT_API_URL=${CONNECT_API_URL}

# Set the working directory inside the container
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

#COPY nginx.conf /etc/nginx/conf.d/default.conf

# Command to start Nginx server
CMD ["nginx", "-g", "daemon off;"]
