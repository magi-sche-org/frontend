FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 9090
CMD ["node", "server.js"]