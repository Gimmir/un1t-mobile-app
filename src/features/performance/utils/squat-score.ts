type StandardRow = {
  bw: number;
  beginner: number;
  novice: number;
  inter: number;
  adv: number;
  elite: number;
};

export const SQUAT_STANDARDS = {
  male: [
    { bw: 50, beginner: 35, novice: 55, inter: 80, adv: 110, elite: 145 },
    { bw: 60, beginner: 45, novice: 70, inter: 100, adv: 130, elite: 170 },
    { bw: 70, beginner: 55, novice: 85, inter: 115, adv: 150, elite: 190 },
    { bw: 80, beginner: 65, novice: 95, inter: 130, adv: 170, elite: 215 },
    { bw: 90, beginner: 70, novice: 105, inter: 145, adv: 185, elite: 235 },
    { bw: 100, beginner: 80, novice: 115, inter: 160, adv: 205, elite: 255 },
    { bw: 110, beginner: 85, novice: 125, inter: 170, adv: 220, elite: 270 },
  ],
  female: [
    { bw: 40, beginner: 15, novice: 30, inter: 45, adv: 65, elite: 90 },
    { bw: 50, beginner: 25, novice: 40, inter: 60, adv: 85, elite: 110 },
    { bw: 60, beginner: 30, novice: 50, inter: 75, adv: 100, elite: 130 },
    { bw: 70, beginner: 35, novice: 60, inter: 85, adv: 115, elite: 150 },
    { bw: 80, beginner: 40, novice: 65, inter: 95, adv: 130, elite: 165 },
  ],
} as const;

export type SquatGender = keyof typeof SQUAT_STANDARDS;

export type SquatScoreResult = {
  oneRepMax: number;
  score: number;
  tier: "T1" | "T2" | "T3" | "T4" | "T5";
  label: string;
};

export function calculateSquatScore(
  liftedWeight: number,
  reps: number,
  userBodyweight: number,
  gender: SquatGender,
): SquatScoreResult {
  const oneRepMax =
    reps === 1
      ? liftedWeight
      : Math.round(liftedWeight * (1 + reps / 30));

  const table = gender === "male" ? SQUAT_STANDARDS.male : SQUAT_STANDARDS.female;
  const standard = table.reduce((prev, curr) =>
    Math.abs(curr.bw - userBodyweight) < Math.abs(prev.bw - userBodyweight)
      ? curr
      : prev,
  );

  let tier: SquatScoreResult["tier"] = "T1";
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

export function getTierLabel(tier: SquatScoreResult["tier"]) {
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
