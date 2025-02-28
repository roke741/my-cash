import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../config-db';
import { Transaction } from '../types';  

const db = SQLite.openDatabaseSync(DATABASE_NAME);

export const transactionDB = {
  async all(): Promise<Transaction[]> {
    return db.getAllAsync<Transaction>('SELECT * FROM transactions');
  },

  async find(id: number): Promise<Transaction | undefined> {
    const result = await db.getFirstAsync<Transaction>('SELECT * FROM transactions WHERE id = ?', [id]);
    return result || undefined;
  },

  async create(transaction: Transaction): Promise<void> {
    await db.runAsync(
      `INSERT INTO transactions (account_id, category_id, amount, description, transaction_type_id, transaction_date) VALUES (?, ?, ?, ?, ?, ?)`,
      [transaction.account_id, transaction.category_id, transaction.amount, transaction.description, transaction.transaction_type_id, transaction.transaction_date]
    );
  },

  async update(transaction: Transaction): Promise<void> {
    await db.runAsync(
      `UPDATE transactions SET account_id = ?, category_id = ?, amount = ?, description = ?, transaction_type_id = ?, transaction_date = ? WHERE id = ?`,
      [transaction.account_id, transaction.category_id, transaction.amount, transaction.description, transaction.transaction_type_id, transaction.transaction_date, transaction.id]
    );
  },

  async delete(id: number): Promise<void> {
    await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
  }
}

  