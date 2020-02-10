import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    MoreThanOrEqual,
    Index
} from 'typeorm';
import * as R from 'ramda';

@Entity()
@Index(['fromId', 'toId'], { unique: true })
export class Follow extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fromId: string;

    @Column()
    fromName: string;

    @Column()
    toId: string;

    @Column()
    toName: string;

    @Column({ type: 'timestamp' })
    followedAt: Date;

    @Column({ nullable: true })
    streamId: string;

    @Column({ nullable: true })
    game: string;

    public static async getFollows(twitchId: string, since?: Date): Promise<Follow[]> {
        const query = R.merge({ toId: twitchId }, since ? { follwedAt: MoreThanOrEqual(since) } : {});
        return await Follow.find({ where: query });
    }

    public static async getFollowing(twitchId: string, since?: Date): Promise<Follow[]> {
        const query = R.merge({ fromId: twitchId }, since ? { follwedAt: MoreThanOrEqual(since) } : {});
        return await Follow.find({ where: query });
    }
}
