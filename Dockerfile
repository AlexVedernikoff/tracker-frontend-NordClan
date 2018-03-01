FROM node:8.9
RUN mkdir -p /app
COPY . /app
WORKDIR /app
RUN npm install && \
    npm rebuild
EXPOSE 8080
