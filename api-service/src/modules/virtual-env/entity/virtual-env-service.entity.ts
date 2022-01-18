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
  Unique,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { VirtualEnv } from './virtual-env.entity';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
@Unique('uniq_pair', ['service_name', 'virtual_env_id'])
export class VirtualEnvService extends BaseEntity {
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
  service_name: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  @ApiProperty()
  service_header: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  @ApiProperty()
  service_header_value: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  @ApiProperty()
  service_github_tag: string;

  @CreateDateColumn()
  @ApiProperty()
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  updated_at: number;

  @Column({
    nullable: true,
    type: 'number',
  })
  @ApiProperty()
  virtual_env_id: number;

  @Column({
    default: true,
    type: 'bool',
  })
  @ApiProperty()
  is_enable: number;

  @ManyToOne(() => VirtualEnv, (virtualEnv) => virtualEnv.virtualEnvServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'virtual_env_id' })
  @ApiProperty()
  virtualEnv: VirtualEnv;
}
