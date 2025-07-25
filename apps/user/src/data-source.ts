import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Client } from './app/core/user/infrastructure/entity';
import path from 'path';

console.log(path.resolve(__dirname, 'src', 'app', 'libs', 'migrations', '**', '*.{ts,js}'));


export const AppDataSource = new DataSource({
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
});