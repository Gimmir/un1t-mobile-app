type StandardRow = {
  bw: number;
  beginner: number;
  novice: number;
  inter: number;
  adv: number;
  elite: number;
};

export const BENCH_STANDARDS = {
  male: [
    { bw: 50, beginner: 30, novice: 45, inter: 60, adv: 85, elite: 110 },
    { bw: 60, beginner: 40, novice: 55, inter: 75, adv: 100, elite: 125 },
    { bw: 70, beginner: 45, novice: 65, inter: 85, adv: 115, elite: 140 },
    { bw: 80, beginner: 50, novice: 75, inter: 100, adv: 130, elite: 160 },
    { bw: 90, beginner: 55, novice: 80, inter: 110, adv: 140, elite: 175 },
    { bw: 100, beginner: 60, novice: 90, inter: 120, adv: 155, elite: 190 },
    { bw: 110, beginner: 65, novice: 95, inter: 130, adv: 165, elite: 200 },
  ],
  female: [
    { bw: 40, beginner: 10, novice: 20, inter: 30, adv: 45, elite: 60 },
    { bw: 50, beginner: 15, novice: 25, inter: 40, adv: 55, elite: 75 },
    { bw: 60, beginner: 20, novice: 35, inter: 50, adv: 65, elite: 85 },
    { bw: 70, beginner: 25, novice: 40, inter: 55, adv: 75, elite: 95 },
    { bw: 80, beginner: 30, novice: 45, inter: 65, adv: 85, elite: 105 },
  ],
} as const;

export type BenchPressGender = keyof typeof BENCH_STANDARDS;

export type BenchPressScoreResult = {
  oneRepMax: number;
  score: number;
  tier: "T1" | "T2" | "T3" | "T4" | "T5";
  label: string;
};

export function calculateBenchPress(
  liftedWeight: number,
  reps: number,
  userBodyweight: number,
  gender: BenchPressGender,
): BenchPressScoreResult {
  const oneRepMax =
    reps === 1
      ? liftedWeight
      : Math.round(liftedWeight * (1 + reps / 30));

  const table =
    gender === "male" ? BENCH_STANDARDS.male : BENCH_STANDARDS.female;
  const standard = table.reduce((prev, curr) =>
    Math.abs(curr.bw - userBodyweight) < Math.abs(prev.bw - userBodyweight)
      ? curr
      : prev,
  );

  let tier: BenchPressScoreResult["tier"] = "T1";
  let score = 0;

  if (oneRepMax >= standard.elite) {
    tier = "T5";
    score = 100;
  } else if (oneRepMax >= standard.adv) {
    tier = "T4";
    score =
      80 +
      ((oneRepMax - standard.adv) / (standard.elite - standard.adv)) * 19;
  } else if (oneRepMax >= standard.inter) {
    tier = "T3";
    score =
      50 +
      ((oneRepMax - standard.inter) / (standard.adv - standard.inter)) * 29;
  } else if (oneRepMax >= standard.novice) {
    tier = "T2";
    score =
      20 +
      ((oneRepMax - standard.novice) / (standard.inter - standard.novice)) * 29;
  } else {
    score = (oneRepMax / standard.novice) * 20;
  }

  return {
    oneRepMax,
    score: Math.round(score),
    tier,
    label: getTierLabel(tier),
  };
}

export function getTierLabel(tier: BenchPressScoreResult["tier"]) {
  switch (tier) {
    case "T1":
      return "Beginner";
    case "T2":
      return "Novice";
    case "T3":
      return "Intermediate";
    case "T4":
      return "Advanced";
    default:
      return "Elite";
  }
}
