export interface ExpenseCategory {
  id: number;
  name: string;
}

export type BankType = { 
  id: number;
  name: string;
  abbreviation: string;
}

export type BankAccount = {
  id: number;
  bank_id: number;
  name: string;
  account_number: string;
  balance: number;
}

export type CreateBankAccount = Omit<BankAccount, 'id'>;

export interface TransactionType {
  id: number;
  name: string;
}

export interface Transaction {
  id: number;
  account_id: number;
  category_id: number;
  amount: number;
  description: string;
  transaction_type_id: number;
  transaction_date: string;
}

export interface Frequency {
  id: number;
  name: string;
}

export interface Subscription {
  id: number;
  active: number;
  name: string;
  account_id: number;
  category_id: number;
  amount: number;
  description: string;
  start_date: string;
  end_date: string;
  frequency_id: number;
  next_payment_date: string;
}