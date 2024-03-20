import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm"
import * as bcrypt from "bcrypt";

export interface AuthModel {
    username: string;
    password: string;
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({
        length: 100,
        nullable: true
    })
    name?: string

    @Column({ unique: true })
    email!: string

    @Column()
    password!: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}

export interface UserSafeResponseDTO {
    id: number;
    name?: string;
    email: string;
}
