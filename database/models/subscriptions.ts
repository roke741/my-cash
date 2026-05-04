import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../config-db';
import { CreateSubscription, Subscription } from '../types';

const db = SQLite.openDatabaseSync(DATABASE_NAME);

const SELECT_FULL = `
  SELECT
    s.*,
    f.name  AS frequency_name,
    ec.name AS category_name,
    ba.name AS bank_account_name,
    ba.currency
  FROM subscriptions s
  LEFT JOIN frequencies          f  ON f.id  = s.frequency_id
  LEFT JOIN expenses_categories  ec ON ec.id = s.category_id
  LEFT JOIN bank_accounts        ba ON ba.id = s.bank_account_id
`;

export function nextPaymentDate(from: string, frequencyId: number): string {
  const d = new Date(`${from}T12:00:00`);
  switch (frequencyId) {
    case 1: d.setDate(d.getDate() + 1);        break; // Diario
    case 2: d.setDate(d.getDate() + 7);        break; // Semanal
    case 3: d.setDate(d.getDate() + 14);       break; // Quincenal
    case 4: d.setMonth(d.getMonth() + 1);      break; // Mensual
    case 5: d.setMonth(d.getMonth() + 3);      break; // Trimestral
    case 6: d.setFullYear(d.getFullYear() + 1);break; // Anual
  }
  return d.toISOString().split('T')[0];
}

export const subscriptionsDB = {
  async all(): Promise<Subscription[]> {
    return db.getAllAsync<Subscription>(
      `${SELECT_FULL} WHERE s.active = 1 ORDER BY s.next_payment_date ASC, s.name ASC`
    );
  },

  async due(today: string): Promise<Subscription[]> {
    return db.getAllAsync<Subscription>(
      `${SELECT_FULL} WHERE s.active = 1 AND s.next_payment_date <= ? ORDER BY s.next_payment_date ASC`,
      [today]
    );
  },

  async create(data: CreateSubscription): Promise<void> {
    await db.runAsync(
      `INSERT INTO subscriptions
         (name, transaction_type_id, bank_account_id, category_id, amount, description,
          start_date, end_date, frequency_id, next_payment_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.transaction_type_id,
        data.bank_account_id,
        data.category_id ?? null,
        data.amount,
        data.description,
        data.start_date,
        data.end_date ?? null,
        data.frequency_id,
        data.start_date, // first payment = start date
      ]
    );
  },

  // Register the payment as a transaction and advance next_payment_date
  async applyPayment(sub: Subscription, paymentDate: string): Promise<void> {
    const next = nextPaymentDate(paymentDate, sub.frequency_id);
    const isExpired = sub.end_date && next > sub.end_date;

    await db.withTransactionAsync(async () => {
      // Create the transaction
      await db.runAsync(
        `INSERT INTO transactions
           (bank_account_id, category_id, amount, description, transaction_type_id, transaction_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          sub.bank_account_id,
          sub.category_id ?? null,
          sub.amount,
          sub.name + (sub.description ? ` · ${sub.description}` : ''),
          sub.transaction_type_id,
          paymentDate,
        ]
      );

      // Advance or deactivate
      if (isExpired) {
        await db.runAsync(
          `UPDATE subscriptions SET active = 0, updated_at = datetime('now') WHERE id = ?`,
          [sub.id]
        );
      } else {
        await db.runAsync(
          `UPDATE subscriptions SET next_payment_date = ?, updated_at = datetime('now') WHERE id = ?`,
          [next, sub.id]
        );
      }
    });
  },

  async deactivate(id: number): Promise<void> {
    await db.runAsync(
      `UPDATE subscriptions SET active = 0, updated_at = datetime('now') WHERE id = ?`,
      [id]
    );
  },
};
