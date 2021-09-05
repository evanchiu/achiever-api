const days = require("./days");
const daily = require("./daily");
const strike = require("./strike");
const fractal = require("./fractal");
const { getRaidUploadLinks } = require("./reports");

// global achievements and retrieval times
const retrievalTime = {};
retrievalTime[days.TODAY] = false;
retrievalTime[days.TOMORROW] = false;

const responses = {};
responses[days.TODAY] = false;
responses[days.TOMORROW] = false;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.handler = async (event) => {
  // daily endpoints
  if (event.path === "/today" || event.path === "/tomorrow") {
    const day =
      event.path === "/today" || event.path === "/daily"
        ? days.TODAY
        : days.TOMORROW;

    if (shouldReload(day)) {
      retrievalTime[day] = new Date();
      responses[day] = await getResponses(day);
    }
    return out(200, responses[day]);

    // Raid Report Endpoint
  } else if (event.path.startsWith("/raid-reports/")) {
    console.log(`handling ${event.path}`);
    const segments = event.path.split("/");
    if (segments.length != 4) {
      return out(400, {
        error: "Use path /raid-reports/<gw2 api token>/<dps.reports token>",
      });
    } else {
      const gw2Token = segments[2];
      const dpsReportToken = segments[3];
      try {
        const uploads = await getRaidUploadLinks(gw2Token, dpsReportToken);
        return out(200, uploads);
      } catch (e) {
        console.log(e);
        return out(502, { error: e.message });
      }
    }
  } else {
    return out(400, { message: "404" });
  }
};

/**
 * Get list of achievements by combining GW2 API results with dailyDb
 */
async function getResponses(day) {
  const dailyAchievements = await daily.getAchievements(day);
  const dailyStrike = strike.getStrike(day);
  const dailyFractals = await fractal.getFractals(dailyAchievements);
  return {
    daily: dailyAchievements,
    strike: dailyStrike,
    fractals: dailyFractals,
  };
}

/**
 * We should reload if there's no retrieval time or
 * the last retrieval time was a different date in UTC
 */
function shouldReload(day) {
  const now = new Date();
  return (
    !retrievalTime[day] ||
    now.toISOString().substr(0, 10) !=
      retrievalTime[day].toISOString().substr(0, 10)
  );
}

/**
 * Build lambda response output
 */
function out(statusCode, bodyObject) {
  return {
    statusCode: statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify(bodyObject),
  };
}
