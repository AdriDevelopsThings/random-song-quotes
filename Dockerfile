FROM node:lts
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g serve

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install --production=false

COPY ./public ./public
COPY ./src ./src
COPY tsconfig.json .
RUN yarn run build

EXPOSE 80
CMD ["serve", "-s", "build", "-l", "tcp://0.0.0.0:80"]