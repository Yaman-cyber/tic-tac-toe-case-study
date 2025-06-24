const messages = require("../../../../helpers/messages.json");
const admin = require("../../../../middlewares/auth/admin");

describe("Admin middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      user: {
        role: "admin",
      },
      lang: "en", // Set the language as needed for your tests
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next if the user is an admin", () => {
    admin(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if the user is not an admin", () => {
    req.user.role = "user";

    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      unAuthorized: true,
      message: messages[req.lang].unAuthorized,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
