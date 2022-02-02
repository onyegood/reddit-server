FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

# Coppy production envirnment variable and rename it to .env
COPY .env.production .env

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080

CMD ["node", "dist/index.js"]

USER node
