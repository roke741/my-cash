import * as FileSystem from 'expo-file-system/legacy';
import { Share } from 'react-native';

import { transactionsDB } from '@/database/models/transactions';
import { BankAccount, ExpenseCategory } from '@/database/types';

// ─── CSV ─────────────────────────────────────────────────────────

function escapeCSV(value: unknown): string {
  const s = String(value ?? '');
  // Wrap in quotes if the value contains commas, quotes or newlines
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function exportTransactionsCSV(): Promise<void> {
  const transactions = await transactionsDB.all();

  // BOM + header — BOM makes Excel/Numbers open UTF-8 correctly
  const BOM = '﻿';
  const headers = ['Fecha', 'Tipo', 'Categoría', 'Cuenta', 'Moneda', 'Monto', 'Descripción'];

  const rows = transactions.map((t) => {
    const tx = t as typeof t & {
      transaction_type_name?: string;
      category_name?: string;
      bank_account_name?: string;
      currency?: string;
    };
    return [
      tx.transaction_date,
      tx.transaction_type_name ?? '',
      tx.category_name ?? '',
      tx.bank_account_name ?? '',
      tx.currency ?? '',
      tx.amount.toFixed(2),
      tx.description ?? '',
    ].map(escapeCSV).join(',');
  });

  const csv = BOM + [headers.join(','), ...rows].join('\n');

  const date = new Date().toISOString().split('T')[0];
  const filename = `mycash-transacciones-${date}.csv`;
  const uri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(uri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  await Share.share({ url: uri, title: filename });
}

// ─── JSON backup ─────────────────────────────────────────────────

export async function exportBackupJSON(
  bankAccounts: BankAccount[],
  categories: ExpenseCategory[],
): Promise<void> {
  const transactions = await transactionsDB.all();

  const backup = {
    version: 1,
    app: 'my-cash',
    exported_at: new Date().toISOString(),
    data: {
      bank_accounts: bankAccounts,
      categories,
      transactions,
    },
  };

  const date = new Date().toISOString().split('T')[0];
  const filename = `mycash-backup-${date}.json`;
  const uri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(uri, JSON.stringify(backup, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  });

  await Share.share({ url: uri, title: filename });
}
