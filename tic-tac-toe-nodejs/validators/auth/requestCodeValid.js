const Joi = require("joi");

const { User } = require("../../models/user.model");

const otpType = require("../../enums/otpVerificationTypes.enum");
const { ENGLISH } = require("../../enums/requestLanguage.enum");

const messages = require("../../constants/messages.json");
const mapEnumsValues = require("../../helpers/mapEnumsValues");

module.exports = async function (data, lang = ENGLISH) {
  let result = {};

  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),

    type: Joi.string()
      .valid(...mapEnumsValues(otpType))
      .required(),
  });

  result = schema.validate(data);

  if (result.error) return result;

  const { email, type } = data;

  const user = await User.findOne({ email, deletedAt: null });

  if (!user) {
    result = {
      error: {
        details: [{ message: messages[lang].noUser }],
      },
    };

    return result;
  }

  if (type === otpType.VERIFY && user.verifiedAt) {
    result = {
      error: {
        details: [{ message: messages[lang].verified }],
      },
    };

    return result;
  }

  return result;
};
