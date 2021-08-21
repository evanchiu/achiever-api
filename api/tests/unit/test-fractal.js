"use strict";

const fractal = require("../../fractal.js");
const chai = require("chai");
const expect = chai.expect;
const dailyAchievements = [
  {
    name: "Daily Tier 1 Deepstone",
  },
  {
    name: "Daily Tier 1 Molten Furnace",
  },
  {
    name: "Daily Tier 1 Siren's Reef",
  },
  {
    name: "Daily Recommended Fractal—Scale 24",
  },
  {
    name: "Daily Recommended Fractal—Scale 35",
  },
  {
    name: "Daily Recommended Fractal—Scale 75",
  },
];
const expectedDaily = [
  { name: "Deepstone", scales: [11, 33, 67, 84] },
  { name: "Molten Furnace", scales: [9, 22, 39, 58, 83] },
  { name: "Siren's Reef", scales: [12, 37, 54, 78] },
];
const expectedRecommended = [
  { name: "Shattered Observatory", scale: 24 },
  { name: "Solid Ocean", scale: 35 },
  { name: "Sunqua Peak", scale: 75 },
];

describe("fractal", function () {
  it("parses fractals", async () => {
    const result = await fractal.getFractals(dailyAchievements);

    expect(result.daily).to.deep.equal(expectedDaily);
    expect(result.recommended).to.be.deep.equal(expectedRecommended);
  });
});
