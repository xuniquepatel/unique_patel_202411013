import request from "supertest";
import app, { boot } from "../server.js";
import { getProducts } from "../config/db.mongo.js";
import { sql } from "../config/db.sql.js";

let srv;
beforeAll(async () => {
  process.env.NODE_ENV = "test";
  srv = await boot();
  const col = getProducts();
  await col.deleteMany({});
  await col.insertMany([
    {
      _id: "p1",
      sku: "SKU1",
      name: "A",
      price: 100,
      category: "X",
      updatedAt: new Date(),
    },
    {
      _id: "p2",
      sku: "SKU2",
      name: "B",
      price: 50,
      category: "X",
      updatedAt: new Date(),
    },
    {
      _id: "p3",
      sku: "SKU3",
      name: "C",
      price: 150,
      category: "Y",
      updatedAt: new Date(),
    },
  ]);
});
afterAll(async () => {
  await sql.end();
  await new Promise((r) => srv.close(r));
});

function prices(res) {
  return res.body.items.map((x) => x.price);
}

test("default desc", async () => {
  const res = await request(app).get("/products").expect(200);
  expect(prices(res)).toEqual([150, 100, 50]);
});
test("override asc", async () => {
  const res = await request(app)
    .get("/products")
    .set("X-Eval-Sort", "asc")
    .expect(200);
  expect(prices(res)).toEqual([50, 100, 150]);
});
