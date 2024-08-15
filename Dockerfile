FROM node:22

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install

COPY . ./

EXPOSE 3000

CMD [ "pnpm", "dev" ]