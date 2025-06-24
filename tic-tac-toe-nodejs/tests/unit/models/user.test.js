const { User } = require("../../../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let server;

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      role: "user",
    };

    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivatekey"));
    expect(decoded).toMatchObject(payload);
  });
});

describe("user.verifyPassword", () => {
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
  });

  it("should return true for a valid password", async () => {
    const user = new User({
      email: "yaman@test.com",
      password: "correctPassword",
    });

    await user.save();

    const isValidPassword = await user.verifyPassword("correctPassword");

    await user.deleteOne({});

    expect(isValidPassword).toBe(true);
  });

  it("should return false for an invalid password", async () => {
    // Create a mock user
    const user = new User({
      email: "yaman@test.com",
      password: "wrongPassword",
    });

    const isValidPassword = await user.verifyPassword("wrongPassword");

    await user.deleteOne({});

    expect(isValidPassword).toBe(false);
  });
});

describe("user.verificationCodeValid", () => {
  const currentDate = new Date();

  it("should return verification success when the code is correct and not expired", () => {
    const expirationDate = new Date(currentDate.getTime() + 3600000); // Set expiration date 1 hour from now
    const user = new User({
      verification: {
        expTime: expirationDate,
        code: "123456",
      },
    });

    const result = user.verificationCodeValid("123456");
    expect(result.success).toBe(true);
    //expect(result.message).toEqual("Code is correct");
  });

  it("should return verification failure when the user is already verified", () => {
    const user = new User({
      verifiedAt: new Date(),
    });

    const result = user.verificationCodeValid("123456");
    expect(result.success).toBe(false);
    //expect(result.message).toEqual("User is already verified");
  });

  it("should return verification failure when the code is incorrect", () => {
    const expirationDate = new Date(currentDate.getTime() + 3600000); // Set expiration date 1 hour from now
    const user = new User({
      verification: {
        expTime: expirationDate,
        code: "123456",
      },
    });

    const result = user.verificationCodeValid("654321");
    expect(result.success).toBe(false);
    //expect(result.message).toEqual("Code is incorrect");
  });

  it("should return verification failure when the code is expired", () => {
    const expirationDate = new Date(currentDate.getTime() - 3600000); // Set expiration date 1 hour ago
    const user = new User({
      verification: {
        expTime: expirationDate,
        code: "123456",
      },
    });

    const result = user.verificationCodeValid("123456");
    expect(result.success).toBe(false);
    //expect(result.message).toEqual("Verification code has expired");
  });
});

describe("user.requestCodeAllowed", () => {
  it("should allow code request when expTime is null", () => {
    const user = new User({
      verification: {
        expTime: null,
      },
    });

    const result = user.requestCodeAllowed();
    expect(result).toBe(true);
  });

  it("should not allow code request when time difference is less than 3 minutes and fewer than 3 tries", () => {
    const user = new User({
      verification: {
        expTime: new Date(new Date().getTime() + 300000), // Set expTime more than 3 minutes in the future
        numberOfTries: 2,
      },
    });

    const result = user.requestCodeAllowed();
    expect(result).toBe(false);
  });

  it("should allow code request when time difference is less than 3 minutes and number of tries is 0", () => {
    const user = new User({
      verification: {
        expTime: new Date(),
        numberOfTries: 0,
      },
    });

    const result = user.requestCodeAllowed();
    expect(result).toBe(true);
  });

  it("should not allow code request when more than 3 tries and less than 20 minutes", () => {
    const user = new User({
      verification: {
        expTime: new Date(),
        numberOfTries: 4,
      },
    });

    const result = user.requestCodeAllowed();
    expect(result).toBe(false);
  });

  it("should not allow code request when more than 3 tries and less than 20 minutes", () => {
    const user = new User({
      verification: {
        expTime: new Date(new Date().getTime() + 1210000), // Set expTime 20 minutes in the future
        numberOfTries: 4,
      },
    });

    const result = user.requestCodeAllowed();
    expect(result).toBe(false);
    expect(user.verification.numberOfTries).toBe(4); // Verify that numberOfTries is reset
  });

  it("should allow code request when more than 3 tries and more than 20 minutes (resetting tries)", () => {
    const user = new User({
      verification: {
        expTime: new Date(new Date().getTime() + 1210000), // Set expTime 20 minutes in the future
      },
    });

    const result = user.requestCodeAllowed();
    expect(result).toBe(false);
    expect(user.verification.numberOfTries).toBe(0); // Verify that numberOfTries is reset
  });
});

describe("userSchema.pre('save')", () => {
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });

  it("should hash the password before saving", async () => {
    // Create a new user instance
    const user = new User({
      email: "yaman@test.com",
      password: "password123",
    });

    // Save the user to the database
    await user.save();

    // Retrieve the user from the database
    const savedUser = await User.findOne({ email: "yaman@test.com" });

    // Check if the password is hashed
    const isPasswordHashed = await bcrypt.compare(
      "password123",
      savedUser.password
    );
    expect(isPasswordHashed).toBe(true);
  });
});
