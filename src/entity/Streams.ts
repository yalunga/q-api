import { Entity, PrimaryColumn, BaseEntity, Column, MoreThanOrEqual } from 'typeorm';

@Entity()
export class Stream extends BaseEntity {

  @PrimaryColumn()
  streamId: string;


  @Column()
  twitchId: string;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  endedAt: Date;

  @Column()
  viewsAtBeginning: number;

  @Column({ nullable: true })
  viewsAtEnd: number;

  @Column({ nullable: true })
  totalViews: number;

  public static async getAllStreams(twitchId: string): Promise<Stream[]> {
    return Stream.find({ where: { twitchId } });
  }

  public static async getStreamsSinceDate(twitchId: string, date: Date): Promise<Stream[]> {
    return Stream.find({ where: { twitchId, startedAt: MoreThanOrEqual(date) } });
  }
}
