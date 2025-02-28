import * as SQLite from 'expo-sqlite';
import { BankAccount, CreateBankAccount } from '../types';
import { DATABASE_NAME } from '../config-db';

const db = SQLite.openDatabaseSync(DATABASE_NAME);

export const bankAccountsDB = {
  async all(): Promise<BankAccount[]> {
    return db.getAllAsync<BankAccount>('SELECT * FROM bank_accounts');
  },
  async find(id: number): Promise<BankAccount | undefined> {
    const result = await db.getFirstAsync<BankAccount>('SELECT * FROM bank_accounts WHERE id = ?', [id]);
    return result || undefined;
  },
  async create({ name, bank_id, account_number, balance }: CreateBankAccount): Promise<void> {
    await db.runAsync('INSERT INTO bank_accounts (name, bank_id, account_number, balance) VALUES (?, ?, ?, ?)', [name, bank_id, account_number, balance]);
  },
  async update({ id, name, bank_id, account_number, balance }: BankAccount): Promise<void> {
    await db.runAsync('UPDATE bank_accounts SET name = ?, bank_id = ?, account_number = ?, balance = ? WHERE id = ?', [name, bank_id, account_number, balance, id]);
  },
  async delete(id: number): Promise<void> {
    await db.runAsync('DELETE FROM bank_accounts WHERE id = ?', [id]);
  }
}