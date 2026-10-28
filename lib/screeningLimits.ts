import { countAttempt } from "./rateLimit";

const DAY_SECONDS = 24 * 60 * 60;

/** Positive integer from the environment, or the fallback when unset or invalid. */
export function envLimit(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

/** Public application submissions allowed per client IP per hour. */
export function submitLimitPerHour(): number {
  return envLimit("APPLICATION_SUBMIT_LIMIT_PER_HOUR", 10);
}

/**
 * Site-wide ceiling on paid screening calls per day. Per-IP limits do not stop
 * a spammer rotating addresses; this bounds the worst-case Anthropic bill.
 * Fails closed: if the counter is unavailable the application is still saved
 * and left for manual review.
 */
export async function claimScreeningSlot(check = countAttempt): Promise<boolean> {
  try {
    const result = await check("screening:daily", envLimit("SCREENING_DAILY_CAP", 200), DAY_SECONDS);
    return result.allowed;
  } catch {
    console.error("Screening cap check failed; skipping screening.");
    return false;
  }
}
