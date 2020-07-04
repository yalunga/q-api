import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, MoreThanOrEqual } from 'typeorm';
import * as R from 'rambda';

@Entity()
export class ViewCount extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public twitchId: string;

  @Column()
  public streamId: string;

  @Column()
  public game: string;

  @Column()
  public title: string;

  @Column()
  public count: number;

  @Column({ type: 'timestamp' })
  public timestamp: Date;

  public static async getAverageViewCount(twitchId: string, since?: Date): Promise<number> {
    const query = R.merge({ twitchId }, since ? { timestamp: MoreThanOrEqual(since) } : {});
    const viewCounts = await ViewCount.find({ where: query });
    if (viewCounts.length === 0) {
      return 0;
    }
    const views = R.pluck('count')(viewCounts);
    // @ts-ignore
    return R.mean(views);
  }

  public static async getViewCounts(twitchId: string, since?: Date): Promise<ViewCount[]> {
    const query = R.merge({ twitchId }, since ? { timestamp: MoreThanOrEqual(since) } : {});
    return await ViewCount.find({ where: query });
  }

  public static async getViewCountsByMeasureOfTime(twitchId: string, measureOfTime: string, since?: Date): Promise<any> {
    try {
      const result = since
        ? await ViewCount
          .createQueryBuilder()
          .select(`date_trunc(\'${measureOfTime}\', ViewCount.timestamp) date, AVG(count)`)
          .where(`ViewCount.twitchId = :twitchId AND ViewCount.timestamp >= :since`, { twitchId, since })
          .groupBy('date')
          .orderBy('date')
          .execute()
        : await ViewCount
          .createQueryBuilder()
          .select(`date_trunc(\'${measureOfTime}\', ViewCount.timestamp) date, AVG(count)`)
          .where(`ViewCount.twitchId = :twitchId`, { twitchId })
          .groupBy('date')
          .orderBy('date')
          .execute();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  public static async getViewCountsByDayOfTheWeek(twitchId: string): Promise<any> {
    try {
      const { su } = await ViewCount
        .createQueryBuilder()
        .select('AVG(ViewCount.count) as Su')
        .where('ViewCount.twitchId = :twitchId AND extract(dow from ViewCount.timestamp) = 0 or null', { twitchId })
        .getRawOne();
      const { m } = await ViewCount
        .createQueryBuilder()
        .select('AVG(ViewCount.count) as M')
        .where('ViewCount.twitchId = :twitchId AND extract(dow from ViewCount.timestamp) = 1 or null', { twitchId })
        .getRawOne();
      const { tu } = await ViewCount
        .createQueryBuilder()
        .select('AVG(ViewCount.count) as Tu')
        .where('ViewCount.twitchId = :twitchId AND extract(dow from ViewCount.timestamp) = 2 or null', { twitchId })
        .getRawOne();
      const { w } = await ViewCount
        .createQueryBuilder()
        .select('AVG(ViewCount.count) as W')
        .where('ViewCount.twitchId = :twitchId AND extract(dow from ViewCount.timestamp) = 3 or null', { twitchId })
        .getRawOne();
      const { th } = await ViewCount
        .createQueryBuilder()
        .select('AVG(ViewCount.count) as Th')
        .where('ViewCount.twitchId = :twitchId AND extract(dow from ViewCount.timestamp) = 4 or null', { twitchId })
        .getRawOne();
      const { f } = await ViewCount
        .createQueryBuilder()
        .select('AVG(ViewCount.count) as F')
        .where('ViewCount.twitchId = :twitchId AND extract(dow from ViewCount.timestamp) = 5 or null', { twitchId })
        .getRawOne();
      const { sa } = await ViewCount
        .createQueryBuilder()
        .select('AVG(ViewCount.count) as Sa')
        .where('ViewCount.twitchId = :twitchId AND extract(dow from ViewCount.timestamp) = 6 or null', { twitchId })
        .getRawOne();
      const result = [
        { day: 'su', count: su },
        { day: 'm', count: m },
        { day: 'tu', count: tu },
        { day: 'w', count: w },
        { day: 'th', count: th },
        { day: 'f', count: f },
        { day: 'sa', count: sa }
      ];
      return result;
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  }

  public static async getViewCountsByHourOfTheDay(twitchId: string): Promise<any> {
    const result = await ViewCount
      .createQueryBuilder()
      .select(`extract(hour from ViewCount.timestamp) as hourOfTheDay, AVG(ViewCount.count) as count`)
      .where('ViewCount.twitchId = :twitchId', { twitchId })
      .from(ViewCount, 'viewcount')
      .groupBy('hourOfTheDay')
      .getRawMany();
    return result;
  }

  public static async getViewCountsByGame(twitchId: string): Promise<any> {
    const result = await ViewCount
      .createQueryBuilder()
      .select(`ViewCount.game, AVG(ViewCount.count) as count`)
      .where('ViewCount.twitchId = :twitchId', { twitchId })
      .groupBy('ViewCount.game')
      .getRawMany();
    return result;
  }
}
