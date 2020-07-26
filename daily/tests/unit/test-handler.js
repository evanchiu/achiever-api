"use strict";

const daily = require("../../daily.js");
const chai = require("chai");
const expect = chai.expect;
var event, context;

describe("daily", function () {
  it("verifies successful response", async () => {
    const result = await daily.handler(event, context);

    expect(result).to.be.an("object");
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("string");

    let response = JSON.parse(result.body);

    expect(response).to.be.an("array");
    expect(response.length).to.be.greaterThan(0);
  });
});
