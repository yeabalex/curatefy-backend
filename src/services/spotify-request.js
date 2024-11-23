const axios = require("axios");
const dotenv = require("dotenv");
const AccessToken = require("./access-token");
dotenv.config();

class SpotifyRequest {
  #accessTokenManager;
  #baseUrl = "https://api.spotify.com/v1";
  #market = "US";
  #limit = 5;
  #retryAttempts = 3;
  #retryDelay = 1000; //in ms

  constructor(options = {}) {
    this.#accessTokenManager = new AccessToken();
    if (options.market) this.#setMarket(options.market);
    if (options.limit) this.#setLimit(options.limit);
    if (options.retryAttempts) this.#retryAttempts = options.retryAttempts;
    if (options.retryDelay) this.#retryDelay = options.retryDelay;
  }

  /**
   * Get a valid authentication token
   * @private
   * @returns {Promise<string>} Authentication token
   * @throws {Error} If token retrieval fails
   */
  async #getAuthToken() {
    try {
      const tokenData = await this.#accessTokenManager.getAccessToken();
      if (!tokenData?.access_token) {
        throw new Error("Invalid token data received");
      }
      return tokenData.access_token;
    } catch (err) {
      throw new Error(`Failed to get auth token: ${err.message}`);
    }
  }

  /**
   * Sleep function for retry delay
   * @private
   * @param {number} ms Milliseconds to sleep
   * @returns {Promise<void>}
   */
  async #sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Make an authenticated request to the Spotify API with retry logic
   * @param {string} endpoint API endpoint
   * @param {Object} queryParams Query parameters
   * @returns {Promise<Object>} API response data
   * @throws {Error} If the request fails after all retries
   */
  async makeSpotifyRequest(endpoint, queryParams = {}) {
    let lastError;

    for (let attempt = 1; attempt <= this.#retryAttempts; attempt++) {
      try {
        const token = await this.#getAuthToken();
        const response = await axios.get(`${this.#baseUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            ...queryParams,
            market: this.#market,
            limit: this.#limit,
          },
          validateStatus: (status) => status < 500, //
        });

        if (response.status !== 200) {
          throw new Error(
            response.data.error?.message || `HTTP ${response.status}`
          );
        }

        return response.data;
      } catch (err) {
        lastError = err;

        if (err.response?.status === 401 || err.response?.status === 400) {
          throw new Error(
            err.response.status === 401
              ? "Unauthorized: Invalid token"
              : `Invalid request: ${
                  err.response.data.error?.message || err.message
                }`
          );
        }

        if (attempt === this.#retryAttempts) {
          throw new Error(
            `Request failed after ${this.#retryAttempts} attempts: ${
              err.message
            }`
          );
        }

        await this.#sleep(this.#retryDelay);
      }
    }

    throw lastError;
  }

  /**
   * Set the market for API requests
   * @param {string} market Two-letter country code
   * @returns {this} For method chaining
   */
  #setMarket(market) {
    if (!/^[A-Z]{2}$/.test(market)) {
      throw new Error("Market must be a valid two-letter country code");
    }
    this.#market = market;
    return this;
  }

  /**
   * Set the limit for API requests
   * @param {number} limit Number of items to return (1-50)
   * @returns {this} For method chaining
   */
  #setLimit(limit) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new Error("Limit must be an integer between 1 and 50");
    }
    this.#limit = limit;
    return this;
  }
}

module.exports = SpotifyRequest;
