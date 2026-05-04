export type Currency = {
  code: string;
  name: string;
  symbol: string;
};

export type ExpenseCategory = {
  id: number;
  name: string;
  is_custom: number;
};

export type Bank = {
  id: number;
  name: string;
  abbreviation: string;
};

export type BankAccount = {
  id: number;
  uuid: string;
  bank_id: number;
  bank?: Bank;
  name: string;
  account_number: string;
  currency: string;
  initial_balance: number;
  created_at: string;
  updated_at: string;
  // joined at query time
  bank_name?: string;
  bank_abbreviation?: string;
  // calculated at query time
  balance?: number;
};

export type CreateBankAccount = {
  bank_id: number;
  name: string;
  account_number: string;
  currency: string;
  initial_balance: number;
};

export type TransactionType = {
  id: number;
  name: string;
};

// transaction_type_id reference values
export const TRANSACTION_TYPE = {
  INCOME: 1,
  EXPENSE: 2,
} as const;

export type Transaction = {
  id: number;
  uuid: string;
  bank_account_id: number;
  bank_account?: BankAccount;
  category_id: number;
  category?: ExpenseCategory;
  amount: number;
  description: string;
  transaction_type_id: number;
  transaction_type?: TransactionType;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CreateTransaction = {
  bank_account_id: number;
  category_id: number;
  amount: number;
  description: string;
  transaction_type_id: number;
  transaction_date: string;
};

export const FREQUENCY = {
  DAILY:     1,
  WEEKLY:    2,
  BIWEEKLY:  3,
  MONTHLY:   4,
  QUARTERLY: 5,
  YEARLY:    6,
} as const;

export type Frequency = {
  id: number;
  name: string;
};

export type Subscription = {
  id: number;
  uuid: string;
  active: number;
  name: string;
  transaction_type_id: number;
  bank_account_id: number;
  bank_account?: BankAccount;
  category_id: number | null;
  category?: ExpenseCategory;
  amount: number;
  description: string | null;
  start_date: string;
  end_date: string | null;
  frequency_id: number;
  frequency?: Frequency;
  next_payment_date: string | null;
  // joined at query time
  frequency_name?: string;
  category_name?: string;
  bank_account_name?: string;
  currency?: string;
};

export type CreateSubscription = {
  name: string;
  transaction_type_id: number;
  bank_account_id: number;
  category_id: number | null;
  amount: number;
  description: string;
  start_date: string;
  end_date: string | null;
  frequency_id: number;
};
