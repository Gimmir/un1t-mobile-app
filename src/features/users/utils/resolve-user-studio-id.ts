type StudioRef = string | { _id?: string; id?: string } | null | undefined;

function normalizeId(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (value && typeof value === 'object') {
    const record = value as { _id?: string; id?: string };
    return normalizeId(record._id ?? record.id ?? null);
  }
  return null;
}

export function resolveUserStudioId(user: unknown): string | null {
  if (!user || typeof user !== 'object') return null;
  const record = user as Record<string, unknown>;

  const direct =
    record.studioId ??
    record.studio_id ??
    record.homeStudio ??
    record.home_studio ??
    null;
  const directId = normalizeId(direct);
  if (directId) return directId;

  const studioRef = record.studio as StudioRef;
  const studioId = normalizeId(studioRef);
  if (studioId) return studioId;

  const studios = record.studios;
  if (Array.isArray(studios) && studios.length > 0) {
    const first = normalizeId(studios[0]);
    if (first) return first;
  }

  return null;
}
