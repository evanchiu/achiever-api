const days = require("./days");

const msPerDay = 1000 * 60 * 60 * 24;

// Strike is based on modulus of days since baseline
// https://wiki.guildwars2.com/index.php?title=Template:Daily_Strike_Mission&action=edit
const STRIKE_BASELINE_DATE = new Date("2022/02/28 00:00 UTC");

const STRIKES = [
  {
    priority_strike: "Boneskinner",
    strike_mission: "Boneskinner",
  },
  {
    priority_strike: "Cold War",
    strike_mission: "Cold War",
  },
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
];

const CANTHA_STRIKES = [
  {
    priority_strike: "Harvest Temple",
    strike_mission: "Harvest Temple",
  },
  {
    priority_strike: "Old Lion's Court",
    strike_mission: "Old Lion's Court",
  },
  {
    priority_strike: "Aetherblade Hideout",
    strike_mission: "Aetherblade Hideout",
  },
  {
    priority_strike: "Xunlai Jade Junkyard",
    strike_mission: "Xunlai Jade Junkyard",
  },
  {
    priority_strike: "Kaineng Overlook",
    strike_mission: "Kaineng Overlook",
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
  const canthaStrikeIndex =
    Math.floor(msSinceStrikeBaseline / msPerDay) % CANTHA_STRIKES.length;

  return {
    strike: STRIKES[strikeIndex],
    cantha_strike: CANTHA_STRIKES[canthaStrikeIndex]
  };
}

module.exports = {
  getStrike,
  getStrikeForDate,
};
