import * as R from 'ramda';
import twitchTypeDefs from './types/twitch';
import { queryTypeDefs } from './query';

// @ts-ignore
export default R.concat(twitchTypeDefs, [queryTypeDefs]);
