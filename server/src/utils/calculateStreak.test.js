const calculateStreak = require("./calculateStreak");

describe("calculateStreak", () => {

  test("returns 0 for an empty array", () => {
    expect(calculateStreak([])).toBe(0);
  });

  test("returns 3 for three consecutive days ending today", () => {
    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setUTCDate(today.getUTCDate() - 2);

    const entries = [
      { createdAt: today },
      { createdAt: yesterday },
      { createdAt: twoDaysAgo },
    ];

    expect(calculateStreak(entries)).toBe(3);
  });

  test("a gap in the middle stops the count", () => {
    const today = new Date();

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setUTCDate(today.getUTCDate() - 2);

    const entries = [
      { createdAt: today },
      { createdAt: twoDaysAgo },
    ];

    expect(calculateStreak(entries)).toBe(1);
  });

  test("two entries on the same day count as one", () => {
    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    const entries = [
      { createdAt: today },
      { createdAt: today },
      { createdAt: yesterday },
    ];

    expect(calculateStreak(entries)).toBe(2);
  });

  test("wrote yesterday, not today → still counts", () => {
    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setUTCDate(today.getUTCDate() - 2);

    const entries = [
      { createdAt: yesterday },
      { createdAt: twoDaysAgo },
    ];

    expect(calculateStreak(entries)).toBe(2);
  });

  test("wrote neither today nor yesterday → returns 0", () => {
    const today = new Date();

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setUTCDate(today.getUTCDate() - 2);

    const threeDaysAgo = new Date(today);
    threeDaysAgo.setUTCDate(today.getUTCDate() - 3);

    const entries = [
      { createdAt: twoDaysAgo },
      { createdAt: threeDaysAgo },
    ];

    expect(calculateStreak(entries)).toBe(0);
  });

});