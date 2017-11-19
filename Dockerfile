FROM node:6.11
RUN mkdir -p /app
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
RUN npm install --global serve
EXPOSE 8080
