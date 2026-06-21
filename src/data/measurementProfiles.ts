export type UnitKey =
  | "sqft"
  | "sqm"
  | "decimal"
  | "shotangsho"
  | "ojutangsho"
  | "acre"
  | "bigha"
  | "katha"
  | "chotak"
  | "kani"
  | "gonda"
  | "kora"
  | "kranti"
  | "til";

export type ProfileKind = "standard" | "bigha" | "kani";

export type UnitMeta = {
  key: UnitKey;
  label: string;
  labelBn: string;
  shortLabel: string;
};

export type MeasurementProfile = {
  id: string;
  title: string;
  subtitle: string;
  kind: ProfileKind;
  priority: number;
  sourceStatus: "source-backed" | "regional-common" | "needs-more-sources";
  assumptions: string[];
  multipliers: Partial<Record<UnitKey, number>>;
  breakdownUnits: UnitKey[];
  highlightedUnits: UnitKey[];
};

export const SQFT_PER_DECIMAL = 435.6;
export const SQFT_PER_ACRE = 43560;
export const SQFT_PER_SQM = 10.7639104167097;

export const unitMeta: Record<UnitKey, UnitMeta> = {
  sqft: { key: "sqft", label: "Square feet", labelBn: "বর্গফুট", shortLabel: "sq ft" },
  sqm: { key: "sqm", label: "Square meter", labelBn: "বর্গমিটার", shortLabel: "sq m" },
  decimal: { key: "decimal", label: "Decimal", labelBn: "ডেসিমেল", shortLabel: "decimal" },
  shotangsho: { key: "shotangsho", label: "Shotangsho", labelBn: "শতাংশ", shortLabel: "shotangsho" },
  ojutangsho: { key: "ojutangsho", label: "Ojutangsho", labelBn: "অযুতাংশ", shortLabel: "ojutangsho" },
  acre: { key: "acre", label: "Acre", labelBn: "একর", shortLabel: "acre" },
  bigha: { key: "bigha", label: "Bigha", labelBn: "বিঘা", shortLabel: "bigha" },
  katha: { key: "katha", label: "Katha", labelBn: "কাঠা", shortLabel: "katha" },
  chotak: { key: "chotak", label: "Chotak", labelBn: "ছটাক", shortLabel: "chotak" },
  kani: { key: "kani", label: "Kani", labelBn: "কানি", shortLabel: "kani" },
  gonda: { key: "gonda", label: "Gonda", labelBn: "গন্ডা", shortLabel: "gonda" },
  kora: { key: "kora", label: "Kora", labelBn: "কড়া", shortLabel: "kora" },
  kranti: { key: "kranti", label: "Kranti / Kontho", labelBn: "ক্রান্তি / কণ্ঠ", shortLabel: "kranti" },
  til: { key: "til", label: "Til", labelBn: "তিল", shortLabel: "til" },
};

const coreMultipliers: Record<"sqft" | "sqm" | "decimal" | "shotangsho" | "ojutangsho" | "acre", number> = {
  sqft: 1,
  sqm: SQFT_PER_SQM,
  decimal: SQFT_PER_DECIMAL,
  shotangsho: SQFT_PER_DECIMAL,
  ojutangsho: SQFT_PER_DECIMAL / 100,
  acre: SQFT_PER_ACRE,
};

function bighaUnits(decimalsPerBigha: number) {
  const bigha = decimalsPerBigha * SQFT_PER_DECIMAL;
  const katha = bigha / 20;
  const chotak = katha / 16;

  return {
    bigha,
    katha,
    chotak,
  };
}

function kaniUnitsFromSqft(kani: number) {
  const gonda = kani / 20;
  const kora = gonda / 4;
  const kranti = kora / 3;
  const til = kranti / 20;

  return {
    kani,
    gonda,
    kora,
    kranti,
    til,
  };
}

