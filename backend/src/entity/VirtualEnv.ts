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

    @OneToMany(() => VirtualEnvService, ves => ves.virtualEnv)
    virtualEnvServices: VirtualEnvService[];

}