import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  MoreThanOrEqual,
  Index
} from 'typeorm';
import * as R from 'rambda';

@Entity()
@Index(['fromId', 'toId'], { unique: true })
export class Subscription extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public fromId: string;

  @Column()
  public fromName: string;

  @Column()
  public toId: string;

  @Column()
  public toName: string;

  @Column({ type: 'timestamp' })
  public followedAt: Date;

  @Column({ nullable: true })
  public streamId: string;

  @Column({ nullable: true })
  public game: string;

  public static async getSubscribers(twitchId: string, since?: Date): Promise<Subscription[]> {
    const query = R.merge({ toId: twitchId }, since ? { follwedAt: MoreThanOrEqual(since) } : {});
    return await Subscription.find({ where: query });
  }

  public static async getSubscriptions(twitchId: string, since?: Date): Promise<Subscription[]> {
    const query = R.merge({ fromId: twitchId }, since ? { follwedAt: MoreThanOrEqual(since) } : {});
    return await Subscription.find({ where: query });
  }
}
