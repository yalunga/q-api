import { User } from '../../../entity/Users';

export const userResolver = {
    Query: {
        getUser(_: any, args: any) {
            return User.getUserByAccessToken(args.accessToken);
        }
    }
};
