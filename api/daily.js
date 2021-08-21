const axios = require("axios");
const fs = require("fs");
const path = require("path");
const days = require("./days");

// API endpoints for today and tomorrow
const gw2api = {};
gw2api[days.TODAY] =
  "https://api.guildwars2.com/v2/achievements/daily?v=2019-05-16T00:00:00.000Z";
gw2api[days.TOMORROW] =
  "https://api.guildwars2.com/v2/achievements/daily/tomorrow?v=2019-05-16T00:00:00.000Z";

// Global dailyDb, load lazily
let dailyDb;

/**
 * Load dailyDb from disk
 */
function loadDailyDb() {
  const basePath = process.env.LAMBDA_TASK_ROOT || ".";
  const dbPath = path.join(basePath, "daily-db.json");
  dailyDb = JSON.parse(fs.readFileSync(dbPath, { encoding: "utf8" }));
}

/**
 * Get list of achievements by combining GW2 API results with dailyDb
 */
async function getAchievements(day) {
  // Ensure dailyDb is loaded
  if (!dailyDb) {
    loadDailyDb();
  }

  // Load list of daily achievements
  const daily = (await axios.get(gw2api[day])).data;

  // Query achievement details
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


module.exports = {
  getAchievements,
};
