const config = require("config");

module.exports = function () {
  const otpExpireOn = new Date(new Date().getTime() + 5 * 60000);
  let otp = Math.floor(10000 + Math.random() * 90000);

  if (config.get("environment") !== "production") otp = 12345;

  return { otp, otpExpireOn };
};
