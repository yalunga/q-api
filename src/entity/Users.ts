import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, Unique } from 'typeorm';

@Entity()
@Unique(['twitchId'])
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  twitchId: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  twitchName: string;

  @Column()
  twitchProfileImage: string;

  @CreateDateColumn()
  createdAt: Date;

  public static async getUserById(id: string): Promise<User | undefined> {
    return await User.findOne({ where: { id } });
  }
  public static async getUserByTwitchId(id: string): Promise<User | undefined> {
    return await User.findOne({ where: { twitchId: id } });
  }

  public static async getUserByAccessToken(accessToken: string): Promise<User | undefined> {
    return await User.findOne({ where: { accessToken } });
  }
}
