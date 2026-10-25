import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./db/connect.js";
import { startExpiryJob } from "./jobs/expiry.job.js";

async function main(): Promise<void> {
  await connectDatabase();

  if (env.SEED_ON_START) {
    const { seedDatabase } = await import("./scripts/seed-data.js");
    const result = await seedDatabase();
    console.log(
      `[seed] Data contoh dimuat: ${result.users} pengguna, ${result.books} buku, ${result.requests} permintaan.`
    );
  }

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(
      `[api] FestivalTukarBuku API berjalan di http://localhost:${env.PORT}`
    );
  });

  const stopExpiryJob = startExpiryJob();

  const shutdown = async () => {
    console.log("[api] Menghentikan server...");
    stopExpiryJob();
    server.close();
    await disconnectDatabase();
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void shutdown();
  });
  process.on("SIGTERM", () => {
    void shutdown();
  });
}

main().catch((error) => {
  console.error("[api] Gagal menjalankan server:", error);
  process.exit(1);
});
