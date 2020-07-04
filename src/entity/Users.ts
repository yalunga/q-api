import { Entity, PrimaryColumn, Column, BaseEntity, CreateDateColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  public twitchId: string;

  @Column({ nullable: true })
  public accessToken: string;

  @Column({ nullable: true })
  public refreshToken: string;

  @Column()
  public twitchName: string;

  @Column({ nullable: true })
  public twitchProfileImage: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public broadcasterType: string;

  @CreateDateColumn()
  public createdAt: Date;

  public static async getUserById(id: string): Promise<User | undefined> {
    return await User.findOne({ where: { id } });
  }
  public static async getUserByTwitchId(id: string): Promise<User | undefined> {
    return await User.findOne({ where: { twitchId: id } });
  }

  public static async getUserByAccessToken(accessToken: string): Promise<User | undefined> {
    return await User.findOne({ where: { accessToken } });
  }

  public static async getUsersByName(name: string): Promise<User[] | undefined> {
    try {
      return await User
        .createQueryBuilder()
        .where('LOWER(User.twitchName) LIKE LOWER(:name)', { name: `${name}%` })
        .limit(5)
        .getMany();
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
