FROM node:12.16.1-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

# EXPOSE 3000

CMD ["npm", "start"]
