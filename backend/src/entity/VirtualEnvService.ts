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
    JoinColumn
} from 'typeorm';

@Entity()
export class VirtualEnvService extends BaseEntity{
    @PrimaryGeneratedColumn({
        type: "bigint"
    })
    @Index({ unique: true })
    id: string;

    @Column({
        nullable:true
    })
    virtual_env_id:string;

    @Column({
        nullable:true
    })
    service_name:string;

    @Column({
        nullable:true,
        type:"text"
    })
    service_header:string

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: number;

}