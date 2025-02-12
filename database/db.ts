import { type SQLiteDatabase } from 'expo-sqlite';
import * as configDB from './config-db';

export const initializeDB = async (db: SQLiteDatabase) => {
  console.log('Initializing database');
  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number | undefined}>(
    'PRAGMA user_version'
  );

  console.log('Current version:', currentDbVersion);
  console.log('Expected version:', configDB.DATABASE_VERSION);

  if (currentDbVersion >= configDB.DATABASE_VERSION) {
    console.log('Database is up to date');
    return;
  }

  if (currentDbVersion === 3) {
    console.log('Creating database tables');
    await db.withTransactionAsync(async () => {
      const execStatements = [
        configDB.DROP_TABLES,
        configDB.CREATE_TABLE_EXPENSES_CATEGORIES,
        configDB.CREATE_TABLE_BANKS,
        configDB.CREATE_TABLE_BANK_ACCOUNTS,
        configDB.CREATE_TABLE_TRANSACTION_TYPES,
        configDB.CREATE_TABLE_TRANSACTIONS,
        configDB.CREATE_TABLE_FREQUENCIES,
        configDB.CREATE_TABLE_SUSCRIPTIONS,
        configDB.INSERT_CATEGORIES,
        configDB.INSERT_BANKS,
        configDB.INSERT_TRANSACTION_TYPES,
        configDB.INSERT_FREQUENCIES
      ];
  
      console.log('Executing statements');
      for (const statement of execStatements) {
        console.log('Executing:', statement);
        await db.execAsync(statement);
      }
    });
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    currentDbVersion = 1;
    await db.execAsync(`PRAGMA user_version = ${configDB.DATABASE_VERSION}`);
  }
}
