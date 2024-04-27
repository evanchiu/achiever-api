const { getRaidUploadLinks } = require("./reports");

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
  if (event.path && event.path.startsWith("/raid-reports/")) {
    // Raid Report Endpoint
    console.log(`handling ${event.path}`);
    const segments = event.path.split("/");
    if (segments.length != 4) {
      return out(400, {
        error: "Use path /raid-reports/<gw2 api token>/<dps.report token>",
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
