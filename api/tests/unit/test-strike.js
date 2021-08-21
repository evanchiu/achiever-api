"use strict";

const strike = require("../../strike.js");
const chai = require("chai");
const expect = chai.expect;

// Hardcode expected values for the current date
const benchmarkDate = new Date("Sun Jun 13 14:05:00 EDT 2021");
const benchmarkStrike = {
  strike: {
    priority_strike: "Shiverpeaks Pass",
    strike_mission: "Shiverpeaks Pass",
  },
  emissary_chest: {
    chest: "Vigil Emissary Chest",
    prophet_crystal: "blue",
  },
};

describe("strike", function () {
  it("returns expected result for benchmark", async () => {
    const resultStrike = strike.getStrikeForDate(benchmarkDate);
    expect(resultStrike).to.deep.equal(benchmarkStrike);
  });
});
