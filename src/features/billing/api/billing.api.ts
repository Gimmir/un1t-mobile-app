import { api } from '@/src/lib/axios';

const DEFAULT_PAYMENT_SHEET_PATH = '/billing/purchases/payment-sheet';
const DEFAULT_CHECKOUT_PATH = '/billing/purchases/checkout';
const PAYMENT_SHEET_URL =
  process.env.EXPO_PUBLIC_PURCHASES_PAYMENT_SHEET_URL ??
  process.env.EXPO_PUBLIC_STRIPE_PAYMENT_SHEET_URL ??
  DEFAULT_PAYMENT_SHEET_PATH;
const CHECKOUT_URL =
  process.env.EXPO_PUBLIC_PURCHASES_CHECKOUT_URL ??
  DEFAULT_CHECKOUT_PATH;

function logBilling(_label: string, _payload?: unknown) {
  void _label;
  void _payload;
}

const withStudioId = (path: string, studioId?: string | null) => {
  if (!studioId) return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}studioId=${encodeURIComponent(studioId)}`;
};

function unwrapData<T>(response: unknown): T {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as Record<string, unknown>).data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as Record<string, unknown>).data as T;
    }
    return data as T;
  }
  return response as T;
}

function summarizePaymentResponse(payload: unknown) {
  if (!payload || typeof payload !== 'object') return payload;
  const record = payload as Record<string, unknown>;
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  const candidates: Record<string, unknown>[] = [record];
  if (isRecord(record.data)) {
    candidates.push(record.data);
  }
  const containers = [
    'stripe',
    'stripeAccount',
    'stripe_account',
    'account',
    'connectedAccount',
    'connected_account',
    'connect',
    'paymentSheet',
    'payment_sheet',
  ];
  for (const key of containers) {
    const value = record[key];
    if (isRecord(value)) candidates.push(value);
  }
  if (isRecord(record.data)) {
    for (const key of containers) {
      const value = (record.data as Record<string, unknown>)[key];
      if (isRecord(value)) candidates.push(value);
    }
  }
  const hasKey = (keys: string[]) =>
    candidates.some((candidate) =>
      keys.some((key) => typeof candidate[key] === 'string' && candidate[key])
    );

  return {
    keys: Object.keys(record),
    dataKeys: isRecord(record.data) ? Object.keys(record.data) : null,
    hasCustomer: hasKey(['customer', 'customerId', 'customer_id']),
    hasEphemeralKey: hasKey([
      'ephemeralKey',
      'ephemeralKeySecret',
      'ephemeral_key',
      'ephemeral_key_secret',
    ]),
    hasPaymentIntent: hasKey([
      'paymentIntent',
      'paymentIntentClientSecret',
      'payment_intent',
      'payment_intent_client_secret',
      'client_secret',
    ]),
    hasSetupIntent: hasKey([
      'setupIntent',
      'setupIntentClientSecret',
      'setup_intent',
      'setup_intent_client_secret',
    ]),
    hasCheckoutUrl: hasKey([
      'url',
      'checkoutUrl',
      'checkout_url',
      'sessionUrl',
      'session_url',
    ]),
  };
}

export type BillingRecurring = {
  interval?: string;
  interval_count?: number;
  meter?: string | null;
  trial_period_days?: number | null;
  usage_type?: string;
};

export type BillingProduct = {
  id: string;
  object?: string;
  active?: boolean;
  attributes?: string[];
  created?: number;
  default_price?: string;
  description?: string | null;
  images?: string[];
  livemode?: boolean;
  marketing_features?: unknown[];
  metadata?: Record<string, string>;
  name?: string;
  package_dimensions?: unknown;
  shippable?: boolean | null;
  statement_descriptor?: string | null;
  tax_code?: string | null;
  type?: string;
  unit_label?: string | null;
  updated?: number;
  url?: string | null;
};

export type BillingPrice = {
  id: string;
  object?: string;
  active?: boolean;
  billing_scheme?: string;
  created?: number;
  currency?: string;
  custom_unit_amount?: number | null;
  livemode?: boolean;
  lookup_key?: string | null;
  metadata?: Record<string, string>;
  nickname?: string | null;
  product?: BillingProduct;
  recurring?: BillingRecurring | null;
  tax_behavior?: string | null;
  tiers_mode?: string | null;
  transform_quantity?: unknown;
  type?: string;
  unit_amount?: number | null;
  unit_amount_decimal?: string;
};

export type PaymentSheetPayload = {
  studioId: string;
  priceId: string;
  productType: 'pack' | 'subscription';
};

export type PaymentSheetResponse = {
  customer?: string;
  ephemeralKey?: string;
  paymentIntent?: string;
  publishableKey?: string;
  [key: string]: unknown;
};

export type PurchaseHistoryEntry = Record<string, unknown>;
export type PurchaseHistory = PurchaseHistoryEntry[];

export type Subscription = {
  id?: string;
  studioId?: string;
  stripeSubscriptionId?: string;
  status?: string;
  planType?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt?: string;
  [key: string]: unknown;
};

export type CreditsBalance = {
  available: number | null;
  total: number | null;
  expiresAt: string | null;
};

export type CreditsLedgerEntry = Record<string, unknown>;

export type CreditsLedger = {
  balance: number | null;
  total: number | null;
  expiresAt: string | null;
  entries: CreditsLedgerEntry[];
};

const CREDIT_BALANCE_KEYS = [
  'availableCredits',
  'available',
  'balance',
  'remaining',
  'remainingCredits',
  'credits',
  'available_credits',
  'remaining_credits',
  'credit_balance',
  'credits_balance',
  'creditsAvailable',
  'availableCreditsBalance',
  'currentBalance',
  'current_balance',
];
const CREDIT_TOTAL_KEYS = [
  'total',
  'totalCredits',
  'creditsTotal',
  'limit',
  'allocated',
  'allocation',
  'total_credits',
  'credits_total',
  'credit_limit',
  'credits_limit',
  'allocation_total',
];
const CREDIT_EXPIRES_KEYS = [
  'expiresAt',
  'expires',
  'expiry',
  'expiresOn',
  'expiration',
  'expiryDate',
  'expires_at',
  'expires_on',
  'expiry_date',
  'expiration_date',
  'unlimitedUntil',
  'unlimited_until',
];
const LEDGER_ENTRY_KEYS = [
  'ledger',
  'history',
  'entries',
  'transactions',
  'items',
  'ledger_entries',
  'credit_history',
];
const PURCHASE_LIST_KEYS = ['products', 'items', 'data', 'prices', 'list'];
const PRICE_LIST_KEYS = ['prices', 'priceList', 'pricing', 'priceOptions', 'price', 'default_price'];
const PRICE_ID_KEYS = ['id', 'priceId', 'price_id', 'stripePriceId', 'stripe_price_id'];
const PRICE_AMOUNT_KEYS = [
  'unit_amount',
  'unitAmount',
  'amount',
  'price',
  'priceAmount',
  'amountInCents',
  'amount_cents',
];
const PRICE_CURRENCY_KEYS = ['currency', 'currencyCode', 'currency_code'];
const HISTORY_LIST_KEYS = ['history', 'transactions', 'entries', 'items', 'data'];
const SUBSCRIPTIONS_LIST_KEYS = ['subscriptions', 'items', 'data', 'list'];
const SUBSCRIPTION_FIELD_KEYS = [
  'id',
  'status',
  'planType',
  'currentPeriodStart',
  'currentPeriodEnd',
  'current_period_start',
  'current_period_end',
  'stripeSubscriptionId',
  'stripe_subscription_id',
  'studioId',
  'studio_id',
  'cancelAtPeriodEnd',
  'cancel_at_period_end',
];
const UNLIMITED_TOKENS = [
  'unlimited',
  'no limit',
  'nolimit',
  'infinite',
  'infinity',
  '∞',
  'безліміт',
  'безлимит',
];
const UNLIMITED_FLAG_KEYS = [
  'isUnlimited',
  'is_unlimited',
  'unlimited',
  'hasUnlimited',
  'has_unlimited',
  'unlimitedAccess',
  'unlimited_access',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function looksLikeSubscription(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && SUBSCRIPTION_FIELD_KEYS.some((key) => key in value);
}

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

function pickNumber(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = toNumber(record[key]);
    if (value != null) return value;
  }
  return null;
}

function pickString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return null;
}

function isUnlimitedValue(value: unknown): boolean {
  if (value === Number.POSITIVE_INFINITY) return true;
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  return UNLIMITED_TOKENS.some((token) => normalized.includes(token));
}

function pickUnlimited(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    if (isUnlimitedValue(record[key])) {
      return Number.POSITIVE_INFINITY;
    }
  }
  return null;
}

function pickNestedRecord(record: Record<string, unknown>, keys: string[]): Record<string, unknown> | null {
  for (const key of keys) {
    const value = record[key];
    if (isRecord(value)) return value;
  }
  return null;
}

function pickEntries(record: Record<string, unknown>): CreditsLedgerEntry[] {
  for (const key of LEDGER_ENTRY_KEYS) {
    const value = record[key];
    if (Array.isArray(value)) return value as CreditsLedgerEntry[];
  }
  return [];
}

function hasUnlimitedFlag(record: Record<string, unknown>): boolean {
  for (const key of UNLIMITED_FLAG_KEYS) {
    if (toBoolean(record[key])) return true;
  }
  return false;
}

function normalizeCreditsBalance(raw: unknown): CreditsBalance {
  if (typeof raw === 'number') {
    return { available: raw, total: null, expiresAt: null };
  }
  if (!isRecord(raw)) {
    return { available: null, total: null, expiresAt: null };
  }

  const nested = pickNestedRecord(raw, ['balance', 'summary', 'credits']);
  const unlimitedFlag = hasUnlimitedFlag(raw) || (nested ? hasUnlimitedFlag(nested) : false);
  const available =
    (unlimitedFlag ? Number.POSITIVE_INFINITY : null) ??
    pickUnlimited(raw, CREDIT_BALANCE_KEYS) ??
    (nested ? pickUnlimited(nested, CREDIT_BALANCE_KEYS) : null) ??
    pickNumber(raw, CREDIT_BALANCE_KEYS) ??
    (nested ? pickNumber(nested, CREDIT_BALANCE_KEYS) : null);
  const total = unlimitedFlag
    ? null
    : pickUnlimited(raw, CREDIT_TOTAL_KEYS) ??
      (nested ? pickUnlimited(nested, CREDIT_TOTAL_KEYS) : null) ??
      pickNumber(raw, CREDIT_TOTAL_KEYS) ??
      (nested ? pickNumber(nested, CREDIT_TOTAL_KEYS) : null);
  const expiresAt =
    pickString(raw, CREDIT_EXPIRES_KEYS) ??
    (nested ? pickString(nested, CREDIT_EXPIRES_KEYS) : null);

  return { available, total, expiresAt };
}

function normalizeCreditsLedger(raw: unknown): CreditsLedger {
  if (Array.isArray(raw)) {
    return { balance: null, total: null, expiresAt: null, entries: raw as CreditsLedgerEntry[] };
  }
  if (!isRecord(raw)) {
    return { balance: null, total: null, expiresAt: null, entries: [] };
  }

  const nested = pickNestedRecord(raw, ['balance', 'summary', 'credits']);
  const unlimitedFlag = hasUnlimitedFlag(raw) || (nested ? hasUnlimitedFlag(nested) : false);
  const balance =
    (unlimitedFlag ? Number.POSITIVE_INFINITY : null) ??
    pickUnlimited(raw, CREDIT_BALANCE_KEYS) ??
    (nested ? pickUnlimited(nested, CREDIT_BALANCE_KEYS) : null) ??
    pickNumber(raw, CREDIT_BALANCE_KEYS) ??
    (nested ? pickNumber(nested, CREDIT_BALANCE_KEYS) : null);
  const total = unlimitedFlag
    ? null
    : pickUnlimited(raw, CREDIT_TOTAL_KEYS) ??
      (nested ? pickUnlimited(nested, CREDIT_TOTAL_KEYS) : null) ??
      pickNumber(raw, CREDIT_TOTAL_KEYS) ??
      (nested ? pickNumber(nested, CREDIT_TOTAL_KEYS) : null);
  const expiresAt =
    pickString(raw, CREDIT_EXPIRES_KEYS) ??
    (nested ? pickString(nested, CREDIT_EXPIRES_KEYS) : null);
  const entries = pickEntries(raw);

  return { balance, total, expiresAt, entries };
}

function extractPurchaseList(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw.filter(isRecord);
  if (!isRecord(raw)) return [];

  for (const key of PURCHASE_LIST_KEYS) {
    const value = raw[key];
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
    if (isRecord(value) && Array.isArray(value.data)) {
      return (value.data as unknown[]).filter(isRecord);
    }
  }

  if (isRecord(raw.data)) {
    for (const key of PURCHASE_LIST_KEYS) {
      const nestedValue = (raw.data as Record<string, unknown>)[key];
      if (Array.isArray(nestedValue)) {
        return nestedValue.filter(isRecord);
      }
    }
  }

  return [];
}

function extractHistoryEntries(raw: unknown): PurchaseHistoryEntry[] {
  if (Array.isArray(raw)) return raw.filter(isRecord) as PurchaseHistoryEntry[];
  if (!isRecord(raw)) return [];

  for (const key of HISTORY_LIST_KEYS) {
    const value = raw[key];
    if (Array.isArray(value)) {
      return value.filter(isRecord) as PurchaseHistoryEntry[];
    }
    if (isRecord(value) && Array.isArray(value.data)) {
      return (value.data as unknown[]).filter(isRecord) as PurchaseHistoryEntry[];
    }
  }

  if (isRecord(raw.data)) {
    for (const key of HISTORY_LIST_KEYS) {
      const nestedValue = (raw.data as Record<string, unknown>)[key];
      if (Array.isArray(nestedValue)) {
        return nestedValue.filter(isRecord) as PurchaseHistoryEntry[];
      }
    }
  }

  return [];
}

function looksLikePrice(record: Record<string, unknown>) {
  return (
    'unit_amount' in record ||
    'unitAmount' in record ||
    'amount' in record ||
    'currency' in record ||
    'recurring' in record
  );
}

function extractPriceList(record: Record<string, unknown>): Record<string, unknown>[] {
  for (const key of PRICE_LIST_KEYS) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
    if (isRecord(value)) {
      if (Array.isArray(value.data)) {
        return (value.data as unknown[]).filter(isRecord);
      }
      if (Array.isArray(value.items)) {
        return (value.items as unknown[]).filter(isRecord);
      }
      if (looksLikePrice(value)) {
        return [value];
      }
    }
  }
  return [];
}

function coercePrice(rawPrice: Record<string, unknown>, product?: Record<string, unknown>): BillingPrice | null {
  const id = pickString(rawPrice, PRICE_ID_KEYS);
  if (!id) return null;

  const unitAmount = pickNumber(rawPrice, PRICE_AMOUNT_KEYS) ?? toNumber(rawPrice.unit_amount_decimal);
  const currency = pickString(rawPrice, PRICE_CURRENCY_KEYS);
  const recurring = isRecord(rawPrice.recurring)
    ? (rawPrice.recurring as BillingRecurring)
    : (() => {
        const interval = pickString(rawPrice, ['interval', 'recurringInterval']);
        return interval ? { interval } : undefined;
      })();
  const productRecord = isRecord(rawPrice.product) ? rawPrice.product : product;

  return {
    ...(rawPrice as BillingPrice),
    id,
    unit_amount: unitAmount ?? (rawPrice.unit_amount as number | undefined),
    currency: currency ?? (rawPrice.currency as string | undefined),
    recurring: recurring ?? (rawPrice.recurring as BillingRecurring | null | undefined),
    product: (productRecord as BillingProduct | undefined) ?? (rawPrice.product as BillingProduct | undefined),
  };
}

function normalizePurchaseProducts(raw: unknown): BillingPrice[] {
  const list = extractPurchaseList(raw);
  if (!list.length) return [];

  const prices: BillingPrice[] = [];

  for (const item of list) {
    const priceList = extractPriceList(item);
    const productRecord =
      isRecord(item.product) ? item.product : priceList.length > 0 && !looksLikePrice(item) ? item : undefined;

    if (priceList.length > 0) {
      for (const priceItem of priceList) {
        const normalized = coercePrice(priceItem, productRecord);
        if (normalized) prices.push(normalized);
      }
      continue;
    }

    const normalized = coercePrice(item, productRecord);
    if (normalized) prices.push(normalized);
  }

  return prices;
}

function normalizeSubscriptions(raw: unknown): Subscription[] {
  if (Array.isArray(raw)) {
    return raw.filter(isRecord) as Subscription[];
  }
  if (looksLikeSubscription(raw)) {
    return [raw as Subscription];
  }
  if (!isRecord(raw)) return [];

  for (const key of SUBSCRIPTIONS_LIST_KEYS) {
    const value = raw[key];
    if (Array.isArray(value)) {
      return value.filter(isRecord) as Subscription[];
    }
    if (isRecord(value) && Array.isArray(value.data)) {
      return (value.data as unknown[]).filter(isRecord) as Subscription[];
    }
  }

  if (isRecord(raw.data)) {
    if (looksLikeSubscription(raw.data)) {
      return [raw.data as Subscription];
    }
    for (const key of SUBSCRIPTIONS_LIST_KEYS) {
      const nestedValue = (raw.data as Record<string, unknown>)[key];
      if (Array.isArray(nestedValue)) {
        return nestedValue.filter(isRecord) as Subscription[];
      }
    }
  }

  return [];
}

export const billingApi = {
  getProductPrices: async (studioId: string) => {
    const response = await api.get<unknown>(
      `/billing/purchases/products/${encodeURIComponent(studioId)}`
    );
    logBilling('products:raw', response);
    const unwrapped = unwrapData<unknown>(response);
    logBilling('products:unwrapped', unwrapped);
    return normalizePurchaseProducts(unwrapped);
  },
  getPurchaseHistory: async (studioId: string) => {
    const response = await api.get<unknown>(
      `/billing/purchases/history?studioId=${encodeURIComponent(studioId)}`
    );
    logBilling('history:raw', response);
    const unwrapped = unwrapData<unknown>(response);
    logBilling('history:unwrapped', unwrapped);
    return extractHistoryEntries(unwrapped);
  },
  getSubscriptions: async () => {
    const response = await api.get<unknown>('/billing/subscriptions');
    logBilling('subscriptions:raw', response);
    const unwrapped = unwrapData<unknown>(response);
    logBilling('subscriptions:unwrapped', unwrapped);
    return normalizeSubscriptions(unwrapped);
  },
  cancelSubscription: async (subscriptionId: string) => {
    const response = await api.post<unknown>(
      `/billing/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`
    );
    logBilling('subscriptions:cancel:raw', response);
    return unwrapData<unknown>(response);
  },
  createCheckoutSession: async (payload: PaymentSheetPayload) => {
    logBilling('checkout:request', payload);
    const response = await api.post<unknown>(CHECKOUT_URL, payload);
    logBilling('checkout:raw', response);
    const unwrapped = unwrapData<PaymentSheetResponse>(response);
    logBilling('checkout:summary', summarizePaymentResponse(unwrapped));
    return unwrapped;
  },
  createPaymentSheet: async (payload: PaymentSheetPayload) => {
    logBilling('payment-sheet:request', payload);
    const response = await api.post<unknown>(PAYMENT_SHEET_URL, payload);
    logBilling('payment-sheet:raw', response);
    const unwrapped = unwrapData<PaymentSheetResponse>(response);
    logBilling('payment-sheet:summary', summarizePaymentResponse(unwrapped));
    return unwrapped;
  },
  getCreditsBalance: async (studioId?: string | null) => {
    const response = await api.get<unknown>(withStudioId('/billing/credits/balance', studioId));
    logBilling('credits:balance:raw', response);
    const unwrapped = unwrapData<unknown>(response);
    logBilling('credits:balance:unwrapped', unwrapped);
    return normalizeCreditsBalance(unwrapped);
  },
  getCreditsLedger: async (studioId?: string | null) => {
    const response = await api.get<unknown>(withStudioId('/billing/credits/ledger', studioId));
    logBilling('credits:ledger:raw', response);
    const unwrapped = unwrapData<unknown>(response);
    logBilling('credits:ledger:unwrapped', unwrapped);
    return normalizeCreditsLedger(unwrapped);
  },
};
