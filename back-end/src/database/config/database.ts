import 'dotenv/config';
import { Options } from 'sequelize';

// const config: Options = {
//   username: process.env.DB_USER || 'root',
//   password: process.env.DB_PASS || '123456',
//   database: 'skambooks_db',
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process.env.DB_PORT) || 3306,
//   dialect: 'mysql',
// }

const config: Options = {
  storage: './database.sqlite',
  dialect: 'sqlite',
}

export = config;
