import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../config-db';
import { Currency } from '../types';

const db = SQLite.openDatabaseSync(DATABASE_NAME);

export const currenciesDB = {
  async all(): Promise<Currency[]> {
    return db.getAllAsync<Currency>('SELECT * FROM currencies ORDER BY code ASC');
  },
};
