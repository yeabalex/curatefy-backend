const getProfile = require("../../src/services/user-profile");

global.fetch = jest.fn();

describe("getProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return profile data on successful request", async () => {
    const mockResponse = {
      display_name: "Mock User",
      email: "mockuser@example.com",
      id: "mockedSpotifyId",
      images: [{ url: "https://example.com/mock-image.jpg" }],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const accessToken = "mockedAccessToken";
    const profileData = await getProfile(accessToken);

    expect(profileData).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  });

  test("should throw an error for unsuccessful request", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: jest.fn().mockResolvedValue("Not Found"),
    });

    await expect(getProfile("mockedAccessToken")).rejects.toThrow(
      "Spotify API error: Not Found"
    );
  });

  test("should throw an error if fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    await expect(getProfile("mockedAccessToken")).rejects.toThrow(
      "Network Error"
    );
  });
});
