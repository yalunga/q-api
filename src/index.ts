import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import * as passport from 'passport';
import * as twitchStrategy from 'passport-twitch';

import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { User } from './entity/User';

const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await createConnection();

  const app = express();

  passport.use(new twitchStrategy.Strategy({
    clientID: 'skie54xtpjpiufhos5qearotlz9qia',
    clientSecret: 'btttlu0ho5ivo0agl6wlefj78klxfr',
    callbackURL: 'http://127.0.0.1:4000/auth/twitch/callback',
    scope: 'user_read'
  }, async (accessToken: string, refreshToken: string, profile: any) => {
    if (profile.id) {
      await User.create({ twitchId: profile.id, accessToken, refreshToken }).save();
    }
  }
  ));
  app.get('/auth/twitch', passport.authenticate('twitch'));
  app.get('/auth/twitch/callback', passport.authenticate('twitch', { failureRedirect: '/' }), (_, res) => {
    res.redirect("/");
  });
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
