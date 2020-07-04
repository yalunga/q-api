// import * as moment from 'moment';

import { User } from '../entity/Users';
import { getAllCurrentStreams, enableWebhooks, getTwitchAccountFromId } from './TwitchClient';

export const init = async () => {
  try {
    const allStreams = await getAllCurrentStreams();
    let i = 1;
    for (const stream of allStreams) {
      console.log(`-------------------${i} of ${allStreams.length}-----------------`);
      const twitchAccount = await getTwitchAccountFromId(stream.user_id);
      await User.create({
        twitchId: stream.user_id,
        twitchName: stream.user_name,
        twitchProfileImage: twitchAccount.profile_image_url,
        description: twitchAccount.description,
        broadcasterType: twitchAccount.broadcaster_type
      }).save();
      console.log('ENABLING WEBHOOKS FOR: ', stream.user_name);
      await enableWebhooks(stream.user_id, stream.user_name);
      setInterval(async () => await enableWebhooks(stream.user_id, stream.user_name), 864000000);
      i++;
    }
    console.log('finished init');
  } catch (error) {
    console.log(error);
  }
};
