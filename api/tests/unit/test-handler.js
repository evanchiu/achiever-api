"use strict";

const lambda = require("../../index.js");
const chai = require("chai");
const expect = chai.expect;
let dailyResult = {};
let tomorrowResult = {};

describe("daily", function () {
  it("verifies successful /today response", async () => {
    const result = (dailyResult = await lambda.handler(
      { path: "/today" }
    ));

    expect(result).to.be.an("object");
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("string");

    let response = JSON.parse(result.body);

    expect(response.daily).to.be.an("array");
    expect(response.strike).to.be.an("object");
    expect(response.fractals).to.be.an("object");
    expect(response.daily.length).to.be.greaterThan(0);
  });

  it("verifies successful /today cached response", async () => {
    await lambda.handler({ path: "/today" });
    const start = new Date();
    const result = await lambda.handler({ path: "/today" });
    const end = new Date();

    const elapsed = end.getTime() - start.getTime();

    expect(elapsed).to.be.lessThan(3);
    expect(result).to.deep.equal(dailyResult);
  });

  it("verifies successful /tomorrow response", async () => {
    const result = (tomorrowResult = await lambda.handler(
      { path: "/tomorrow" },
      context
    ));

    expect(result).to.be.an("object");
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("string");

    let response = JSON.parse(result.body);

    expect(response.daily).to.be.an("array");
    expect(response.strike).to.be.an("object");
    expect(response.fractals).to.be.an("object");
    expect(response.daily.length).to.be.greaterThan(0);
  });

  it("verifies successful /tomorrow cached response", async () => {
    await lambda.handler({ path: "/tomorrow" });
    const start = new Date();
    const result = await lambda.handler({ path: "/tomorrow" });
    const end = new Date();

    const elapsed = end.getTime() - start.getTime();

    expect(elapsed).to.be.lessThan(3);
    expect(result).to.deep.equal(tomorrowResult);
  });
});
