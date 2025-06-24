const messages = require("../../constants/messages.json");
const responseCodes = require("../../constants/responseCodes.json");

module.exports = async function (req, res, next) {
  let lang = req.lang;

  if (req.user.role !== "admin")
    return res.status(responseCodes.unAuthorized).send({
      success: false,
      unAuthorized: true,
      message: messages[lang].unAuthorized,
    });

  next();
};
