import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { oAuthRedirect, exchangeCodeForTokenAndSaveUser } from './utils/TwitchClient';
import twitchRoutes from './api/twitch/index';
import { init } from './utils/Init';
import { User } from './entity/Users';

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      try {
        if (req.cookies.token) {
          const id = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET as string) as string;
          const user = await User.getUserById(id);
          return { user };
        }
      } catch (e) {
        return;
      }
      return;
    }
  });
  await createConnection();

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.get('/init', init);

  app.get('/auth/twitch', oAuthRedirect);
  app.get('/auth/twitch/callback', exchangeCodeForTokenAndSaveUser);
  app.use('/api/twitch', twitchRoutes);

  server.applyMiddleware({
    app,
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
