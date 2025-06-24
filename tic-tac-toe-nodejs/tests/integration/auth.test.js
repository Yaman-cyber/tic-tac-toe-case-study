const request = require("supertest");
const { User } = require("../../models/user.model");
const messages = require("../../helpers/messages.json");

let server;

describe("/api/v1/auth", () => {
  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  describe("POST /login", () => {
    it("should login with valid credentials", async () => {
      const testUser = new User({
        name: "John Doe",
        email: "testuser@example.com",
        password: "correctPassword",
        role: "user",
        verifiedAt: new Date(),
      });

      await testUser.save();

      const response = await request(server).post("/api/v1/auth/login").send({
        email: "testuser@example.com",
        password: "correctPassword",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    it("should not login with invalid credentials", async () => {
      const testUser = new User({
        name: "John Doe",
        email: "testuser@example.com",
        password: "correctPassword",
        role: "user",
        verifiedAt: new Date(),
      });

      await testUser.save();

      const response = await request(server).post("/api/v1/auth/login").send({
        email: "testuser@example.com",
        password: "wrongPassword",
      });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toEqual(messages.en.invalidCredentials);
    });

    it("should not return token if user is not verified", async () => {
      const testUser = new User({
        name: "John Doe",
        email: "testuser@example.com",
        password: "correctPassword",
        role: "user",
      });

      await testUser.save();

      const response = await request(server).post("/api/v1/auth/login").send({
        email: "testuser@example.com",
        password: "correctPassword",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.token).toBeNull();
      expect(response.body.message).toEqual(messages.en.signupSuccess);
    });

    it("should not login if user doesn't exist", async () => {
      const response = await request(server).post("/api/v1/auth/login").send({
        email: "testuser@example.com",
        password: "wrongPassword",
      });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toEqual(messages.en.invalidCredentials);
    });
  });

  describe("POST /signup", () => {
    it("should signup a new user", async () => {
      const userData = {
        email: "testuser@example.com",
        name: "John Doe",
        password: "password123",
        role: "user",
      };

      const response = await request(server)
        .post("/api/v1/auth/signup")
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toEqual(messages.en.signupSuccess);
    });

    it("should fail if email is registered", async () => {
      const testUser = new User({
        name: "John Doe",
        email: "testuser@example.com",
        password: "correctPassword",
        role: "user",
      });

      await testUser.save();

      const userData = {
        email: "testuser@example.com",
        name: "John Doe",
        password: "password123",
        role: "user",
      };

      const response = await request(server)
        .post("/api/v1/auth/signup")
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toBeDefined();
    });
  });

  describe("POST /verify", () => {
    it("should fail if user is not found", async () => {
      const userData = {
        email: "testuser@example.com",
      };

      const response = await request(server)
        .post("/api/v1/auth/verify")
        .send(userData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toEqual(messages.en.noUser);
    });

    it("should fail if code is not valid or expired", async () => {
      const testUser = new User({
        name: "John Doe",
        email: "testuser@example.com",
        password: "correctPassword",
        role: "user",
      });

      await testUser.save();

      const response = await request(server)
        .post("/api/v1/auth/verify")
        .send({ email: testUser.email, code: "any code" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toBeDefined();
    });

    it("should succeed if code is valid and not expired", async () => {
      const testUser = new User({
        name: "John Doe",
        email: "testuser@example.com",
        password: "correctPassword",
        role: "user",
        "verification.code": "12345",
        "verification.expTime": new Date(new Date().getTime() + 5 * 60000),
      });

      await testUser.save();

      const response = await request(server)
        .post("/api/v1/auth/verify")
        .send({ email: testUser.email, code: "12345" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.body.message).toEqual(messages.en.addSuccess);
    });
  });

  describe("POST /request-code", () => {
    it("should return failed with 404 status if user don't exist", async () => {
      const response = await request(server)
        .post("/api/v1/auth/request-code")
        .send({
          email: "nonexistentuser@example.com",
          type: "verify",
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toEqual(messages.en.noUser);
    });

    it("should return failed with 400 if type is verify and user is verified", async () => {
      const user = new User({
        email: "verifieduser@example.com",
        name: "Verified User",
        password: "password123",
        role: "user",
        verifiedAt: new Date(),
        verification: {
          numberOfTries: 0,
        },
      });

      await user.save();

      const response = await request(server)
        .post("/api/v1/auth/request-code")
        .send({
          email: "verifieduser@example.com",
          type: "verify",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toEqual(messages.en.verified);
    });

    it("should return failed with 400 if user is not allowed to send code based on time intervals or maxed number of tries for current interval", async () => {
      const user = new User({
        email: "verifieduser@example.com",
        name: "Verified User",
        password: "password123",
        role: "user",
        verification: {
          numberOfTries: 5,
          expTime: new Date(new Date().getTime() + 5 * 60000),
        },
      });

      await user.save();

      const response = await request(server)
        .post("/api/v1/auth/request-code")
        .send({
          email: "verifieduser@example.com",
          type: "verify",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toEqual(messages.en.tempCantSendCode);
    });

    it("should return success", async () => {
      const user = new User({
        email: "testUser@example.com",
        name: "Test User",
        password: "password123",
        role: "user",
        verification: {
          numberOfTries: 0,
        },
      });

      await user.save();

      const response = await request(server)
        .post("/api/v1/auth/request-code")
        .send({
          email: "testUser@example.com",
          type: "verify",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toEqual(messages.en.codeSent);
    });
  });
});
