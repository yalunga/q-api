import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Stream } from './Streams';

@Entity()
export class Game extends BaseEntity {

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

    @Column({ type: 'timestamp' })
    startedAt: Date;

    @Column({ nullable: true, type: 'timestamp' })
    endedAt: Date;

}
