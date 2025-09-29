import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || ""

if (!MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.warn("MONGODB_URI is not set. API routes depending on Mongo will fail.")
}

let cached = (global as any).mongoose
if (!cached) {
  cached = (global as any).mongoose = { conn: null as any, promise: null as any }
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set")
  }
  
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => mongooseInstance)
  }
  cached.conn = await cached.promise
  return cached.conn
}


