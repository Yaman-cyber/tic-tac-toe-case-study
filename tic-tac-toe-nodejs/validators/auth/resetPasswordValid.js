const Joi = require("joi");

const { User } = require("../../models/user.model");
const { UserOTP } = require("../../models/userOTP.model");

const otpType = require("../../enums/otpVerificationTypes.enum");
const { ENGLISH } = require("../../enums/requestLanguage.enum");

const messages = require("../../constants/messages.json");

module.exports = async function (data, lang = ENGLISH) {
  let result = {};

  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),

    otp: Joi.number().required(),

    password: Joi.string().min(5).max(255).required(),
  });

  result = schema.validate(data);

  if (result.error) return result;

  const { email, otp } = data;

  const user = await User.findOne({ email, deletedAt: null });

  if (!user) {
    result = {
      error: {
        details: [{ message: messages[lang].noUser }],
      },
    };

    return result;
  }

  const userOTP = await UserOTP.findOne({ email, type: otpType.PASSWORD });

  if (!userOTP) {
    result = {
      error: {
        details: [{ message: messages[lang].noRecord }],
      },
    };

    return result;
  }

  const { success, message } = userOTP.otpValid(otp, lang);

  if (!success) {
    result = {
      error: {
        details: [{ message }],
      },
    };

    return result;
  }

  result.user = user;
  result.userOTP = userOTP;

  return result;
};
