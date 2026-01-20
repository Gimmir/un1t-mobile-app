type LedgerSummary = {
  isUnlimited: boolean;
  balance: number | null;
  expiresAt: string | null;
};

const LEDGER_BALANCE_KEYS = [
  'currentBalance',
  'current_balance',
  'availableCredits',
  'available',
  'balance',
  'remaining',
  'remainingCredits',
];
const LEDGER_EXPIRES_KEYS = [
  'unlimitedUntil',
  'unlimited_until',
  'expiresAt',
  'expires_at',
  'expiresOn',
  'expires_on',
];
const LEDGER_UNLIMITED_KEYS = [
  'isUnlimited',
  'is_unlimited',
  'unlimited',
  'hasUnlimited',
  'has_unlimited',
  'unlimitedAccess',
  'unlimited_access',
];

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return null;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }
  return false;
}

function pickFirstString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) return value;
  }
  return null;
}

function pickFirstNumber(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = toNumber(record[key]);
    if (value != null) return value;
  }
  return null;
}

function hasUnlimitedFlag(record: Record<string, unknown>): boolean {
  for (const key of LEDGER_UNLIMITED_KEYS) {
    if (toBoolean(record[key])) return true;
  }
  return false;
}

export function resolveLedgerSummary(ledger: unknown): LedgerSummary {
  if (!ledger || typeof ledger !== 'object') {
    return { isUnlimited: false, balance: null, expiresAt: null };
  }
  const record = ledger as Record<string, unknown>;
  return {
    isUnlimited: hasUnlimitedFlag(record),
    balance: pickFirstNumber(record, LEDGER_BALANCE_KEYS),
    expiresAt: pickFirstString(record, LEDGER_EXPIRES_KEYS),
  };
}
