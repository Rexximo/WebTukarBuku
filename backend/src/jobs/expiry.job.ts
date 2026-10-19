import { env } from "../config/env.js";
import { expireOverdueRequests } from "../services/swap.service.js";

export function startExpiryJob(): () => void {
  const run = () => {
    expireOverdueRequests()
      .then((count) => {
        if (count > 0) {
          console.log(`[expiry] ${count} permintaan kedaluwarsa diproses.`);
        }
      })
      .catch((error) => {
        console.error("[expiry] Gagal memproses permintaan kedaluwarsa:", error);
      });
  };

  run();
  const timer = setInterval(run, env.EXPIRY_CHECK_INTERVAL_MS);
  timer.unref();

  return () => clearInterval(timer);
}

