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
        nullable:true
    })
    password:string;

    @Column({
        nullable:true,
        type: "text"
    })
    token_google:string;

    @Column({
        nullable:true,
        type: "text"
    })
    token:string;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: number;
}