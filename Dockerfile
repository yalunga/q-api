FROM node:10

WORKDIR /usr/src/app

COPY package.json .

RUN yarn

# Copy all other source code to work directory
ADD . /usr/src/app

RUN yarn add global ts-node

EXPOSE 4000

CMD ["yarn","start"]