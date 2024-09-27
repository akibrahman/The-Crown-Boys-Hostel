export const getCurrentDateInBangladesh = () => {
  const bangladeshDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
  });
  return new Date(bangladeshDate).getDate();
};
