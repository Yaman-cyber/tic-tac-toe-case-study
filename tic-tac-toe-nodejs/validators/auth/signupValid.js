const Joi = require("joi");
const { User } = require("../../models/user.model");

const messages = require("../../constants/messages.json");

const { ENGLISH } = require("../../enums/requestLanguage.enum");

module.exports = async function (data, lang = ENGLISH) {
  let result = {};

  const schema = Joi.object({
    email: Joi.string().email().lowercase(),

    name: Joi.string().max(12).optional(),

    password: Joi.string().min(5).max(255).required(),
  });

  result = schema.validate(data);

  if (result.error) return result;
  else {
    let existEmail = await User.findOne({ email: data.email });

    if (existEmail) {
      if (!existEmail.active) {
        result = {
          error: {
            details: [{ message: messages[lang].userSuspended }],
          },
        };

        return result;
      }

      result = {
        error: {
          details: [{ message: messages[lang].emailExist }],
        },
      };

      return result;
    }

    return result;
  }
};
