import * as SQLite from 'expo-sqlite';
import { BankType } from '../types';
import { DATABASE_NAME } from '../config-db';

const db = SQLite.openDatabaseSync(DATABASE_NAME);

export const banksDB = {
  async all(): Promise<BankType[]> {
    return db.getAllAsync<BankType>('SELECT * FROM banks');
  },
  async find(id: number): Promise<BankType | undefined> {
    const result = await db.getFirstAsync<BankType>('SELECT * FROM banks WHERE id = ?', [id]);
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