export const measurementProfiles: MeasurementProfile[] = [
  {
    id: "standard-33-bigha",
    title: "Standard/common 33-decimal Bigha",
    subtitle: "Shown first. Uses 1 Bigha = 33 Decimal and 20 Katha = 1 Bigha.",
    kind: "standard",
    priority: 1,
    sourceStatus: "source-backed",
    assumptions: [
      "1 Decimal = 1 Shotangsho = 435.6 square feet.",
      "1 Bigha = 33 Decimal.",
      "20 Katha = 1 Bigha.",
      "This profile uses the decimal-based result: 33 × 435.6 = 14,374.8 sq ft per Bigha.",
    ],
    multipliers: {
      ...coreMultipliers,
      ...bighaUnits(33),
    },
    breakdownUnits: ["bigha", "katha", "chotak"],
    highlightedUnits: ["decimal", "sqft", "sqm", "acre", "bigha", "katha"],
  },
  {
    id: "regional-30-bigha",
    title: "Regional 30-decimal Bigha",
    subtitle: "For areas where 30 Shotangsho/Decimal is treated as 1 Bigha.",
    kind: "bigha",
    priority: 2,
    sourceStatus: "regional-common",
    assumptions: [
      "1 Bigha = 30 Decimal.",
      "20 Katha = 1 Bigha.",
      "This is included as a regional/local variant.",
    ],
    multipliers: {
      ...coreMultipliers,
      ...bighaUnits(30),
    },
    breakdownUnits: ["bigha", "katha", "chotak"],
    highlightedUnits: ["bigha", "katha", "decimal", "sqft"],
  },
  {
    id: "kani-40-decimal",
    title: "40-decimal Kani",
    subtitle: "Uses 1 Kani = 40 Decimal, with Gonda/Kora/Kranti/Til breakdown.",
    kind: "kani",
    priority: 3,
    sourceStatus: "source-backed",
    assumptions: [
      "1 Kani = 40 Decimal.",
      "1 Kani = 20 Gonda.",
      "1 Gonda = 4 Kora.",
      "1 Kora = 3 Kranti.",
      "1 Kranti = 20 Til.",
    ],
    multipliers: {
      ...coreMultipliers,
      ...kaniUnitsFromSqft(40 * SQFT_PER_DECIMAL),
    },
    breakdownUnits: ["kani", "gonda", "kora", "kranti", "til"],
    highlightedUnits: ["kani", "gonda", "kora", "decimal", "sqft"],
  },
  {
    id: "kani-120-decimal",
    title: "120-decimal Kani",
    subtitle: "Uses the formula for 120 Decimal = 1 Kani.",
    kind: "kani",
    priority: 4,
    sourceStatus: "source-backed",
    assumptions: [
      "1 Kani = 120 Decimal.",
      "1 Kani = 20 Gonda.",
      "1 Gonda = 4 Kora.",
      "1 Kora = 3 Kranti.",
      "1 Kranti = 20 Til.",
    ],
    multipliers: {
      ...coreMultipliers,
      ...kaniUnitsFromSqft(120 * SQFT_PER_DECIMAL),
    },
    breakdownUnits: ["kani", "gonda", "kora", "kranti", "til"],
    highlightedUnits: ["kani", "gonda", "kora", "decimal", "sqft"],
  },
  {
    id: "kani-8-hat-nol",
    title: "8-hat-nol Kani",
    subtitle: "Uses 1 Kani = 17,280 sq ft, as listed for 8-hat-nol measurement.",
    kind: "kani",
    priority: 5,
    sourceStatus: "source-backed",
    assumptions: [
      "1 Kani = 17,280 square feet.",
      "1 Kani = 20 Gonda.",
      "1 Gonda = 4 Kora.",
      "1 Kora = 3 Kranti/Kontho.",
      "1 Kranti = 20 Til.",
    ],
    multipliers: {
      ...coreMultipliers,
      ...kaniUnitsFromSqft(17280),
    },
    breakdownUnits: ["kani", "gonda", "kora", "kranti", "til"],
    highlightedUnits: ["kani", "gonda", "kora", "decimal", "sqft"],
  },
];

export const allUnitKeys = Object.keys(unitMeta) as UnitKey[];
