import { User } from './entity/User';

export const resolvers = {
  Query: {
    getUser: async (_: any, args: any) => {
      const { id } = args;
      return await User.findOne({ where: { id } });
    }
  },
  Mutation: {
    addUser: async (_: any, args: any) => {
      console.log(args);
      return true;
    }
  }
}