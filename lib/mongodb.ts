import "server-only";

import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "blackboard";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

type GlobalMongoCache = {
  clientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as typeof globalThis & {
  __mongo?: GlobalMongoCache;
};

if (!globalForMongo.__mongo) {
  globalForMongo.__mongo = {};
}

function createClientPromise() {
  const client = new MongoClient(uri);
  return client.connect();
}

export const mongoClientPromise =
  globalForMongo.__mongo.clientPromise ?? createClientPromise();

if (!globalForMongo.__mongo.clientPromise) {
  globalForMongo.__mongo.clientPromise = mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await mongoClientPromise;
  return client.db(dbName);
}
