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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class MicroInfraService extends BaseEntity {
  // @PrimaryGeneratedColumn({
  //     type: "bigint"
  // })
  // @Index({ unique: true })
  //
  // id: string;

  @PrimaryColumn({
    type: 'varchar',
  })
  @Index({ unique: true })
  @ApiProperty()
  name: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  repository: string;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  default_tag: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  @ApiProperty()
  description: string;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  updated_at: number;
}
