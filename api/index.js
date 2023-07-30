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

const cacheByDate = {};

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
  console.log("processing", event);

  if (event.path === "/today" || event.path === "/tomorrow") {
    // daily endpoints
    const day =
      event.path === "/today" || event.path === "/daily"
        ? days.TODAY
        : days.TOMORROW;

    if (shouldReload(day)) {
      retrievalTime[day] = new Date();
      responses[day] = await getResponses(day);
    }
    return out(200, responses[day]);
  } else if (event.source === "aws.events") {
    // Scheduled event, go calculate and save tomorrow's data
    const tomorrowData = await getResponses(days.TOMORROW);
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const tomorrowDate = tomorrow.toISOString().substring(0, 10);
    const response = await save(tomorrowDate, tomorrowData);
    console.log(`Saved data for ${tomorrowDate}`, tomorrowData);
  } else if (event.path && event.path.startsWith("/daily/")) {
    // Daily endpoint for a particular day
    const date = event.path.split("/").pop();
    if (!date.match(/\d{4}-\d{2}-\d{2}/)) {
      return out(400, { message: `Invalid date format, expecting YYYY-MM-DD` });
    }
    try {
      const data = await load(date);
      console.log(`Serving item for ${date}`, data);
      return out(200, data);
    } catch (e) {
      console.log(`Error loading for date ${date}`, e);
      return out(404, { error: "Date not found" });
    }
  } else if (event.path && event.path.startsWith("/raid-reports/")) {
    // Raid Report Endpoint
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
    // Unrecognized event
    return out(404, { message: "404" });
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
 * Store the given daily data under the given date
 */
async function save(date, data) {
  const aws = require("aws-sdk");
  const doc = new aws.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.DAILY_TABLE,
    Item: {
      id: date,
      data,
    },
  };

  return doc.put(params).promise();
}

/**
 * Fetch the daily data for the given date
 */
async function load(date) {
  // Serve from cache if possible
  if (cacheByDate[date]) {
    return cacheByDate[date];
  }

  const aws = require("aws-sdk");
  const doc = new aws.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.DAILY_TABLE,
    Key: {
      id: date,
    },
  };

  const response = await doc.get(params).promise();
  const data = response.Item.data;
  cacheByDate[date] = data;

  return data;
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
