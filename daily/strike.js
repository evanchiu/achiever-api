const days = require("./days");

const msPerDay = 1000 * 60 * 60 * 24;
const msPerWeek = msPerDay * 7;

// Strike is based on modulus of days since baseline
// https://wiki.guildwars2.com/index.php?title=Template:Daily_Strike_Mission&action=edit
const STRIKE_BASELINE_DATE = new Date("2021/04/01 00:00 UTC");

const STRIKES = [
  {
    priority_strike: "Fraenir of Jormag",
    strike_mission: "Fraenir of Jormag",
  },
  {
    priority_strike: "Shiverpeaks Pass",
    strike_mission: "Shiverpeaks Pass",
  },
  {
    priority_strike: "Voice of the Fallen and Claw of the Fallen",
    strike_mission: "Voice of the Fallen and Claw of the Fallen",
  },
  {
    priority_strike: "Voice in the Frozen Deep",
    strike_mission: "Whisper of Jormag",
  },
  {
    priority_strike: "Boneskinner",
    strike_mission: "Boneskinner",
  },
  {
    priority_strike: "Cold War",
    strike_mission: "Cold War",
  },
];

// Emissary chest is based on modulus of days since baseline
// https://wiki.guildwars2.com/index.php?title=Template:Emissary%20chests%20rotation&action=edit
const EMISSARY_BASELINE_DATE = new Date("March 16, 2020 07:30 UTC");

const EMISSARY_CHESTS = [
  {
    chest: "Priory Emissary Chest",
    prophet_crystal: "green",
  },
  {
    chest: "Vigil Emissary Chest",
    prophet_crystal: "blue",
  },
  {
    chest: "Whispers Emissary Chest",
    prophet_crystal: "red",
  },
];

/**
 * Calculate the day's strikes
 */
function getStrike(day) {
  // Set reference date for today or tomorrow
  let referenceDate = new Date();
  if (day != days.TODAY) {
    referenceDate = new Date(referenceDate.getTime() + msPerDay);
  }

  return getStrikeForDate(referenceDate);
}

function getStrikeForDate(referenceDate) {
  const msSinceStrikeBaseline =
    referenceDate.getTime() - STRIKE_BASELINE_DATE.getTime();
  const strikeIndex =
    Math.floor(msSinceStrikeBaseline / msPerDay) % STRIKES.length;

  const msSinceChestBaseline =
    referenceDate.getTime() - EMISSARY_BASELINE_DATE.getTime();
  const chestIndex =
    Math.floor(msSinceChestBaseline / msPerWeek) % EMISSARY_CHESTS.length;

  return {
    strike: STRIKES[strikeIndex],
    emissary_chest: EMISSARY_CHESTS[chestIndex],
  };
}

module.exports = {
  getStrike,
  getStrikeForDate,
};
