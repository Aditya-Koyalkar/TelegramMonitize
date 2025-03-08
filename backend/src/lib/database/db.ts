import mongoose, { type ConnectOptions } from "mongoose";
import { MONGODB_URI } from "../env.js";

if (!MONGODB_URI) {
  throw new Error("Please Define Mongo Db environment variable inside .envs");
}

interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function db(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    console.log("Mongoose connection already exists");
    return cached.conn;
  }
  if (!cached.promise) {
    console.log("New mongoose connection is established");
    const opts: ConnectOptions = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default db;
