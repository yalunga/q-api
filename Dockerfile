FROM node:10
WORKDIR /build

COPY package.json yarn.lock ./

RUN yarn --production

COPY . .

EXPOSE 4000

CMD ["yarn","start"]