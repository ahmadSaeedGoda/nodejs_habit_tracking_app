import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/auth.model"
import { requiredEnvVars } from "./config/app-config"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: requiredEnvVars.pgHost,
    port: Number(requiredEnvVars.pgPort),
    username: requiredEnvVars.pgUser,
    password: requiredEnvVars.pgPass,
    database: requiredEnvVars.pgDB,
    entities: [User],
    synchronize: true,
    logging: false,
})

AppDataSource.initialize()
    .then(() => {
		console.log('DB Initialized!!!')
    })
    .catch((error) => console.error("TypeORM connection error: ", error))
