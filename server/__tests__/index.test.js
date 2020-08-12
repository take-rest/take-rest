const request = require("supertest");
const { app, server } = require("../index");

beforeAll(() => {
  process.env.NODE_ENV = "test";
  app.listen().close();
});

afterAll(async () => {
  await server.close();
});

test("GET /", async () => {
  db.serialize(async () => {
    seedDb(db);
    const res = await request(app).get("/api");
    const response = [{ name: "Jane", id: 1, age: 1 }];
    expect(res.status).toBe(200);
    expect(res.body).toEqual(response);
  });
});

const seedDb = (db) => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)"
  );
  db.run("DELETE FROM users");
  const stmt = db.prepare("INSERT INTO users (name, age) VALUES (?, ?)");
  stmt.run("Jane", 1);
  stmt.finalize();
};
