FROM node:6.11
RUN mkdir -p /app
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 8080