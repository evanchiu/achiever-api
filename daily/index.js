const days = require("./days");
const daily = require("./daily");

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
  const day = event.path === "/today" ? days.TODAY : days.TOMORROW;

  if (shouldReload(day)) {
    retrievalTime[day] = new Date();
    responses[day] = await getResponses(day);
  }

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify(responses[day]),
  };
};

/**
 * Get list of achievements by combining GW2 API results with dailyDb
 */
async function getResponses(day) {
  const dailyAchievements = await daily.getAchievements(day);
  return {
    daily: dailyAchievements,
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
