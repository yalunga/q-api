import * as moment from 'moment';

import { User } from '../entity/Users';
import { Follow } from '../entity/Follows';
import { Game } from '../entity/Game';
import { Stream } from '../entity/Streams';
import { ViewCount } from '../entity/ViewCounts';

export const init = async (_: any, res: any) => {
    try {
        console.log('here');
        const user = User.create({
            twitchId: '252893346',
            accessToken: 'p7asqkvqhekp46b5mzkudu3npivrv7',
            refreshToken: '0osj2d1eezeg9vj0sunwbqv6fs0rtenmu4wc7uvcnwu6ci3hfc',
            twitchName: 'AndyYalung',
            twitchProfileImage: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/41780b5a-def8-11e9-94d9-784f43822e80-profile_image-300x300.png'
        });
        await user.save();
        const twoMonthsAgo = moment().subtract('2', 'months');
        for (let i = 0; i < 60; i++) {
            const day = moment(twoMonthsAgo).add(i, 'days');
            console.log(day.format());
            await Stream.create({
                streamId: String(i),
                twitchId: '252893346',
                startedAt: day.toDate(),
                endedAt: moment(day).add(8, 'hours').toDate(),
                viewsAtBeginning: i,
                viewsAtEnd: i + 1,
                totalViews: 1
            }).save();
            await Game.create({
                twitchId: '252893346',
                streamId: String(i),
                game: i % 2 === 0 ? 'Fortnite' : 'League of Legends',
                title: `Stream ${i}`,
                startedAt: moment(day).toDate(),
                endedAt: moment(day).add(8, 'hours').toDate()
            }).save();
            for (let j = 0; j < Math.floor(Math.random() * Math.floor(20)); j++) {
                await Follow.create({
                    fromId: `${i}${j}${Math.random() * 10000}`,
                    fromName: `Random Twitch ${j}`,
                    toId: '252893346',
                    toName: 'AndyYalung',
                    followedAt: moment(day).add(Math.floor(Math.random() * Math.floor(460)), 'minutes').toDate(),
                    streamId: String(i),
                    game: i % 2 === 0 ? 'Fortnite' : 'League of Legends'
                }).save();
            }
            for (let j = 0; j < 460; j += 5) {
                await ViewCount.create({
                    streamId: String(i),
                    twitchId: '252893346',
                    game: i % 2 === 0 ? 'Fortnite' : 'League of Legends',
                    title: `Stream ${i}`,
                    timestamp: moment(day).add(j, 'minutes').toDate(),
                    viewCount: Math.floor(Math.random() * 100)
                }).save();
            }
        }
        res.send('Success');
    } catch (error) {
        console.log(error);
    }
};
