const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Days available
const TODAY = 0;
const TOMORROW = 1;

const gw2api = [
  "https://api.guildwars2.com/v2/achievements/daily?v=2019-05-16T00:00:00.000Z",
  "https://api.guildwars2.com/v2/achievements/daily/tomorrow?v=2019-05-16T00:00:00.000Z",
];

// load dailydb from disk
const basePath = process.env.LAMBDA_TASK_ROOT || ".";
const dbPath = path.join(basePath, "dailydb.json");
const dailyDb = JSON.parse(fs.readFileSync(dbPath, { encoding: "utf8" }));

// global achievements and retrieval times
let retrievalTime = [false, false];
let achievements = [false, false];

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.handler = async (event, context) => {
  const day = event.path === "/daily" ? TODAY : TOMORROW;

  if (shouldReload(day)) {
    retrievalTime[day] = new Date();
    achievements[day] = await getAchievements(day);
  }

  const response = {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify(achievements[day]),
  };

  return response;
};

/**
 * Get list of achivements by combining GW2 API results with dailyDb
 */
async function getAchievements(day) {
  // Load list of daily achievements
  const daily = (await axios.get(gw2api[day])).data;

  // Query achivement details
  const ids = Object.keys(daily)
    .map((key) => daily[key].map((a) => a.id))
    .flat();
  const idString = ids.join(",");

  const details = (
    await axios.get(
      `https://api.guildwars2.com/v2/achievements?ids=${idString}`
    )
  ).data;

  // Details don't provide icon if it's the base PVE icon
  const defaultIcon = {
    icon:
      "https://render.guildwars2.com/file/483E3939D1A7010BDEA2970FB27703CAAD5FBB0F/42684.png",
  };

  // Combine data into achievements array
  return Object.keys(daily)
    .map((key) =>
      daily[key].map((a) =>
        Object.assign(
          {},
          a,
          { mode: key },
          defaultIcon,
          details.find((d) => d.id === a.id),
          dailyDb[a.id]
        )
      )
    )
    .flat();
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
