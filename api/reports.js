const axios = require("axios");

const RAID_BOSSES = new Set([
  "Vale Guardian",
  "Gorseval",
  "Sabetha the Saboteur",
  "Slothasor",
  "Matthias Gabrel",
  "Keep Construct",
  "Xera",
  "Cairn",
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
 * Gets the uploads from dps.report, returns a map of encounter times to upload metadata
 */
async function getUploads(accountName, token, bossSet, page = 1) {
  // Get uploads for this page
  let data;
  try {
    const response = await axios.get(
      `https://dps.report/getUploads?userToken=${token}&page=${page}`
    );
    data = response.data;
  } catch (e) {
    throw new Error("Error reading from dps.report", { cause: e });
  }

  // If this isn't the last page, pull the next page
  let moreUploadsPromise = null;
  if (page < data.pages) {
    moreUploadsPromise = getUploads(accountName, token, bossSet, page + 1);
  }

  // Make a map of encounterTime => upload
  const uploads = {};
  for (const upload of data.uploads) {
    // if it's a success, it's a boss in the set, and the player participated
    if (
      upload.encounter.success &&
      bossSet.has(upload.encounter.boss) &&
      Object.values(upload.players).some(
        (player) => player.display_name === accountName
      )
    ) {
      uploads[upload.encounterTime] = upload;
    }
  }

  // If there are more uploads, await their results and combine
  if (moreUploadsPromise) {
    const moreUploads = await moreUploadsPromise;
    Object.assign(uploads, moreUploads);
  }

  return uploads;
}

/**
 * Get a list of permalinks for successful raids uploaded by the given
 * token in which the given accountName participated
 */
async function getRaidUploadLinks(gw2Token, dpsReportToken) {
  // Get account name from GW2 API https://wiki.guildwars2.com/wiki/API:2/account
  let accountName = "";
  try {
    const response = await axios.get(
      `https://api.guildwars2.com/v2/account?access_token=${gw2Token}`
    );
    accountName = response.data.name;
  } catch (e) {
    throw new Error("Error reading from GW2 API", { cause: e });
  }

  // Get uploads
  const uploads = await getUploads(accountName, dpsReportToken, RAID_BOSSES);

  // Map to just the permalinks
  return Object.values(uploads).map((upload) => upload.permalink);
}

module.exports = {
  getRaidUploadLinks,
};
