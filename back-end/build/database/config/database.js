"use strict";
require("dotenv/config");
const config = {
    username: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '123456',
    database: process.env.MYSQLDATABASE || 'skambooks_db',
    host: process.env.MYSQLHOST || 'localhost',
    port: Number(process.env.MYSQLPORT) || 3002,
    dialect: 'mysql',
};
module.exports = config;
