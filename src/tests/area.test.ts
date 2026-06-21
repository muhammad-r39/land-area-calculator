import { describe, expect, it } from "vitest";
import { measurementProfiles } from "../data/measurementProfiles";
import { fromSqft, toSqft } from "../lib/area";

describe("area conversion", () => {
  it("converts decimal to square feet", () => {
    const profile = measurementProfiles[0];
    expect(toSqft(1, "decimal", profile)).toBe(435.6);
  });

  it("uses 33-decimal bigha in standard profile", () => {
    const profile = measurementProfiles.find((item) => item.id === "standard-33-bigha")!;
    expect(toSqft(1, "bigha", profile)).toBe(33 * 435.6);
  });

  it("uses 30-decimal bigha in regional profile", () => {
    const profile = measurementProfiles.find((item) => item.id === "regional-30-bigha")!;
    expect(toSqft(1, "bigha", profile)).toBe(30 * 435.6);
  });

  it("converts square feet back into decimal", () => {
    const profile = measurementProfiles[0];
    expect(fromSqft(435.6, "decimal", profile)).toBe(1);
  });
});
