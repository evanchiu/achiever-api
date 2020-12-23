const fs = require("fs");
const path = require("path");

// Global fractalDb, load lazily
let fractalDb;

/**
 * Load fractalDb from disk
 */
function loadFractalDb() {
  const basePath = process.env.LAMBDA_TASK_ROOT || ".";
  const dbPath = path.join(basePath, "fractal-db.json");
  fractalDb = JSON.parse(fs.readFileSync(dbPath, { encoding: "utf8" }));
}

/**
 * Parse the fractal details from the daily achievements
 */
async function getFractals(dailyAchievements) {
  // Ensure fractalDb is loaded
  if (!fractalDb) {
    loadFractalDb();
  }

  // Get names of the daily fractals from their Daily Tier 1 achievements
  const dailyFractalNames = dailyAchievements
    .filter((a) => a.name && a.name.match(/Daily Tier 1/))
    .map((a) => a.name.replace("Daily Tier 1 ", ""));

  // Add in the scales they're available on
  const daily = dailyFractalNames.map((name) => {
    const scales = fractalDb
      .filter((fractal) => name === fractal.fractal)
      .map((fractal) => fractal.level);
    return { name, scales };
  });

  // Get the scales of recommended fractals
  const recommendedFractalScales = dailyAchievements
    .filter((a) => a.name && a.name.match(/Daily Recommended Fractal/))
    .map((a) =>
      parseInt(a.name.replace("Daily Recommended Fractal—Scale ", ""))
    );

  // Add in the names
  const recommended = recommendedFractalScales.map((scale) => {
    const name = fractalDb.find((fractal) => scale === fractal.level).fractal;
    return { name, scale };
  });

  return { daily, recommended };
}

module.exports = {
  getFractals,
};
