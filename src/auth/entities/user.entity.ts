import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column('timestamp')
  last_login: Date;

  @Column('text')
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

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
