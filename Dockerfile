FROM node:16-alpine

RUN mkdir -p /home/node/botperpus/node_modules && chown -R node:node /home/node/botperpus

WORKDIR /home/node/botperpus

COPY package*.json ./

USER root

RUN npm install

USER node

COPY --chown=node:node . .

EXPOSE 443

CMD [ "node", "src/app/index.js" ]
