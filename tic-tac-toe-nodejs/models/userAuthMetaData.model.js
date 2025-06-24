const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const winston = require("winston");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    authToken: {
      type: String,
      unique: true,
    },

    ip: {
      type: String,
    },

    agent: { type: String },

    lastLoggedInAt: {
      type: Date,
      default: () => Date.now(),
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * A function that will verify the user auth token
 * @param {string} token
 * @returns {Promise<User || null>} the user document or null
 */
schema.statics.findByToken = async function (token) {
  const { User } = require("./user.model");

  const tokenInfo = await this.findOne({
    authToken: token,
    deletedAt: null,
  });

  if (!tokenInfo) return null;

  tokenInfo.lastLoggedInAt = new Date();
  await tokenInfo.save();

  try {
    const decode = jwt.verify(token, config.get("jwtPrivatekey"));

    const userInfo = await User.findById(decode._id);

    return userInfo;
  } catch (error) {
    winston.error(`Error in findByToken`, error);

    return null;
  }
};

const UserAuthMetadata = mongoose.model("userAuthMetadata", schema);

exports.UserAuthMetadata = UserAuthMetadata;
