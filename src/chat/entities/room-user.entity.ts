import { User } from 'src/auth/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('room_user')
export class RoomUser {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'room_id' })
  roomId: number;

  @ManyToOne(() => User, (user) => user.rooms, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  users: User[];

  @ManyToOne(() => Room, (room) => room.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'room_id', referencedColumnName: 'id' }])
  rooms: Room[];
}
