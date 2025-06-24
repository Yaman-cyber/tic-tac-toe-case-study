const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const { UserAuthMetadata } = require("./userAuthMetaData.model");
const { UserAuthDetails } = require("./userAuthDetails.model");

const otpVerificationTypes = require("../enums/otpVerificationTypes.enum");

const eventsNames = require("../constants/events.json");
const eventEmitter = require("../helpers/event");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, unique: true },

    name: { type: String, default: null },

    dateOfBirth: { type: Date },

    deletedAt: { type: Date, default: null },

    active: { type: Boolean, default: true },

    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/*################# Add methods for each instance #################*/

/**
 * Generate an authentication token for the user.
 * @returns {string} The generated authentication token.
 */
userSchema.methods.generateAuthToken = async function (req) {
  const token = jwt.sign(
    { _id: this._id },
    config.get("jwtPrivatekey")
    // { expiresIn: "30d" }
  );

  const ip = (req.headers && req.headers["x-forwarded-for"]) || (req.socket && req.socket.remoteAddress) || "0.0.0.0";
  const agent = (req.headers && req.headers["user-agent"]) || "Unknown";

  // Storing token in user meta
  let userMeta = new UserAuthMetadata({
    authToken: token,
    user: this.id,
    ip: ip,
    agent,
  });

  await userMeta.save();

  return token;
};

/**
 * Verify the user's password.
 * @param {string} password - The password to verify.
 * @returns {Promise<boolean>} A promise that resolves to true if the password is valid, otherwise false.
 */
userSchema.methods.verifyPassword = async function (password) {
  const authMetaData = await UserAuthDetails.findOne({ user: this._id });

  if (!authMetaData) return false;

  return await authMetaData.verifyPassword(password);
};

/*################# Add middlewares to handle behaviors based on some changes #################*/

//New account send email to verify
userSchema.pre("save", function (next) {
  if (this.isNew) {
    eventEmitter.emit(eventsNames.email.sendSignup, this.email);
    eventEmitter.emit(eventsNames.statistic.incUsers);
  }

  next();
});

//Requested new code
userSchema.pre("save", function (next) {
  if (!this.isModified("verification.code")) return next();
  else {
    if (this.verification.code && !this.isNew)
      this.verification.verificationType === otpVerificationTypes.VERIFY
        ? eventEmitter.emit(eventsNames.email.sendSignup, this.email)
        : eventEmitter.emit(eventsNames.email.forgotPassword, this.email);
  }

  next();
});

const User = mongoose.model("User", userSchema);

exports.User = User;
