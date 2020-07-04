import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Stream } from './Streams';

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public twitchId: string;

  @ManyToOne(_ => Stream)
  @JoinColumn()
  public streamId: string;

  @Column()
  public game: string;

  @Column()
  public title: string;

  @Column({ type: 'timestamp' })
  public startedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  public endedAt: Date;

  @Column({ nullable: true })
  public image: string;

}
