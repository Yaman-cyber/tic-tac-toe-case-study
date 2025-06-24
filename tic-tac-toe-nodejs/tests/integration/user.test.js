const request = require("supertest");
const { User } = require("../../models/user.model");
const messages = require("../../helpers/messages.json");

let server;

describe("/api/v1/user", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });

  describe("GET /", () => {
    it("should return a list of users with status 200", async () => {
      const testUser = new User({
        name: "Test User",
        email: "testuser@example.com",
        role: "user",
        verifiedAt: new Date(),
      });

      const adminUser = new User({
        name: "Test User",
        email: "testadmin@example.com",
        role: "admin",
        verifiedAt: new Date(),
      });

      await testUser.save();
      await adminUser.save();
      const token = adminUser.generateAuthToken();

      const response = await request(server)
        .get("/api/v1/user")
        .set("x-auth-token", token);

      expect(response.status).toEqual(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(messages["en"].getSuccess);
      //expect(response.body.data).toHaveLength(2);
    });

    it("should return 401 if the user is not authenticated", async () => {
      await request(server).get("/api/v1/user").expect(401);
    });
  });
});
