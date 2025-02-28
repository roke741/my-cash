
//QUERY'S TABLES
export const CREATE_TABLE_EXPENSES_CATEGORIES = ` 
CREATE TABLE IF NOT EXISTS expenses_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);`;

export const CREATE_TABLE_BANKS = `
CREATE TABLE IF NOT EXISTS banks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  abbreviation TEXT
);`;

export const CREATE_TABLE_BANK_ACCOUNTS = `
CREATE TABLE IF NOT EXISTS bank_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bank_id INTEGER,
  name TEXT NOT NULL,
  account_number TEXT,
  abbreviation TEXT,
  balance REAL DEFAULT 0.00,
  FOREIGN KEY (bank_id) REFERENCES banks(id)
);`;

export const CREATE_TABLE_TRANSACTION_TYPES = `
CREATE TABLE IF NOT EXISTS transaction_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);`;


export const CREATE_TABLE_TRANSACTIONS = `
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER,
  category_id INTEGER,
  amount REAL NOT NULL,
  description TEXT,
  transaction_type_id INTEGER,
  transaction_date TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES bank_accounts(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(id)
);`;

export const CREATE_TABLE_FREQUENCIES = `
CREATE TABLE IF NOT EXISTS frequencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);`;

export const CREATE_TABLE_SUSCRIPTIONS = `
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  active INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  account_id INTEGER,
  category_id INTEGER,
  amount REAL NOT NULL,
  description TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  frequency_id INTEGER,
  FOREIGN KEY (account_id) REFERENCES bank_accounts(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (frequency_id) REFERENCES frequencies(id)
);`;


//QUERY'S INSERTS
export const INSERT_CATEGORIES = `
INSERT INTO categories (name) VALUES ('🍔 Food');
INSERT INTO categories (name) VALUES ('🚗 Transport');
INSERT INTO categories (name) VALUES ('💊 Health');
INSERT INTO categories (name) VALUES ('📚 Education');
INSERT INTO categories (name) VALUES ('🎮 Entertainment');
INSERT INTO categories (name) VALUES ('🔧 Services');
INSERT INTO categories (name) VALUES ('💸 Others');
`;


export const INSERT_BANKS = `
INSERT INTO banks (name, abbreviation) VALUES ('🏦 Banco de Crédito del Perú', 'BCP');
INSERT INTO banks (name, abbreviation) VALUES ('🏦 Banco Interbank', 'IBK');
INSERT INTO banks (name, abbreviation) VALUES ('🏦 Banco BBVA', 'BBVA');
INSERT INTO banks (name, abbreviation) VALUES ('🏦 Banco de la Nación', 'NACION');
INSERT INTO banks (name, abbreviation) VALUES ('🏦 Banco Scotiabank', 'SCOTIABANK');
INSERT INTO banks (name, abbreviation) VALUES ('🏦 Banco Falabella', 'FALABELLA');
INSERT INTO banks (name, abbreviation) VALUES ('🏦 Banco Ripley', 'RIPLEY');
INSERT INTO banks (name, abbreviation) VALUES ('🏦 Banco Pichincha', 'PICHINCHA');
INSERT INTO banks (name, abbreviation) VALUES ('💰 Caja Arequipa', 'CAJAAREQUIPA');
`;

export const INSERT_TRANSACTION_TYPES = `
INSERT INTO transaction_types (name) VALUES ('📉 Income');
INSERT INTO transaction_types (name) VALUES ('📈 Expense');
`;

export const INSERT_FREQUENCIES = `
INSERT INTO frequencies (name) VALUES ('Daily');  
INSERT INTO frequencies (name) VALUES ('Weekly');
INSERT INTO frequencies (name) VALUES ('Biweekly');
INSERT INTO frequencies (name) VALUES ('Monthly');
INSERT INTO frequencies (name) VALUES ('Quarterly');
INSERT INTO frequencies (name) VALUES ('Yearly');
`;

export const DROP_TABLES = `
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS bank_accounts;
DROP TABLE IF EXISTS banks;
DROP TABLE IF EXISTS transaction_types;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS frequencies;
DROP TABLE IF EXISTS subscriptions;
`;
