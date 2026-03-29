import "server-only";

import { MongoClient, type Db } from "mongodb";

const dbName = process.env.MONGODB_DB ?? "blackboard";
const envMongoUri = process.env.MONGODB_URI;
const mongoUri: string | null = envMongoUri ?? null;

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
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }
  const client = new MongoClient(mongoUri);
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
