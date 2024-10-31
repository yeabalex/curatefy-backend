const app = require("../../src/index");
const request = require("supertest");


describe("GET /", () => {
    it("should respond with a JSON object containing 'hello': 'world'", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ "hello": "world" });
    });
  });

