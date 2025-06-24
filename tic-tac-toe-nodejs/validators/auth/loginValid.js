const Joi = require("joi");

const { User } = require("../../models/user.model");

const { ENGLISH } = require("../../enums/requestLanguage.enum");

const messages = require("../../constants/messages.json");

module.exports = async function (data, lang = ENGLISH) {
  let result = {};

  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),

    password: Joi.string().min(5).max(255).required(),
  });

  result = schema.validate(data);

  if (result.error) return result;

  const { email, password } = data;

  const user = await User.findOne({ email, deletedAt: null });

  if (!user) {
    result = {
      error: {
        details: [{ message: messages[lang].noUser }],
      },
    };

    return result;
  }

  if (!user.active) {
    result = {
      error: {
        details: [{ message: messages[lang].userSuspended }],
      },
    };
    return result;
  }

  const validPassword = await user.verifyPassword(password);

  if (!validPassword) {
    result = {
      error: {
        details: [{ message: messages[lang].invalidCredentials }],
      },
    };

    return result;
  }

  result.user = user;

  return result;
};
