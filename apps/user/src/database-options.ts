import { DataSourceOptions } from "typeorm";
import { ClientEntity } from './app/core/user/infrastructure/entity/Client/Client';
import path from "path";
import { User } from './app/core/user/infrastructure/entity/User';

export const DatabaseOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "arsenii",
    password: "test1234",
    database: "taxi_db",
    entities: [ClientEntity, User],
    migrations: [path.resolve(__dirname, 'app', 'libs', 'migrations', '**', '*.{ts,js}')],
    synchronize: false,
    logging: true,
}
