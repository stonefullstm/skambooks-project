"use strict";
require("dotenv/config");
// const config: Options = {
//   username: process.env.DB_USER || 'root',
//   password: process.env.DB_PASS || '123456',
//   database: 'skambooks_db',
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process.env.DB_PORT) || 3306,
//   dialect: 'mysql',
// }
const config = {
    storage: './database.sqlite',
    dialect: 'sqlite',
};
module.exports = config;
