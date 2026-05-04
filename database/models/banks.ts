import * as SQLite from 'expo-sqlite';
import { Bank } from '../types';
import { DATABASE_NAME } from '../config-db';

const db = SQLite.openDatabaseSync(DATABASE_NAME);

export const banksDB = {
  async all(): Promise<Bank[]> {
    return db.getAllAsync<Bank>('SELECT * FROM banks');
  },
  async find(id: number): Promise<Bank | undefined> {
    const result = await db.getFirstAsync<Bank>('SELECT * FROM banks WHERE id = ?', [id]);
    return result || undefined;
  },
  async create(name: string, abbreviation: string): Promise<void> {
    await db.runAsync('INSERT INTO banks (name, abbreviation) VALUES (?, ?)', [name, abbreviation]);
  },
  async update(id: number, name: string, abbreviation: string): Promise<void> {
    await db.runAsync('UPDATE banks SET name = ?, abbreviation = ? WHERE id = ?', [name, abbreviation, id]);
  },
  async delete(id: number): Promise<void> {
    await db.runAsync('DELETE FROM banks WHERE id = ?', [id]);
  }
}

