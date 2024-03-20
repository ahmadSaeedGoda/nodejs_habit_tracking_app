import "reflect-metadata"
import { DataSource } from "typeorm"
import { Habit } from "./entity/habit"
import { requiredEnvVars } from "./config/app-config"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: requiredEnvVars.pgHost,
    port: Number(requiredEnvVars.pgPort),
    username: requiredEnvVars.pgUser,
    password: requiredEnvVars.pgPass,
    database: requiredEnvVars.pgDB,
    entities: [Habit],
    synchronize: true,
    logging: false,
})

AppDataSource.initialize()
    .then(() => {
		  console.log('Habits DB Initialized!!!')
    })
    .catch((error: any) => console.error("Habits TypeORM connection error: ", error))
