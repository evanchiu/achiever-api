"use strict";

const strike = require("../../strike.js");
const chai = require("chai");
const expect = chai.expect;

// Hardcode expected values for the current date
const benchmarkDate = new Date("Wed Mar 23 23:15:57 EDT 2022");
const benchmarkStrike = {
  strike: {
    priority_strike: "Boneskinner",
    strike_mission: "Boneskinner",
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
