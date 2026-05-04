import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../config-db';
import { ExpenseCategory } from '../types';

const db = SQLite.openDatabaseSync(DATABASE_NAME);

export const categoriesDB = {
  async all(): Promise<ExpenseCategory[]> {
    return db.getAllAsync<ExpenseCategory>(
      'SELECT * FROM expenses_categories ORDER BY is_custom ASC, name ASC'
    );
  },

  async create(name: string): Promise<void> {
    await db.runAsync(
      'INSERT INTO expenses_categories (name, is_custom) VALUES (?, 1)',
      [name]
    );
  },

  async delete(id: number): Promise<void> {
    await db.runAsync(
      'DELETE FROM expenses_categories WHERE id = ? AND is_custom = 1',
      [id]
    );
  },
};
