import 'dotenv/config';
import { DataSource } from 'typeorm';
import { DatabaseOptions } from './database-options';

export const AppDataSource = new DataSource(DatabaseOptions);