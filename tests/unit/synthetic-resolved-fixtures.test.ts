import { describe, expect, it } from "vitest";

import { syntheticResolvedQualityCaseFixtures } from "../../src/lib/quality-case/synthetic-resolved-fixtures";

describe("fixture Memori Kualitas sintetis", () => {
  it("menyediakan tiga kasus resolved lengkap untuk M4 tanpa menjadi retrieval", () => {
    expect(syntheticResolvedQualityCaseFixtures.map((fixture) => fixture.label)).toEqual([
      "SYNTHETIC \u2014 QC-001",
      "SYNTHETIC \u2014 QC-002",
      "SYNTHETIC \u2014 QC-003",
    ]);

    for (const fixture of syntheticResolvedQualityCaseFixtures) {
      expect(fixture.problem).not.toHaveLength(0);
      expect(fixture.evidence.length).toBeGreaterThan(0);
      expect(fixture.contributingCauses.length).toBeGreaterThan(0);
      expect(fixture.workingRootCause).not.toHaveLength(0);
      expect(fixture.correctiveActions.length).toBeGreaterThan(0);
      for (const cause of fixture.contributingCauses) {
        expect(cause.evidenceIndexes.length).toBeGreaterThan(0);
        for (const index of cause.evidenceIndexes) {
          expect(fixture.evidence[index]).toBeDefined();
        }
      }
    }
  });
});
