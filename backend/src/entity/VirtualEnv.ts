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
    JoinColumn, OneToMany
} from 'typeorm';
import {VirtualEnvService} from "./VirtualEnvService";
import {JoinTable} from "typeorm/browser";

export enum VirtualEnvStatus {
    PENDING = "pending",
    WAIT_PR = "wait_pr",
    READY = "ready"
}

@Entity()
export class VirtualEnv extends BaseEntity{
    @PrimaryGeneratedColumn({
        type: "bigint"
    })
    @Index({ unique: true })
    id: string;

    @Column({
        nullable:true
    })
    title:string;

    @Column({
        nullable:true
    })
    owner:string;

    @Column({
        nullable:true,
        type:"text"
    })
    description:string

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: number;

    @OneToMany(() => VirtualEnvService, ves => ves.virtualEnv, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    virtualEnvServices: VirtualEnvService[];

    @Column({
        type: "enum",
        enum: VirtualEnvStatus,
        default: VirtualEnvStatus.PENDING
    })
    status: VirtualEnvStatus;
}

