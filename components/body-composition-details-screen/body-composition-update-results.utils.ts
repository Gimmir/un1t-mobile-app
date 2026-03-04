import { parseDob } from "@/components/profile/account-details/account-details.utils";
import type { BodyCompositionMetricDetails } from "./body-composition-utils";

const BODY_FAT_DESCRIPTION =
  "Body fat percentage is the proportion of fat mass relative to your total body weight. Unlike weight alone, it distinguishes between fat and lean tissue — making it one of the most accurate indicators of physical fitness and metabolic health. Tracking it over time helps you understand real changes in body composition, especially during training or dietary adjustments.";

const WEIGHT_DESCRIPTION =
  "Body weight reflects the total mass of your body, including muscle, fat, bone, and water. While it doesn't distinguish between these components, consistent weight tracking provides a reliable reference point for monitoring health trends and measuring overall progress. It's most useful when viewed alongside other metrics like body fat % and waist circumference.";

const WAIST_DESCRIPTION =
  "Waist circumference measures the distance around your natural waistline, just above the hip bones. It is one of the most reliable indicators of abdominal (visceral) fat — the type most closely linked to cardiovascular disease, type 2 diabetes, and metabolic syndrome. Reducing waist circumference is often a more meaningful health goal than losing weight alone.";

export type BodyCompositionInfoContent = {
  title: string;
  description: string;
  targetRangeTitle?: string;
  targetRangeSubtitle?: string;
  ranges?: { label: string; value: string }[];
};

export const parseTargetDate = (value?: string) => {
  if (typeof value !== "string" || !value.trim()) return new Date();
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const parsed = new Date(year, month, day);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return new Date();
};

export const clampToMinDate = (value: Date, minDate: Date) =>
  value.getTime() < minDate.getTime() ? minDate : value;

export const formatTargetDate = (value: Date) => {
  const day = String(value.getDate()).padStart(2, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = String(value.getFullYear());
  return `${day}.${month}.${year}`;
};

export const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const normalizeGender = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.toLowerCase() === "prefer not to say") {
    return "Prefer not to say";
  }
  return trimmed;
};

const resolveGenderFromCandidate = (candidate: unknown) => {
  if (typeof candidate === "string") return normalizeGender(candidate);
  if (candidate && typeof candidate === "object") {
    const record = candidate as {
      label?: unknown;
      name?: unknown;
      value?: unknown;
    };
    const nested = record.label ?? record.name ?? record.value;
    if (typeof nested === "string") return normalizeGender(nested);
  }
  return "";
};

export const resolveUserGenderLabel = (user: unknown) => {
  if (!user || typeof user !== "object") return "";
  const record = user as {
    gender?: unknown;
    sex?: unknown;
    profile?: { gender?: unknown; sex?: unknown };
    personalInfo?: { gender?: unknown; sex?: unknown };
  };

  const candidates = [
    record.gender,
    record.sex,
    record.profile?.gender,
    record.profile?.sex,
    record.personalInfo?.gender,
    record.personalInfo?.sex,
  ];

  for (const candidate of candidates) {
    const resolved = resolveGenderFromCandidate(candidate);
    if (resolved) return resolved;
  }

  return "";
};

export const resolveUserAge = (user: unknown) => {
  if (!user || typeof user !== "object") return null;
  const record = user as { birthday?: string; dob?: string };
  const rawDob = record.birthday || record.dob || "";
  const parsedDob = parseDob(rawDob);
  if (!parsedDob) return null;

  const now = new Date();
  let age = now.getFullYear() - parsedDob.getFullYear();
  const monthDelta = now.getMonth() - parsedDob.getMonth();
  if (
    monthDelta < 0 ||
    (monthDelta === 0 && now.getDate() < parsedDob.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

export const buildTargetRangeSubtitle = (user: unknown) => {
  const parts: string[] = [];
  const gender = resolveUserGenderLabel(user);
  if (gender) parts.push(gender);

  const age = resolveUserAge(user);
  if (typeof age === "number") parts.push(`${age} years old`);

  if (parts.length === 0) return "--";
  return parts.join(" ").toUpperCase();
};

const resolveGender = (user: unknown): "male" | "female" | null => {
  if (!user || typeof user !== "object") return null;
  const record = user as {
    gender?: unknown;
    sex?: unknown;
    profile?: { gender?: unknown; sex?: unknown };
    personalInfo?: { gender?: unknown; sex?: unknown };
  };
  const candidates = [
    record.gender,
    record.sex,
    record.profile?.gender,
    record.profile?.sex,
    record.personalInfo?.gender,
    record.personalInfo?.sex,
  ];
  for (const c of candidates) {
    if (typeof c !== "string") continue;
    const n = c.trim().toLowerCase();
    if (n === "male" || n.startsWith("m")) return "male";
    if (n === "female" || n.startsWith("f")) return "female";
  }
  return null;
};

const BODY_FAT_RANGES_MALE = [
  { label: "Lean", value: "6–13%" },
  { label: "Fit", value: "14–17%" },
  { label: "Average", value: "18–24%" },
  { label: "High", value: "25%+" },
];
const BODY_FAT_RANGES_FEMALE = [
  { label: "Lean", value: "14–20%" },
  { label: "Fit", value: "21–24%" },
  { label: "Average", value: "25–31%" },
  { label: "High", value: "32%+" },
];

const WAIST_RANGES_MALE = [
  { label: "Healthy", value: "<94 cm" },
  { label: "Caution", value: "94–102 cm" },
  { label: "High Risk", value: ">102 cm" },
];
const WAIST_RANGES_FEMALE = [
  { label: "Healthy", value: "<80 cm" },
  { label: "Caution", value: "80–88 cm" },
  { label: "High Risk", value: ">88 cm" },
];

export const buildBodyCompositionInfoContent = (
  metric: BodyCompositionMetricDetails | undefined,
  resolvedTitle: string,
  targetRangeSubtitle: string,
  user?: unknown,
): BodyCompositionInfoContent => {
  const gender = resolveGender(user);

  if (metric?.id === "body-fat") {
    const ranges =
      gender === "male"
        ? BODY_FAT_RANGES_MALE
        : gender === "female"
          ? BODY_FAT_RANGES_FEMALE
          : BODY_FAT_RANGES_FEMALE;
    return {
      title: resolvedTitle,
      description: BODY_FAT_DESCRIPTION,
      targetRangeTitle: "Healthy target ranges",
      targetRangeSubtitle,
      ranges,
    };
  }

  if (metric?.id === "waist") {
    const ranges =
      gender === "male"
        ? WAIST_RANGES_MALE
        : gender === "female"
          ? WAIST_RANGES_FEMALE
          : WAIST_RANGES_FEMALE;
    return {
      title: resolvedTitle,
      description: WAIST_DESCRIPTION,
      targetRangeTitle: "Healthy waist ranges",
      targetRangeSubtitle,
      ranges,
    };
  }

  if (metric?.id === "weight") {
    return {
      title: resolvedTitle,
      description: WEIGHT_DESCRIPTION,
    };
  }

  return {
    title: resolvedTitle,
    description: BODY_FAT_DESCRIPTION,
    targetRangeTitle: "Healthy target ranges",
    targetRangeSubtitle,
    ranges: gender === "male" ? BODY_FAT_RANGES_MALE : BODY_FAT_RANGES_FEMALE,
  };
};
