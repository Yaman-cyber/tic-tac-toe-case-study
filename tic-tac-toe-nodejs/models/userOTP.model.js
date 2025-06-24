const mongoose = require("mongoose");

const otpType = require("../enums/otpVerificationTypes.enum");
const { ENGLISH } = require("../enums/requestLanguage.enum");

const messages = require("../constants/messages.json");
const mapEnumsValues = require("../helpers/mapEnumsValues");

const userOTPSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: mapEnumsValues(otpType),
      default: otpType.VERIFY,
    },

    otp: {
      type: Number,
      required: true,
    },

    email: {
      type: String,
    },

    noOfTimes: {
      type: Number,
      default: 1,
    },

    otpExpireOn: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Check if the otp is valid.
 * @param {string} code - The verification code to check.
 * @param {string} [lang="en"] - The language for error messages (default is "en").
 * @returns {{ success: boolean, message: string }} An object indicating whether the code is valid and an associated message.
 */
userOTPSchema.methods.otpValid = function (code, lang = ENGLISH) {
  const currentDate = new Date();
  const expirationDate = new Date(this.otpExpireOn);

  if (currentDate.getTime() > expirationDate.getTime()) return { success: false, message: messages[lang].codeExpired };

  if (this.otp != code) return { success: false, message: messages[lang].codeError };

  return { success: true, message: messages[lang].codeCorrect };
};

/**
 * Verify that user is allowed to send otp.
 * @returns {boolean} A boolean, true if duration and number of tries is valid, otherwise false.
 */
userOTPSchema.methods.requestOTPallowed = function () {
  const currentDate = new Date();
  const timeDifference = (this.otpExpireOn - currentDate) / 1000; // Calculate time difference in seconds

  if (!this.otpExpireOn) {
    return true;
  }

  // If less than 3 minutes, not allowed
  if (timeDifference > 180) {
    return false;
  }

  // If fewer than 3 tries, allowed
  if (this.noOfTimes <= 3) {
    return true;
  }

  // If more than 3 tries and less than 20 minutes, not allowed
  if (timeDifference > -1200) {
    return false;
  }

  // Reset tries after 20 minutes and allow
  this.noOfTimes = 0;
  return true;
};

const UserOTP = mongoose.model("UserOTP", userOTPSchema);

exports.UserOTP = UserOTP;
