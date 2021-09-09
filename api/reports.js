const axios = require("axios");

const RAID_BOSSES = new Set([
  "Vale Guardian",
  "Gorseval",
  "Sabetha the Saboteur",
  "Slothasor",
  "Matthias Gabrel",
  "Keep Construct",
  "Xera",
  "Cairn the Indomitable",
  "Mursaat Overseer",
  "Samarog",
  "Deimos",
  "Soulless Horror",
  "Dhuum",
  "Conjured Amalgamate",
  "Twin Largos",
  "Qadim",
  "Cardinal Adina",
  "Cardinal Sabir",
  "Qadim the Peerless",
]);

/**
 * Gets the uploads from dps.report,
 * filters for successful encounters against the given boss set,
 * returns a map of encounter times to upload metadata
 */
async function getUploads(token, bossSet) {
  // Get uploads for the first page
  let data;
  let responses;
  try {
    const response = await axios.get(
      `https://dps.report/getUploads?userToken=${token}&page=1`
    );
    data = response.data;
    responses = [response];
  } catch (e) {
    throw new Error("Error reading from dps.report", { cause: e });
  }

  // If there are other pages, parallel fetch the rest
  if (data.pages > 1) {
    try {
      const pagePromises = [];
      for (let i = 2; i < data.pages; i++) {
        pagePromises.push(
          axios.get(
            `https://dps.report/getUploads?userToken=${token}&page=${i}`
          )
        );
      }
      responses.push(...(await Promise.all(pagePromises)));
    } catch (e) {
      throw new Error("Error reading from dps.report", { cause: e });
    }
  }

  // Make a map of encounterTime => upload
  const uploads = {};
  for (const response of responses) {
    for (const upload of response.data.uploads) {
      // if it's a success and it's a boss in the set
      if (upload.encounter.success && bossSet.has(upload.encounter.boss)) {
        uploads[upload.encounterTime] = upload;
      }
    }
  }

  return uploads;
}

/**
 * Fetches the account name via the GW2 API
 */
async function getAccountName(token) {
  // Get account name from GW2 API https://wiki.guildwars2.com/wiki/API:2/account
  let accountName = "";
  try {
    const response = await axios.get(
      `https://api.guildwars2.com/v2/account?access_token=${token}`
    );
    accountName = response.data.name;
  } catch (e) {
    throw new Error("Error reading from GW2 API", { cause: e });
  }
  return accountName;
}

/**
 * Get a list of permalinks for successful raids uploaded by the given
 * token in which the given accountName participated
 */
async function getRaidUploadLinks(gw2Token, dpsReportToken) {
  // Parallel fetch account name and uploads
  const [accountName, uploads] = await Promise.all([
    getAccountName(gw2Token),
    getUploads(dpsReportToken, RAID_BOSSES),
  ]);

  // Filter for uploads the account participated in, map to just the permalinks
  return Object.values(uploads)
    .filter((upload) =>
      Object.values(upload.players).some(
        (player) => player.display_name === accountName
      )
    )
    .map((upload) => upload.permalink);
}

module.exports = {
  getRaidUploadLinks,
};
