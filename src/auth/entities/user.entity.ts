import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { UserImage } from './user-image.entity';
import { Message } from 'src/chat/entities/message.entity';
import { Room } from 'src/chat/entities/room.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column('varchar', {
    length: 255,
    select: false,
  })
  password: string;

  @Column('varchar', {
    length: 255,
  })
  nombre_usuario: string;

  @Column('bool', {
    default: true,
  })
  active: boolean;

  @Column('timestamp', {
    nullable: true,
  })
  last_login: Date;

  @Column('text', {
    nullable: true,
  })
  token_valid_after: string;

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

  //images
  @OneToMany(() => UserImage, (userImage) => userImage.user, {
    cascade: true,
    eager: true,
  })
  images?: UserImage[];

  @OneToMany(() => Message, (message) => message.userSend, {
    cascade: true,
    eager: true,
  })
  messages: Message[];

  @ManyToMany(
    () => Room,
    (room) => room.users, //optional
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION', eager: true },
  )
  rooms?: Room[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
