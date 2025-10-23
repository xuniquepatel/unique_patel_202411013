import { MongoClient } from "mongodb";
import { MONGO_URL } from "./env.js";

let client, db, products;

export async function initMongo() {
  client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db("ecomdb"); // <— choose your DB name here
  products = db.collection("products");
  await products.createIndex({ sku: 1 }, { unique: true });
  await products.createIndex({ category: 1 });
  await products.createIndex({ updatedAt: -1 });
  return { db, products };
}

export function getProducts() {
  return products;
}
