import { describe, it, expect } from "vitest";
import { percentageToRating } from "./percentageToRating";

describe("percentageToRating", () => {
  it("100% rating should fall into bucket 5", () => {
    const result = percentageToRating(100.0);

    expect(result).toBe(5);
  });
  it("99.99% rating should fall into bucket 4", () => {
    const result = percentageToRating(99.99);

    expect(result).toBe(4);
  });
  it("85% rating should fall into bucket 4", () => {
    const result = percentageToRating(85.0);

    expect(result).toBe(4);
  });
  it("84.99% should be in bucket 3", () => {
    const result = percentageToRating(84.99);

    expect(result).toBe(3);
  });
  it("70% rating should fall into bucket 3", () => {
    const result = percentageToRating(70.0);

    expect(result).toBe(3);
  });
  it("69.99% rating should fall into bucket 2", () => {
    const result = percentageToRating(69.99);

    expect(result).toBe(2);
  });
  it("50% rating should fall into bucket 2", () => {
    const result = percentageToRating(50.0);

    expect(result).toBe(2);
  });
  it("49.99% rating should fall into bucket 1", () => {
    const result = percentageToRating(49.99);

    expect(result).toBe(1);
  });
});
