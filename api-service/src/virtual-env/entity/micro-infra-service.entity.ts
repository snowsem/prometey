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

@Entity()
export class MicroInfraService extends BaseEntity{
    // @PrimaryGeneratedColumn({
    //     type: "bigint"
    // })
    // @Index({ unique: true })
    //
    // id: string;

    @PrimaryColumn({
        type: "varchar",
    })
    @Index({ unique: true })
    name:string;

    @Column({
        nullable:true
    })
    repository:string;

    @Column({
        nullable:true
    })
    default_tag:string;

    @Column({
        nullable:true,
        type:"text"
    })
    description:string

    @UpdateDateColumn({ type: "timestamp" })
    created_at: string;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: number;

}