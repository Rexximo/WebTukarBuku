import mongoose from "mongoose";
import type { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "../config/env.js";

let memoryServer: MongoMemoryServer | null = null;

export async function connectDatabase(): Promise<void> {
  let uri = env.MONGODB_URI;

  if (env.USE_MEMORY_DB || !uri) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create({
      instance: { dbName: "tukar-buku" },
    });
    uri = memoryServer.getUri("tukar-buku");
    console.log("[db] Menggunakan MongoDB in-memory (USE_MEMORY_DB=true)");
  } else {
    console.log("[db] Menghubungkan ke MongoDB...");
  }

  await mongoose.connect(uri);
  console.log("[db] Terhubung.");
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
