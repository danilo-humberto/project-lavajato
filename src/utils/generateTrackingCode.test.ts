import { describe, expect, it } from "vitest";
import { generateTrackingCode } from "./generateTrackingCode";

describe("generateTrackingCode", () => {
  it("generates a Lava+ tracking code with twelve uppercase alphanumeric characters", () => {
    expect(generateTrackingCode()).toMatch(/^LAVA-[A-Z0-9]{12}$/);
  });
});
