import { type SQLiteDatabase } from 'expo-sqlite';
import { DATABASE_VERSION } from './config-db';
import * as s from './seeders/seeds-db';

export const initializeDB = async (db: SQLiteDatabase) => {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;

  if (current >= DATABASE_VERSION) return;

  await db.withTransactionAsync(async () => {
    for (const sql of [
      s.DROP_TABLES,
      s.CREATE_TABLE_CURRENCIES,
      s.CREATE_TABLE_EXPENSES_CATEGORIES,
      s.CREATE_TABLE_BANKS,
      s.CREATE_TABLE_BANK_ACCOUNTS,
      s.CREATE_TABLE_TRANSACTION_TYPES,
      s.CREATE_TABLE_TRANSACTIONS,
      s.CREATE_TABLE_FREQUENCIES,
      s.CREATE_TABLE_SUBSCRIPTIONS,
      s.INSERT_CURRENCIES,
      s.INSERT_CATEGORIES,
      s.INSERT_BANKS,
      s.INSERT_TRANSACTION_TYPES,
      s.INSERT_FREQUENCIES,
    ]) {
      await db.execAsync(sql);
    }
  });

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
