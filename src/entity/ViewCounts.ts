import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, MoreThanOrEqual } from 'typeorm';
import * as R from 'ramda';
import { Stream } from './Streams';

@Entity()
export class ViewCount extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    twitchId: string;

    @ManyToOne(_ => Stream)
    @JoinColumn()
    streamId: string;

    @Column()
    game: string;

    @Column()
    title: string;

    @Column()
    viewCount: number;

    @Column({ type: 'timestamp' })
    timestamp: Date;

    public static async getAverageViewCount(twitchId: string, since?: Date): Promise<number> {
        const query = R.merge({ twitchId }, since ? { timestamp: MoreThanOrEqual(since) } : {});
        const viewCounts = await ViewCount.find({ where: query });
        if (viewCounts.length === 0) {
            return 0;
        }
        const views = R.pluck('viewCount')(viewCounts);
        // @ts-ignore
        return R.mean(views);
    }

    public static async getViewCounts(twitchId: string, since?: Date): Promise<ViewCount[]> {
        const query = R.merge({ twitchId }, since ? { timestamp: MoreThanOrEqual(since) } : {});
        return await ViewCount.find({ where: query });
    }
}
