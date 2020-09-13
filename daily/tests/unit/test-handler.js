"use strict";

const daily = require("../../daily.js");
const chai = require("chai");
const expect = chai.expect;
let context = {};
let dailyResult = {};
let tomorrowResult = {};

describe("daily", function () {
  it("verifies successful /daily response", async () => {
    const result = (dailyResult = await daily.handler(
      { path: "/daily" },
      context
    ));

    expect(result).to.be.an("object");
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("string");

    let response = JSON.parse(result.body);

    expect(response).to.be.an("array");
    expect(response.length).to.be.greaterThan(0);
  });

  it("verifies successful /daily cached response", async () => {
    await daily.handler({ path: "/daily" }, context);
    const start = new Date();
    const result = await daily.handler({ path: "/daily" }, context);
    const end = new Date();

    const elapsed = end.getTime() - start.getTime();

    expect(elapsed).to.be.lessThan(3);
    expect(result).to.deep.equal(dailyResult);
  });

  it("verifies successful /daily/tomorrow response", async () => {
    const result = (tomorrowResult = await daily.handler(
      { path: "/daily/tomorrow" },
      context
    ));

    expect(result).to.be.an("object");
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("string");

    let response = JSON.parse(result.body);

    expect(response).to.be.an("array");
    expect(response.length).to.be.greaterThan(0);
  });

  it("verifies successful /daily/tomorrow cached response", async () => {
    await daily.handler({ path: "/daily/tomorrow" }, context);
    const start = new Date();
    const result = await daily.handler({ path: "/daily/tomorrow" }, context);
    const end = new Date();

    const elapsed = end.getTime() - start.getTime();

    expect(elapsed).to.be.lessThan(3);
    expect(result).to.deep.equal(tomorrowResult);
  });
});
