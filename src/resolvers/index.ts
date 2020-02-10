import * as R from 'ramda';
import twitchResolvers from './twitch';

// @ts-ignore
export default R.concat(twitchResolvers, []);
