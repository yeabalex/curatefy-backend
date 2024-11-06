const {
  redirect,
} = require("../../../src/controllers/spotify-user-controller");
const requestAccessToken = require("../../../src/services/access-token-auth");
const getProfile = require("../../../src/services/user-profile");
const UserModel = require("../../../src/models/spotify-user-model");

jest.mock("../../../src/services/user-profile");
jest.mock("../../../src/models/spotify-user-model");
jest.mock("../../../src/services/access-token-auth");

describe("redirect function", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      query: {},
      session: {},
    };
    res = {
      redirect: jest.fn(),
      send: jest.fn(),
    };
  });

  it("should redirect to / if there is an error in query params", async () => {
    req.query.error = "access_denied";

    await redirect(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/");
  });

  it("should redirect to /login if state or code is missing", async () => {
    req.query = { state: null, code: null };

    await redirect(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/login");
  });

  //tst
  it("should save user data to session and database if authentication is successful", async () => {
    req.query = { code: "valid_code", state: "valid_state" };

    const mockToken = "mock_access_token";
    const mockUserProfile = {
      display_name: "John Doe",
      email: "johndoe@example.com",
      id: "12345",
      images: [{ url: "https://example.com/image.jpg" }],
    };
    const mockUserData = {
      displayName: mockUserProfile.display_name,
      email: mockUserProfile.email,
      spotifyId: mockUserProfile.id,
      image: mockUserProfile.images[0].url,
    };

    requestAccessToken.mockResolvedValue(mockToken);
    getProfile.mockResolvedValue(mockUserProfile);
    UserModel.findOne.mockResolvedValue(null);
    UserModel.prototype.save = jest.fn();

    await redirect(req, res);

    expect(requestAccessToken).toHaveBeenCalledWith(
      "valid_code",
      "valid_state",
      "http://localhost:3000/redirect"
    );
    expect(getProfile).toHaveBeenCalledWith(mockToken);
    expect(req.session.user).toEqual(mockUserData);
    expect(UserModel.findOne).toHaveBeenCalledWith({
      spotifyId: mockUserProfile.id,
    });
    expect(UserModel.prototype.save).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith("Logged in");
  });

  it("should not save a new user if user already exists in the database", async () => {
    req.query = { code: "valid_code", state: "valid_state" };

    const mockToken = "mock_access_token";
    const mockUserProfile = {
      display_name: "John Doe",
      email: "johndoe@example.com",
      id: "12345",
      images: [{ url: "https://example.com/image.jpg" }],
    };
    const mockUserData = {
      displayName: mockUserProfile.display_name,
      email: mockUserProfile.email,
      spotifyId: mockUserProfile.id,
      image: mockUserProfile.images[0].url,
    };

    requestAccessToken.mockResolvedValue(mockToken);
    getProfile.mockResolvedValue(mockUserProfile);

    UserModel.findOne.mockResolvedValue(mockUserData);

    UserModel.prototype.save = jest.fn();

    await redirect(req, res);

    expect(UserModel.prototype.save).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith("Logged in");
  });

  it("should redirect to /login if an error occurs during authentication", async () => {
    req.query = { code: "invalid_code", state: "invalid_state" };

    requestAccessToken.mockRejectedValue(
      new Error("Request failed with status code 400")
    );

    await redirect(req, res);

    expect(res.send).toHaveBeenCalledWith(
      "Request failed with status code 400"
    );
  });
});
