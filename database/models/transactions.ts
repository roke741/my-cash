import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../config-db';
import { CreateTransaction, Transaction } from '../types';

const db = SQLite.openDatabaseSync(DATABASE_NAME);

const SELECT_FULL = `
  SELECT
    t.*,
    tt.name  AS transaction_type_name,
    ec.name  AS category_name,
    ba.name  AS bank_account_name,
    ba.currency
  FROM transactions t
  LEFT JOIN transaction_types  tt ON tt.id = t.transaction_type_id
  LEFT JOIN expenses_categories ec ON ec.id = t.category_id
  LEFT JOIN bank_accounts       ba ON ba.id = t.bank_account_id
  WHERE t.deleted_at IS NULL
`;

export const transactionsDB = {
  async all(limit?: number): Promise<Transaction[]> {
    const sql = `${SELECT_FULL} ORDER BY t.transaction_date DESC, t.created_at DESC${limit ? ` LIMIT ${limit}` : ''}`;
    return db.getAllAsync<Transaction>(sql);
  },

  async byAccount(accountId: number): Promise<Transaction[]> {
    return db.getAllAsync<Transaction>(
      `${SELECT_FULL} AND t.bank_account_id = ? ORDER BY t.transaction_date DESC, t.created_at DESC`,
      [accountId]
    );
  },

  async filter(params: {
    typeId?: number;
    categoryId?: number;
    accountId?: number;
    from?: string;
    to?: string;
  }): Promise<Transaction[]> {
    const conditions: string[] = ['t.deleted_at IS NULL'];
    const values: (string | number)[] = [];
    if (params.typeId)     { conditions.push('t.transaction_type_id = ?'); values.push(params.typeId); }
    if (params.categoryId) { conditions.push('t.category_id = ?');         values.push(params.categoryId); }
    if (params.accountId)  { conditions.push('t.bank_account_id = ?');     values.push(params.accountId); }
    if (params.from)       { conditions.push('t.transaction_date >= ?');    values.push(params.from); }
    if (params.to)         { conditions.push('t.transaction_date <= ?');    values.push(params.to); }

    const sql = `
      SELECT t.*,
        tt.name AS transaction_type_name,
        ec.name AS category_name,
        ba.name AS bank_account_name,
        ba.currency
      FROM transactions t
      LEFT JOIN transaction_types   tt ON tt.id = t.transaction_type_id
      LEFT JOIN expenses_categories ec ON ec.id = t.category_id
      LEFT JOIN bank_accounts       ba ON ba.id = t.bank_account_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY t.transaction_date DESC, t.created_at DESC
    `;
    return db.getAllAsync<Transaction>(sql, values);
  },

  async find(id: number): Promise<Transaction | undefined> {
    const result = await db.getFirstAsync<Transaction>(
      `${SELECT_FULL} AND t.id = ?`, [id]
    );
    return result ?? undefined;
  },

  async create(data: CreateTransaction): Promise<void> {
    await db.runAsync(
      `INSERT INTO transactions (bank_account_id, category_id, amount, description, transaction_type_id, transaction_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.bank_account_id, data.category_id, data.amount, data.description, data.transaction_type_id, data.transaction_date]
    );
  },

  async update(id: number, data: Partial<CreateTransaction>): Promise<void> {
    const fields: string[] = [];
    const values: (string | number)[] = [];
    if (data.bank_account_id !== undefined)   { fields.push('bank_account_id = ?');   values.push(data.bank_account_id); }
    if (data.category_id !== undefined)       { fields.push('category_id = ?');       values.push(data.category_id); }
    if (data.amount !== undefined)            { fields.push('amount = ?');             values.push(data.amount); }
    if (data.description !== undefined)       { fields.push('description = ?');        values.push(data.description); }
    if (data.transaction_type_id !== undefined){ fields.push('transaction_type_id = ?'); values.push(data.transaction_type_id); }
    if (data.transaction_date !== undefined)  { fields.push('transaction_date = ?');  values.push(data.transaction_date); }
    if (fields.length === 0) return;
    fields.push("updated_at = datetime('now')");
    values.push(id);
    await db.runAsync(`UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  // Soft delete — preserves sync history
  async delete(id: number): Promise<void> {
    await db.runAsync(
      "UPDATE transactions SET deleted_at = datetime('now') WHERE id = ?", [id]
    );
  },
};
