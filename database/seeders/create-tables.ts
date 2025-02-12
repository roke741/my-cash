import { db } from '../db';

export const createTables = async () => {
  console.log('Creating tables');
    (await db).withTransactionAsync(async () => {
      (await db).execAsync(`
        DROP TABLE IF EXISTS categories;
        DROP TABLE IF EXISTS bank_accounts;
      `);
      (await db).execAsync(`
        CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
        CREATE TABLE IF NOT EXISTS bank_accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, abreviation TEXT);
      `);
      (await db).execAsync(`
        INSERT INTO bank_accounts (name, abreviation) VALUES ('Banco de Crédito del Perú', 'BCP');
        INSERT INTO bank_accounts (name, abreviation) VALUES ('Interbank', 'IBK');
      `);
  })
};

