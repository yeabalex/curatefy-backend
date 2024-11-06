const axios = require("axios");
const requestAccessToken = require("../../src/services/access-token-auth");

jest.mock("axios");

describe("requestAccessToken", () => {
  const code = "mockedCode";
  const state = "mockedState";
  const redirectUri = "http://localhost:3000/redirect";
  const tokenResponse = { access_token: "mockedAccessToken" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw an error if state is null", async () => {
    await expect(requestAccessToken(code, null, redirectUri)).rejects.toThrow(
      "State mismatch error"
    );
  });

  test("should return access token on successful request", async () => {
    axios.post.mockResolvedValue({ data: tokenResponse });

    const accessToken = await requestAccessToken(code, state, redirectUri);
    expect(accessToken).toEqual("mockedAccessToken");
    expect(axios.post).toHaveBeenCalledWith(
      "https://accounts.spotify.com/api/token",
      expect.any(String),
      expect.objectContaining({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: expect.stringContaining("Basic "),
        },
      })
    );
  });

  test("should throw an error on failed request", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));

    await expect(requestAccessToken(code, state, redirectUri)).rejects.toThrow(
      "Network Error"
    );
  });
});
