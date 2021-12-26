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
    JoinColumn, ManyToOne
} from 'typeorm';
import {VirtualEnv} from "./VirtualEnv";

@Entity()
@Unique("uniq_pair", ["service_name", "virtual_env_id"])
export class VirtualEnvService extends BaseEntity{
    @PrimaryGeneratedColumn({
        type: "bigint"
    })
    @Index({ unique: true })
    id: string;

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

    @Column(
        {
            nullable:true,
            type:"number"
        }
    )
    virtual_env_id: number

    @ManyToOne(() => VirtualEnv, virtualEnv => virtualEnv.virtualEnvServices)
    @JoinColumn({name: 'virtual_env_id'})
    virtualEnv: VirtualEnv;

}