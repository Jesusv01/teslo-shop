import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  nombre_usuario: string;

  // @Column('text')
  // fullName: string;
  // @Column('int', {
  //   default: 1,
  // })
  // active: number;

  @Column('bool', {
    default: true,
  })
  active: boolean;

  // @Column('text', {
  //   array: true,
  //   default: ['user'],
  // })
  // roles: string[];

  @Column('text')
  token_valid_after: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // @DeleteDateColumn({ name: 'deleted_at' })
  // deleted_at: Date;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
