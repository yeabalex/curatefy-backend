const mongoose = require("mongoose");
const checkFollow = require("../../../src/utils/check-if-user-follows-another-user");

jest.mock("../../../src/utils/check-if-user-follows-another-user");

describe("should return 0 if the current user is not following the post creator", async () => {
    const mockModel = {}
});
