import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
  Generated,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { JoinTable } from 'typeorm/browser';
import { VirtualEnv } from '../../virtual-env/entity/virtual-env.entity';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Index({ unique: true })
  @ApiProperty()
  id: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  first_name: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  last_name: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  avatar: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  login: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  email: string;

  @Column({
    nullable: true,
    select: false,
  })
  password: string;

  @Column({
    nullable: true,
    select: false,
    type: 'text',
  })
  token_google: string;

  @Column({
    nullable: true,
    type: 'text',
    select: false,
  })
  token: string;

  @CreateDateColumn()
  @ApiProperty()
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  updated_at: number;

  @OneToMany(() => VirtualEnv, '')
  @ApiProperty()
  virtualEnvs: VirtualEnv[];
}
