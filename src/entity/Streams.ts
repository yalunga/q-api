import { Entity, PrimaryColumn, BaseEntity, Column, MoreThanOrEqual } from 'typeorm';

@Entity()
export class Stream extends BaseEntity {

  @PrimaryColumn()
  public streamId: string;

  @Column()
  public twitchId: string;

  @Column({ type: 'timestamp' })
  public startedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  public endedAt: Date;

  @Column()
  public viewsAtBeginning: number;

  @Column({ nullable: true })
  public viewsAtEnd: number;

  @Column({ nullable: true })
  public title: string;

  public static async getAllStreams(twitchId: string): Promise<Stream[]> {
    return Stream.find({ where: { twitchId } });
  }

  public static async getStreamsSinceDate(twitchId: string, date: Date): Promise<Stream[]> {
    return Stream.find({ where: { twitchId, startedAt: MoreThanOrEqual(date) } });
  }
}
