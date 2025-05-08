FROM node:22

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm approve-builds

RUN pnpm rebuild bcrypt

COPY . ./

EXPOSE 3000

CMD [ "pnpm", "dev" ]
