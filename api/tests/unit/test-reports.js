"use strict";

const reports = require("../../reports.js");
const chai = require("chai");
const { assert } = require("chai");
const expect = chai.expect;

describe("reports", function () {
  it("loads data successfully", async () => {
    // Fail if token is not available
    if (!process.env.GW2_TOKEN) {
      assert.fail("Missing environment variable GW2_TOKEN");
    }
    if (!process.env.DPS_REPORTS_TOKEN) {
      assert.fail("Missing environment variable DPS_REPORTS_TOKEN");
    }

    // 10 second timeout for API call
    this.timeout(10000);

    // Load my upload links
    const uploadLinks = await reports.getRaidUploadLinks(
      process.env.GW2_TOKEN,
      process.env.DPS_REPORTS_TOKEN
    );

    // Expect exactly these four results
    expect(uploadLinks).to.deep.equal([
      "https://dps.report/AQpb-20210809-211242_vg",
      "https://dps.report/m4pk-20210809-212654_gors",
      "https://dps.report/HaRX-20210809-214531_sab",
      "https://dps.report/S8dj-20210813-200401_qpeer",
    ]);
  });
});
