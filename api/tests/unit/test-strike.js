"use strict";

const strike = require("../../strike.js");
const chai = require("chai");
const expect = chai.expect;

// Hardcode expected values for the current date
const benchmarkDate = new Date("Tue Feb  7 22:40:31 EST 2023");
const benchmarkStrike = {
  strike: {
    priority_strike: "Shiverpeaks Pass",
    strike_mission: "Shiverpeaks Pass",
  },
  cantha_strike: {
    priority_strike: "Harvest Temple",
    strike_mission: "Harvest Temple",
  },
};

describe("strike", function () {
  it("returns expected result for benchmark", async () => {
    const resultStrike = strike.getStrikeForDate(benchmarkDate);
    expect(resultStrike).to.deep.equal(benchmarkStrike);
  });
});
