import {
  DeleteDateColumn,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 255,
  })
  message: string;

  @Column('bool', {
    default: true,
  })
  active: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  //rooms
  @ManyToOne(() => Room, (room) => room.messages, {
    onDelete: 'CASCADE',
  })
  room: Room;

  @ManyToOne(() => User, (userSend) => userSend.messages, {
    onDelete: 'CASCADE',
  })
  userSend: User;
}
