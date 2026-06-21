import type { MeasurementProfile, UnitKey } from "../data/measurementProfiles";

export type BreakdownPart = {
  unit: UnitKey;
  value: number;
  isRemainder?: boolean;
};

export function getUnitSqft(profile: MeasurementProfile, unit: UnitKey): number | undefined {
  return profile.multipliers[unit];
}

export function canUseUnit(profile: MeasurementProfile, unit: UnitKey): boolean {
  return typeof getUnitSqft(profile, unit) === "number";
}

export function toSqft(value: number, unit: UnitKey, profile: MeasurementProfile): number {
  const multiplier = getUnitSqft(profile, unit);

  if (!Number.isFinite(value)) {
    throw new Error("Value must be a valid number.");
  }

  if (!multiplier) {
    throw new Error(`The selected input rule does not define ${unit}.`);
  }

  return value * multiplier;
}

export function fromSqft(sqft: number, unit: UnitKey, profile: MeasurementProfile): number | null {
  const multiplier = getUnitSqft(profile, unit);

  if (!multiplier) return null;

  return sqft / multiplier;
}

export function breakdownSqft(sqft: number, profile: MeasurementProfile): BreakdownPart[] {
  let remaining = Math.max(0, sqft);
  const result: BreakdownPart[] = [];

  profile.breakdownUnits.forEach((unit, index) => {
    const multiplier = getUnitSqft(profile, unit);
    if (!multiplier) return;

    const isLast = index === profile.breakdownUnits.length - 1;
    const value = isLast ? remaining / multiplier : Math.floor(remaining / multiplier);

    result.push({
      unit,
      value,
      isRemainder: isLast,
    });

    if (!isLast) {
      remaining -= value * multiplier;
    }
  });

  return result;
}
