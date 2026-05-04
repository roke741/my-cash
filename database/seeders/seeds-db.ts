export const DROP_TABLES = `
  DROP TABLE IF EXISTS subscriptions;
  DROP TABLE IF EXISTS transactions;
  DROP TABLE IF EXISTS bank_accounts;
  DROP TABLE IF EXISTS banks;
  DROP TABLE IF EXISTS expenses_categories;
  DROP TABLE IF EXISTS transaction_types;
  DROP TABLE IF EXISTS frequencies;
  DROP TABLE IF EXISTS currencies;
`;

export const CREATE_TABLE_CURRENCIES = `
  CREATE TABLE IF NOT EXISTS currencies (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL
  );
`;

export const CREATE_TABLE_EXPENSES_CATEGORIES = `
  CREATE TABLE IF NOT EXISTS expenses_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    is_custom INTEGER NOT NULL DEFAULT 0
  );
`;

export const CREATE_TABLE_BANKS = `
  CREATE TABLE IF NOT EXISTS banks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    abbreviation TEXT
  );
`;

export const CREATE_TABLE_BANK_ACCOUNTS = `
  CREATE TABLE IF NOT EXISTS bank_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE DEFAULT (lower(hex(randomblob(16)))),
    bank_id INTEGER,
    name TEXT NOT NULL,
    account_number TEXT,
    currency TEXT NOT NULL DEFAULT 'PEN',
    initial_balance REAL NOT NULL DEFAULT 0.00,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (bank_id) REFERENCES banks(id),
    FOREIGN KEY (currency) REFERENCES currencies(code)
  );
`;

export const CREATE_TABLE_TRANSACTION_TYPES = `
  CREATE TABLE IF NOT EXISTS transaction_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
`;

export const CREATE_TABLE_TRANSACTIONS = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE DEFAULT (lower(hex(randomblob(16)))),
    bank_account_id INTEGER NOT NULL,
    category_id INTEGER,
    amount REAL NOT NULL,
    description TEXT,
    transaction_type_id INTEGER NOT NULL,
    transaction_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    deleted_at TEXT,
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id),
    FOREIGN KEY (category_id) REFERENCES expenses_categories(id),
    FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(id)
  );
`;

export const CREATE_TABLE_FREQUENCIES = `
  CREATE TABLE IF NOT EXISTS frequencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
`;

export const CREATE_TABLE_SUBSCRIPTIONS = `
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE DEFAULT (lower(hex(randomblob(16)))),
    active INTEGER NOT NULL DEFAULT 1,
    name TEXT NOT NULL,
    transaction_type_id INTEGER NOT NULL DEFAULT 2,
    bank_account_id INTEGER NOT NULL,
    category_id INTEGER,
    amount REAL NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    frequency_id INTEGER NOT NULL,
    next_payment_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id),
    FOREIGN KEY (category_id) REFERENCES expenses_categories(id),
    FOREIGN KEY (frequency_id) REFERENCES frequencies(id),
    FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(id)
  );
`;

// ─── Seed data ────────────────────────────────────────────────────────────────

export const INSERT_CURRENCIES = `
  INSERT INTO currencies (code, name, symbol) VALUES ('PEN', 'Sol peruano', 'S/');
  INSERT INTO currencies (code, name, symbol) VALUES ('USD', 'Dólar estadounidense', '$');
  INSERT INTO currencies (code, name, symbol) VALUES ('EUR', 'Euro', '€');
  INSERT INTO currencies (code, name, symbol) VALUES ('COP', 'Peso colombiano', '$');
  INSERT INTO currencies (code, name, symbol) VALUES ('ARS', 'Peso argentino', '$');
  INSERT INTO currencies (code, name, symbol) VALUES ('BRL', 'Real brasileño', 'R$');
  INSERT INTO currencies (code, name, symbol) VALUES ('MXN', 'Peso mexicano', '$');
  INSERT INTO currencies (code, name, symbol) VALUES ('CLP', 'Peso chileno', '$');
`;

export const INSERT_CATEGORIES = `
  INSERT INTO expenses_categories (name, is_custom) VALUES ('🍔 Alimentación', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('🚗 Transporte', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('💊 Salud', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('📚 Educación', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('🎮 Entretenimiento', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('🏠 Vivienda', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('🔧 Servicios', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('👗 Ropa', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('💰 Inversión', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('💼 Trabajo', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('🎁 Regalos', 0);
  INSERT INTO expenses_categories (name, is_custom) VALUES ('📦 Otros', 0);
`;

export const INSERT_BANKS = `
  INSERT INTO banks (name, abbreviation) VALUES ('Banco de Crédito del Perú', 'BCP');
  INSERT INTO banks (name, abbreviation) VALUES ('Interbank', 'IBK');
  INSERT INTO banks (name, abbreviation) VALUES ('BBVA', 'BBVA');
  INSERT INTO banks (name, abbreviation) VALUES ('Banco de la Nación', 'BN');
  INSERT INTO banks (name, abbreviation) VALUES ('Scotiabank', 'SCO');
  INSERT INTO banks (name, abbreviation) VALUES ('Falabella', 'FAL');
  INSERT INTO banks (name, abbreviation) VALUES ('Yape', 'YPE');
  INSERT INTO banks (name, abbreviation) VALUES ('Plin', 'PLN');
  INSERT INTO banks (name, abbreviation) VALUES ('Caja Arequipa', 'CAJ');
  INSERT INTO banks (name, abbreviation) VALUES ('Otro', 'OTR');
`;

export const INSERT_TRANSACTION_TYPES = `
  INSERT INTO transaction_types (name) VALUES ('Ingreso');
  INSERT INTO transaction_types (name) VALUES ('Gasto');
`;

export const INSERT_FREQUENCIES = `
  INSERT INTO frequencies (name) VALUES ('Diario');
  INSERT INTO frequencies (name) VALUES ('Semanal');
  INSERT INTO frequencies (name) VALUES ('Quincenal');
  INSERT INTO frequencies (name) VALUES ('Mensual');
  INSERT INTO frequencies (name) VALUES ('Trimestral');
  INSERT INTO frequencies (name) VALUES ('Anual');
`;
