type StandardRow = {
  bw: number;
  beginner: number;
  novice: number;
  inter: number;
  adv: number;
  elite: number;
};

export const DEADLIFT_STANDARDS = {
  male: [
    { bw: 50, beginner: 50, novice: 75, inter: 100, adv: 140, elite: 180 },
    { bw: 60, beginner: 65, novice: 90, inter: 120, adv: 160, elite: 200 },
    { bw: 70, beginner: 75, novice: 105, inter: 140, adv: 180, elite: 225 },
    { bw: 80, beginner: 85, novice: 120, inter: 160, adv: 200, elite: 250 },
    { bw: 90, beginner: 95, novice: 130, inter: 175, adv: 220, elite: 270 },
    { bw: 100, beginner: 105, novice: 140, inter: 190, adv: 240, elite: 290 },
    { bw: 110, beginner: 115, novice: 155, inter: 205, adv: 255, elite: 310 },
  ],
  female: [
    { bw: 40, beginner: 25, novice: 45, inter: 65, adv: 90, elite: 120 },
    { bw: 50, beginner: 35, novice: 55, inter: 80, adv: 110, elite: 140 },
    { bw: 60, beginner: 45, novice: 65, inter: 95, adv: 125, elite: 160 },
    { bw: 70, beginner: 50, novice: 75, inter: 105, adv: 140, elite: 175 },
    { bw: 80, beginner: 60, novice: 85, inter: 120, adv: 155, elite: 195 },
  ],
} as const;

export type DeadliftGender = keyof typeof DEADLIFT_STANDARDS;

export type DeadliftScoreResult = {
  oneRepMax: number;
  score: number;
  tier: "T1" | "T2" | "T3" | "T4" | "T5";
  label: string;
};

export function calculateDeadlift(
  liftedWeight: number,
  reps: number,
  userBodyweight: number,
  gender: DeadliftGender,
): DeadliftScoreResult {
  const oneRepMax =
    reps === 1
      ? liftedWeight
      : Math.round(liftedWeight * (1 + reps / 30));

  const table =
    gender === "male" ? DEADLIFT_STANDARDS.male : DEADLIFT_STANDARDS.female;
  const standard = table.reduce((prev, curr) =>
    Math.abs(curr.bw - userBodyweight) < Math.abs(prev.bw - userBodyweight)
      ? curr
      : prev,
  );

  let tier: DeadliftScoreResult["tier"] = "T1";
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

export function getTierLabel(tier: DeadliftScoreResult["tier"]) {
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
