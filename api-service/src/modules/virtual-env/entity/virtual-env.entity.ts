import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  Index,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { VirtualEnvService } from './virtual-env-service.entity';
import { User } from '../../auth/entity/user.entity';
import {ApiProperty} from "@nestjs/swagger";

export enum VirtualEnvStatus {
  PENDING = 'pending',
  WAIT_PR = 'wait_pr',
  READY = 'ready',
  WAIT_DELETE = 'wait_delete',
}

@Entity()
export class VirtualEnv extends BaseEntity {
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
  title: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  owner: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  @ApiProperty()
  description: string;

  @CreateDateColumn()
  @ApiProperty()
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  updated_at: number;

  @OneToMany(() => VirtualEnvService, (ves) => ves.virtualEnv, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @ApiProperty()
  virtualEnvServices: VirtualEnvService[];

  @Column({
    type: 'enum',
    enum: VirtualEnvStatus,
    default: VirtualEnvStatus.PENDING,
  })
  @ApiProperty()
  status: VirtualEnvStatus;

  @ManyToOne(() => User, (user) => user.virtualEnvs)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty()
  user: User;

  @Column({
    nullable: true,
    type: 'number',
  })
  @ApiProperty()
  user_id: number;
}
