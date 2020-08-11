const request = require("supertest");
const { app } = require("../index");

beforeAll(() => {
  process.env.NODE_ENV = "test";
});

test("GET /", async () => {
  const res = await request(app).get("/");
  const response = { message: "Hello world!!!" };
  expect(res.status).toBe(200);
  expect(res.body).toEqual(response);
});
