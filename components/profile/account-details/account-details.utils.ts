import { COUNTRY_NAMES } from '@/constants/country-names';

export const today = new Date();
export const maxDobDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());

export function parseDob(value: unknown) {
  if (typeof value !== 'string' || !value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
}

export function formatDob(value: unknown) {
  const date = parseDob(value);
  if (!date) return '';

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  return `${dd}/${mm}/${yyyy}`;
}

export function formatCountry(value: unknown) {
  if (typeof value !== 'string') return '—';
  const trimmed = value.trim();
  if (!trimmed) return '—';

  const upper = trimmed.toUpperCase();

  try {
    if (typeof (Intl as any)?.DisplayNames === 'function') {
      const regionFormatter = new Intl.DisplayNames(['en'], { type: 'region' });
      const resolved = regionFormatter.of(upper);
      if (resolved) {
        return resolved;
      }
    }
  } catch {
    // ignore and fall back to map/uppercase
  }

  return COUNTRY_NAMES[upper as keyof typeof COUNTRY_NAMES] || trimmed;
}

export function resolveCountryCode(value: unknown) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  const upper = trimmed.toUpperCase();
  if (COUNTRY_NAMES[upper as keyof typeof COUNTRY_NAMES]) {
    return upper;
  }

  const match = Object.entries(COUNTRY_NAMES).find(
    ([, name]) => name.toUpperCase() === trimmed.toUpperCase()
  );

  return match?.[0] || upper;
}
