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
  ManyToOne,
} from 'typeorm';

import { JoinTable } from 'typeorm/browser';
import { VirtualEnvService } from './virtual-env-service.entity';
import { User } from './user.entity';

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
  id: string;

  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  owner: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  description: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: number;

  @OneToMany(() => VirtualEnvService, (ves) => ves.virtualEnv, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  virtualEnvServices: VirtualEnvService[];

  @Column({
    type: 'enum',
    enum: VirtualEnvStatus,
    default: VirtualEnvStatus.PENDING,
  })
  status: VirtualEnvStatus;

  @ManyToOne(() => User, (user) => user.virtualEnvs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    nullable: true,
    type: 'number',
  })
  user_id: number;
}
