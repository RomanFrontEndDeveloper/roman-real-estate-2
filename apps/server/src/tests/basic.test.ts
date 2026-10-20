import { describe, expect, it } from "vitest";

describe("Roman Real Estate 2 — перший тест", () => {
  it("перевіряє, що ціна оголошення додатна", () => {
    const price = 100_000;

    expect(price).toBeGreaterThan(0);
  });

  it("перевіряє, що назва проєкту правильна", () => {
    const projectName = "Roman Real Estate 2";

    expect(projectName).toBe("Roman Real Estate 2");
  });
});
