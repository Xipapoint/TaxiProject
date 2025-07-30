import { DataSourceOptions } from "typeorm";
import { Client } from './app/core/user/infrastructure/entity/Client/Client';
import path from "path";

export const DatabaseOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "arsenii",
    password: "test1234",
    database: "taxi_db",
    entities: [Client],
    migrations: [path.resolve(__dirname, 'app', 'libs', 'migrations', '**', '*.{ts,js}')],
    synchronize: false,
    logging: true,
}
