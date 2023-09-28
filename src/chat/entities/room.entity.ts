import {
  DeleteDateColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 255,
  })
  name: string;

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
  @OneToMany(() => Message, (message) => message.room, {
    cascade: true,
    eager: true,
  })
  messages: Message[];

  @ManyToMany(
    () => User,
    (user) => user.rooms, //optional
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinTable({
    name: 'room_user',
    joinColumn: {
      name: 'room_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users?: User[];
}
