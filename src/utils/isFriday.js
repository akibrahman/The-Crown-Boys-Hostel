import moment from "moment-timezone";

export const isFridayInBangladesh = (dateString) => {
  const bangladeshTime = moment.tz(dateString, "MM/DD/YYYY", "Asia/Dhaka");
  return bangladeshTime.day() === 5; // 5 corresponds to Friday in moment.js
};
