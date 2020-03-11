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

  public static async getFollowCountsByMeasureOfTime(twitchId: string, measureOfTime: string, since?: Date): Promise<any> {
    const result = since
      ? await Follow
        .createQueryBuilder()
        .select(`date_trunc(\'${measureOfTime}\', Follow.followedAt) date, COUNT(Follow.id)`)
        .where(`Follow.toId = :twitchId AND Follow.followedAt >= :since`, { twitchId, since })
        .groupBy('date')
        .orderBy('date')
        .execute()
      : await Follow
        .createQueryBuilder()
        .select(`date_trunc(\'${measureOfTime}\', Follow.followedAt) date, COUNT(Follow.id)`)
        .where(`Follow.toId = :twitchId`, { twitchId })
        .groupBy('date')
        .orderBy('date')
        .execute();
    return result;
  }

  public static async getFollowCountsByDayOfTheWeek(twitchId: string): Promise<any> {
    const result = await Follow
      .createQueryBuilder()
      .select('COUNT(extract(dow from Follow.followedAt) = 0 or null) as Su')
      .addSelect('COUNT(extract(dow from Follow.followedAt) = 1 or null) as M')
      .addSelect('COUNT(extract(dow from Follow.followedAt) = 2 or null) as Tu')
      .addSelect('COUNT(extract(dow from Follow.followedAt) = 3 or null) as W')
      .addSelect('COUNT(extract(dow from Follow.followedAt) = 4 or null) as Th')
      .addSelect('COUNT(extract(dow from Follow.followedAt) = 5 or null) as F')
      .addSelect('COUNT(extract(dow from Follow.followedAt) = 6 or null) as Sa')
      .where('Follow.toId = :twitchId', { twitchId })
      .execute();
    return result[0];
  }

  public static async getFollowCountsByHourOfTheDay(twitchId: string): Promise<any> {
    const result = await Follow
      .createQueryBuilder()
      .select(`extract(hour from Follow.followedAt) as hourOfTheDay, Count(Follow.id)`)
      .where('Follow.toId = :twitchId', { twitchId })
      .groupBy('hourOfTheDay')
      .execute();
    return result;
  }

  public static async getFollowCountsByGame(twitchId: string): Promise<any> {
    const result = await Follow
      .createQueryBuilder()
      .select(`Follow.game, Count(Follow.id)`)
      .where('Follow.toId = :twitchId', { twitchId })
      .groupBy('Follow.game')
      .execute();
    return result;
  }

  public static async getMostRecentFollows(twitchId: string): Promise<any> {
    return await Follow.find({
      where: { twitchId },
      order: { followedAt: 'DESC' },
      take: 15
    });
  }
}
