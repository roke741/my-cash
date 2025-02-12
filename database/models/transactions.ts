import { useSQLiteContext } from 'expo-sqlite';
import { Transaction } from './types';  

export function saveTransaction(transaction: Transaction) {
  const db = useSQLiteContext();    
  return db.runAsync(
    `INSERT INTO transactions (account_id, category_id, amount, description, transaction_type_id, transaction_date) VALUES (?, ?, ?, ?, ?, ?)`,
    [transaction.account_id, transaction.category_id, transaction.amount, transaction.description, transaction.transaction_type_id, transaction.transaction_date]
  );
} 

export function getTransactions() {
  const db = useSQLiteContext();    
  return db.getAllAsync<Transaction>(`SELECT * FROM transactions`);
}

export function getTransaction(id: number) {
  const db = useSQLiteContext();    
  return db.getAllSync<Transaction>(`SELECT * FROM transactions WHERE id = ?`, [id]);
}
  