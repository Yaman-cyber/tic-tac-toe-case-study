const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

const userAuthSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    password: {
      type: String,
    },
  },
  { timestamps: true }
);

/**
 * Verify the user's password.
 * @param {string} password - The password to verify.
 * @returns {Promise<boolean>} A promise that resolves to true if the password is valid, otherwise false.
 */
userAuthSchema.methods.verifyPassword = async function (password) {
  const validPassword = await bcrypt.compare(password, this.password);

  if (!validPassword) return false;
  return true;
};

/**
 * A middleware that hashes the user password if changed
 */
userAuthSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    const salt = bcrypt.genSaltSync(saltRounds);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
  } else {
    next();
  }
});

const UserAuthDetails = mongoose.model("UserAuthDetails", userAuthSchema);

exports.UserAuthDetails = UserAuthDetails;
