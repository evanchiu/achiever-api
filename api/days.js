const TODAY = 0;
const TOMORROW = 1;
module.exports = {
  TODAY,
  TOMORROW,
  isDay: function (day) {
    return day === TODAY || day === TOMORROW;
  },
};
