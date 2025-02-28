import { type SQLiteDatabase } from 'expo-sqlite';
import * as configDB from './config-db';
import * as seedDB from './seeders/seeds-db';

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
        seedDB.DROP_TABLES,
        seedDB.CREATE_TABLE_EXPENSES_CATEGORIES,
        seedDB.CREATE_TABLE_BANKS,
        seedDB.CREATE_TABLE_BANK_ACCOUNTS,
        seedDB.CREATE_TABLE_TRANSACTION_TYPES,
        seedDB.CREATE_TABLE_TRANSACTIONS,
        seedDB.CREATE_TABLE_FREQUENCIES,
        seedDB.CREATE_TABLE_SUSCRIPTIONS,
        seedDB.INSERT_CATEGORIES,
        seedDB.INSERT_BANKS,
        seedDB.INSERT_TRANSACTION_TYPES,
        seedDB.INSERT_FREQUENCIES
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
