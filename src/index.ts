import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

import { oAuthRedirect, exchangeCodeForTokenAndSaveUser } from './utils/TwitchClient';
import twitchRoutes from './api/twitch/index';

const startServer = async () => {
  await createConnection();

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cors());

  app.get('/auth/twitch', oAuthRedirect);
  app.get('/auth/twitch/callback', exchangeCodeForTokenAndSaveUser);
  app.use('/api/twitch', twitchRoutes);

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000`)
  );
};

startServer();
