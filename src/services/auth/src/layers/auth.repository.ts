import { User } from '../entity/auth.model';
import { AppDataSource } from "../data-source"
import { DataSource, Repository } from 'typeorm';

// const userRepository = AppDataSource.getRepository(User)
// const allUsers = await userRepository.find()
// console.log("All users from the db: ", allUsers)

// const firstUser = await userRepository.findOneBy({
//     id: 1,
// })
// console.log("First user from the db: ", firstUser)

// const meAndBearsUser = await userRepository.findOneBy({
//     name: "Me and Bears",
// })
// console.log("Me and Bears user from the db: ", meAndBearsUser)

// const allViewedUsers = await userRepository.findBy({ views: 1 })
// console.log("All viewed users: ", allViewedUsers)

// const allPublishedUsers = await userRepository.findBy({ isPublished: true })
// console.log("All published users: ", allPublishedUsers)

// const [users, usersCount] = await userRepository.findAndCount()
// console.log("All users: ", users)
// console.log("Users count: ", usersCount)

export class AuthRepository {
    private db: DataSource;
    private userRepository: Repository<User>;

    constructor() {
        this.db = AppDataSource;
        this.userRepository = AppDataSource.getRepository(User)
    }


    saveUser = async (user: User): Promise<User> => {
        return await AppDataSource.manager.save(user);
    };

    getUserByEmail = async (email: string): Promise<User | null> => {
        return await this.userRepository.findOneBy({ email });
    };
}

export const authRepository = new AuthRepository();
