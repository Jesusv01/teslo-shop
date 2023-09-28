import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_image')
export class UserImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @Unique('user', ['id'])
  @ManyToOne(() => User, (user) => user.images, {
    onDelete: 'CASCADE',
  })
  user: User;
}
