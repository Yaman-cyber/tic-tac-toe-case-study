const mongoose = require("mongoose");

const { User } = require("../../../models/user.model");
const { UserOTP } = require("../../../models/userOTP.model");
const { UserAuthDetails } = require("../../../models/userAuthDetails.model");

const validate = require("../../../validators/auth");

const { VERIFY } = require("../../../enums/otpVerificationTypes.enum");

const messages = require("../../../constants/messages.json");
const eventsNames = require("../../../constants/events.json");
const responseCodes = require("../../../constants/responseCodes.json");

const generateCode = require("../../../helpers/generateCode");
const eventEmitter = require("../../../helpers/event");
const { UserAuthMetadata } = require("../../../models/userAuthMetaData.model");

exports.logIn = async (req, res, next) => {
  const { lang, body } = req;

  const { error, user } = await validate.loginValid(body, lang);

  if (error) {
    res.code = responseCodes.badRequest;
    res.data = null;
    res.message = error.details[0].message;
    return next();
  }

  const token = user.verifiedAt ? await user.generateAuthToken(req) : null;
  const data = user.toObject();
  data.token = token;

  res.code = responseCodes.success;
  res.data = data;
  res.message = !token ? messages[lang].verifyAccountFirst : messages[lang].logInSuccess;
  return next();
};

exports.signup = async (req, res, next) => {
  const { lang, body } = req;
  const { email, name, password } = body;

  const { error } = await validate.signupValid(body, lang);

  if (error) {
    res.code = responseCodes.badRequest;
    res.message = error.details[0].message;
    return next();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const user = new User({
    email,
    name: name || email.split("@")[0],
  });

  const userAuth = new UserAuthDetails({ user: user._id, password });

  const { otp, otpExpireOn } = generateCode();

  await user.save({ session });
  await userAuth.save({ session });
  await UserOTP.findOneAndUpdate({ email: user.email }, { $set: { noOfTimes: 0, otp, otpExpireOn, type: VERIFY } }, { new: true, upsert: true, session });

  await session.commitTransaction();
  session.endSession();

  res.data = user;
  res.code = responseCodes.success;
  res.message = messages[lang].signupSuccess;

  eventEmitter.emit(eventsNames.email.verifyOTP, { email, otp, type: VERIFY });

  return next();
};

exports.verify = async (req, res, next) => {
  const { lang, body } = req;

  const { error, user } = await validate.verifyOTPValid(body, lang);

  if (error) {
    res.code = responseCodes.badRequest;
    res.message = error.details[0].message;
    return next();
  }

  user.verifiedAt = new Date();
  await user.save();

  const data = user.toObject();
  const token = await user.generateAuthToken(req);
  data.token = token;

  res.data = data;
  res.message = messages[lang].codeCorrect;
  res.code = responseCodes.success;
  return next();
};

exports.requestCode = async (req, res, next) => {
  const { lang, body } = req;
  const { email, type } = body;

  const { error } = await validate.requestCodeValid(body, lang);

  if (error) {
    res.code = responseCodes.badRequest;
    res.message = error.details[0].message;
    return next();
  }

  const { otp, otpExpireOn } = generateCode();

  let userOTP = await UserOTP.findOne({ email });

  if (!userOTP) {
    userOTP = await UserOTP.findOneAndUpdate({ email }, { $set: { noOfTimes: 0, otp, otpExpireOn, type } }, { new: true, upsert: true });

    eventEmitter.emit(eventsNames.email.verifyOTP, { email, otp, type });

    res.code = responseCodes.success;
    res.message = messages[lang].codeSent;
    return next();
  }

  if (!userOTP.requestOTPallowed()) {
    res.code = responseCodes.badRequest;
    res.message = messages[lang].tempCantSendCode;
    return next();
  }

  userOTP.otp = otp;
  userOTP.otpExpireOn = otpExpireOn;
  userOTP.noOfTimes++;
  userOTP.type = type;
  await userOTP.save();

  eventEmitter.emit(eventsNames.email.verifyOTP, { email, otp, type });

  res.code = responseCodes.success;
  res.message = messages[lang].codeSent;
  return next();
};

exports.resetPassword = async (req, res, next) => {
  const { lang, body } = req;
  const { password } = body;

  const { error, user, userOTP } = await validate.resetPasswordValid(body, lang);

  if (error) {
    res.code = responseCodes.badRequest;
    res.message = error.details[0].message;
    return next();
  }

  let userAuth = await UserAuthDetails.findOne({ user: user._id });
  if (!userAuth) userAuth = new UserAuthDetails({ user: user._id });

  userAuth.password = password;
  await userAuth.save();
  await userOTP.deleteOne();

  res.code = responseCodes.success;
  res.message = messages[lang].updateSuccess;
  return next();
};

exports.autoLogin = async (req, res, next) => {
  const { lang, user, token } = req;

  res.code = responseCodes.success;
  res.data = { ...user.toObject(), token };
  res.message = messages[lang].getSuccess;
  return next();
};

exports.logOut = async (req, res, next) => {
  const { lang, user, token } = req;

  await UserAuthMetadata.findOneAndUpdate({ user: user._id, authToken: token }, { $set: { deletedAt: new Date() } }, { new: true });

  res.code = responseCodes.success;
  res.message = messages[lang].logOutSuccess;
  return next();
};
