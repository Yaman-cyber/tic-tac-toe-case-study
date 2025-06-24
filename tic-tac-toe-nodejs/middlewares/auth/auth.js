const { UserAuthMetadata } = require("../../models/userAuthMetaData.model");

const responseCodes = require("../../constants/responseCodes.json");
const messages = require("../../constants/messages.json");

module.exports = async function (req, res, next) {
  let lang = req.lang;
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(responseCodes.unAuthorized).send({
      success: false,
      unAuthorized: true,
      message: messages[lang].unAuthorized,
    });

  const user = await UserAuthMetadata.findByToken(token);

  if (!user)
    return res.status(responseCodes.unAuthorized).send({
      success: false,
      unAuthorized: true,
      message: messages[lang].invalidToken,
    });

  req.token = token;
  req.user = user;
  next();
};
