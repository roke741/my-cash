import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../config-db';
import { Frequency } from '../types';

const db = SQLite.openDatabaseSync(DATABASE_NAME);

export const frequenciesDB = {
  async all(): Promise<Frequency[]> {
    return db.getAllAsync<Frequency>('SELECT * FROM frequencies ORDER BY id ASC');
  },
};
