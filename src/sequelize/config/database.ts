// src/sequelize/config/database.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'localData',
  username: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432, // or your PostgreSQL port
});

export { sequelize };