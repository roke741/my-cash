import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../config-db';
import { BankAccount, CreateBankAccount } from '../types';

const db = SQLite.openDatabaseSync(DATABASE_NAME);

// Calculates real-time balance: initial_balance + incomes - expenses
const BALANCE_EXPR = `
  ba.initial_balance
  + COALESCE((
      SELECT SUM(t.amount) FROM transactions t
      WHERE t.bank_account_id = ba.id AND t.transaction_type_id = 1 AND t.deleted_at IS NULL
    ), 0)
  - COALESCE((
      SELECT SUM(t.amount) FROM transactions t
      WHERE t.bank_account_id = ba.id AND t.transaction_type_id = 2 AND t.deleted_at IS NULL
    ), 0)
`;

export const bankAccountsDB = {
  async all(): Promise<BankAccount[]> {
    return db.getAllAsync<BankAccount>(`
      SELECT ba.*, b.name AS bank_name, b.abbreviation AS bank_abbreviation,
             (${BALANCE_EXPR}) AS balance
      FROM bank_accounts ba
      LEFT JOIN banks b ON ba.bank_id = b.id
      ORDER BY ba.name ASC
    `);
  },

  async find(id: number): Promise<BankAccount | undefined> {
    const result = await db.getFirstAsync<BankAccount>(`
      SELECT ba.*, b.name AS bank_name, b.abbreviation AS bank_abbreviation,
             (${BALANCE_EXPR}) AS balance
      FROM bank_accounts ba
      LEFT JOIN banks b ON ba.bank_id = b.id
      WHERE ba.id = ?
    `, [id]);
    return result ?? undefined;
  },

  async create(data: CreateBankAccount): Promise<void> {
    await db.runAsync(
      `INSERT INTO bank_accounts (bank_id, name, account_number, currency, initial_balance)
       VALUES (?, ?, ?, ?, ?)`,
      [data.bank_id, data.name, data.account_number, data.currency, data.initial_balance]
    );
  },

  async update(id: number, data: Partial<CreateBankAccount>): Promise<void> {
    const fields: string[] = [];
    const values: (string | number)[] = [];
    if (data.name !== undefined)            { fields.push('name = ?');            values.push(data.name); }
    if (data.account_number !== undefined)  { fields.push('account_number = ?');  values.push(data.account_number); }
    if (data.currency !== undefined)        { fields.push('currency = ?');         values.push(data.currency); }
    if (data.initial_balance !== undefined) { fields.push('initial_balance = ?'); values.push(data.initial_balance); }
    if (fields.length === 0) return;
    fields.push("updated_at = datetime('now')");
    values.push(id);
    await db.runAsync(`UPDATE bank_accounts SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  async delete(id: number): Promise<void> {
    await db.runAsync('DELETE FROM bank_accounts WHERE id = ?', [id]);
  },

  async totalByCurrency(): Promise<{ currency: string; total: number }[]> {
    return db.getAllAsync<{ currency: string; total: number }>(`
      SELECT ba.currency, SUM(${BALANCE_EXPR}) AS total
      FROM bank_accounts ba
      GROUP BY ba.currency
    `);
  },
};
