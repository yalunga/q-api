import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  twitchId: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  age: number;

}
