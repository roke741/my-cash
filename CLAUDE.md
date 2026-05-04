# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
expo start --ios          # Run on iOS simulator (primary target)
expo start --android      # Run on Android emulator
expo lint                 # Lint
jest --watchAll           # All tests in watch mode
jest <path>               # Single test file
npx tsc --noEmit          # Type check without building
npx expo install --check  # Verify package compatibility with SDK
```

## Stack

Expo SDK 55 · React Native 0.83 · React 19 · TypeScript · SQLite (expo-sqlite) · NativeWind v4 · Gluestack UI v1 · Expo Router (file-based) · React Hook Form + Zod · sonner-native

## Architecture

**my-cash** is a personal finance tracker (income/expenses by category, multi-currency) built for iOS-first.

### Routing — Bottom Tabs

```
app/_layout.tsx          # Root: SQLiteProvider + all context providers + GluestackUIProvider
app/index.tsx            # Entry/splash → redirects to (home)
app/(home)/_layout.tsx   # Bottom tabs: Inicio / Historial / Ajustes
app/(home)/index.tsx     # Dashboard: balance by currency, recent transactions, quick actions
app/(home)/history.tsx   # Full transaction list with type/category filters
app/(home)/settings.tsx  # Bank accounts management + custom categories
```

### Data Layer

SQLite is the source of truth. Database name and version live in `database/config-db.ts` — bump `DATABASE_VERSION` (integer) to trigger a full re-init on next app launch.

**Tables**: `currencies`, `expenses_categories`, `banks`, `bank_accounts`, `transaction_types`, `transactions`, `frequencies`, `subscriptions`

**Key design decisions:**
- Balance = `initial_balance + SUM(incomes) - SUM(expenses)` — calculated dynamically in SQL, never stored
- `transactions.deleted_at` is a soft delete (sync-ready)
- All user-created records have `uuid`, `created_at`, `updated_at` for future backend sync
- Currency lives on `bank_account`, not on individual transactions

**Models** (`database/models/`) — plain objects with async SQL methods. Use `openDatabaseSync` directly.

**Rule:** Components call context → context calls models. Never call models directly from components.

### Context Providers (all mounted in `_layout.tsx`)

| Context | Exposes |
|---|---|
| `BankProvider` | `banks[]` |
| `BankAccountsProvider` | `bankAccounts[]`, `balancesByCurrency[]`, `addBankAccount`, `deleteBankAccount`, `refresh` |
| `TransactionsProvider` | `transactions[]`, `addTransaction`, `editTransaction`, `removeTransaction`, `refresh` |
| `CategoriesProvider` | `categories[]`, `addCategory`, `removeCategory`, `refresh` |

After any write, call both `refresh` on transactions AND `refreshAccounts` to keep balances in sync.

### Transaction type IDs (constant in `database/types.ts`)

```ts
TRANSACTION_TYPE.INCOME  = 1
TRANSACTION_TYPE.EXPENSE = 2
```

### Forms

All forms use React Hook Form + Zod. The pattern:
1. Validate with Zod schema (strings for numeric fields, parse to `float` manually in `onSubmit`)
2. Call context method (e.g. `addTransaction`)
3. Call `refreshAccounts()` to update balances
4. Show `toast.success` / `toast.error`
5. Reset form + close modal

### Custom Selects (`components/custom/select/`)

All selects are Gluestack Actionsheet-based and consume context — no raw SQL in components:
- `SelectExpenseCategory` — uses `useCategories()`
- `SelectBankAccounts` — uses `useBankAccounts()`
- `SelectBank` — uses `useBanks()`
- `SelectCurrency` — loads from `currenciesDB.all()` directly (static seed data)

### Styling

NativeWind (Tailwind) + Gluestack UI. Dark mode via `media` in `tailwind.config.js`. `@/*` path alias maps to project root.

### Notifications

`sonner-native` (`<Toaster />` in root layout) — use `toast.success()` / `toast.error()`.

### TypeScript notes

- `ColorSchemeName` in RN 0.83 includes `'unspecified'` — always normalize with `s === 'dark' ? 'dark' : 'light'`
- Generated Gluestack UI files in `components/ui/` have `// @ts-nocheck` due to React 19 ref type changes — don't remove it
