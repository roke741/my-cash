export interface ExpenseCategory {
  id: number;
  name: string;
}

export type Bank = { 
  id: number;
  name: string;
  abbreviation: string;
}

export type BankAccount = {
  id: number;
  bank_id: number;
  bank?: Bank;  
  name: string;
  account_number: string;
  balance: number;
}

export type CreateBankAccount = Omit<BankAccount, 'id'>;

export interface TransactionType {
  id: number;
  name: string;
}

export type Transaction = {
  id: number;
  bank_account_id: number;
  bank_account?: BankAccount;   
  category_id: number;
  amount: number;
  description: string;
  transaction_type_id: number;
  transaction_type?: TransactionType;
  transaction_date: string;
}

export type CreateTransaction = Omit<Transaction, 'id'>;  

export interface Frequency {
  id: number;
  name: string;
}

export interface Subscription {
  id: number;
  active: number;
  name: string;
  bank_account_id: number;
  bank_account?: BankAccount;
  category_id: number;
  category?: ExpenseCategory;
  amount: number;
  description: string;
  start_date: string;
  end_date: string;
  frequency_id: number;
  frequency?: Frequency;
  next_payment_date: string;
}