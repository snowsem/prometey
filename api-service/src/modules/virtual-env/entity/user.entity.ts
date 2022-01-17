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

import {JoinTable} from "typeorm/browser";
import {VirtualEnv} from "./virtual-env.entity";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn({
        type: "bigint"
    })
    @Index({ unique: true })
    id: string;

    @Column({
        nullable:true
    })
    first_name:string;

    @Column({
        nullable:true
    })
    last_name:string;

    @Column({
        nullable:true
    })
    avatar:string;

    @Column({
        nullable:true
    })
    login:string;

    @Column({
        nullable:true
    })
    email:string;

    @Column({
        nullable:true,
        select: false,
    })
    password:string;

    @Column({
        nullable:true,
        select: false,
        type: "text"
    })
    token_google:string;

    @Column({
        nullable:true,
        type: "text",
        select: false
    })
    token:string;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: number;

    @OneToMany(() => VirtualEnv,'')
    virtualEnvs: VirtualEnv[];
}