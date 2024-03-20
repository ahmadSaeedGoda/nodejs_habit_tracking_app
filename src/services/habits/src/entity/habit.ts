import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import * as bcrypt from "bcrypt";

@Entity()
export class Habit {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({
        length: 100
    })
    title?: string

    @Column({
        type: "text",
        nullable: true,
        default: ""
    })
    description!: string

    @Column()
    user_id!: number
}

