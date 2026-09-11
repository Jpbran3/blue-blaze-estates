/**
 * One-time cleanup: blank the sensitive columns that are no longer collected —
 * SSN, spouse SSN, driver's licence, spouse driver's licence, and children's
 * names — on applications submitted before those fields were removed from the
 * form.
 *
 * This is DESTRUCTIVE and irreversible. It refuses to run without an explicit
 * confirmation flag so it can never fire from a stray `npm run` or a CI step:
 *
 *   npx tsx prisma/purge-sensitive.ts --dry-run   # show what would change
 *   npx tsx prisma/purge-sensitive.ts --confirm   # actually purge
 *
 * Take a Turso backup first. Once this has run and the owner has confirmed,
 * drop the columns in a follow-up migration.
 */
import { prisma } from "../lib/prisma";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const confirmed = args.includes("--confirm");

async function main() {
  if (!dryRun && !confirmed) {
    console.error(
      "Refusing to run. Pass --dry-run to preview, or --confirm to purge.\n" +
        "Take a Turso backup before using --confirm — this cannot be undone."
    );
    process.exit(1);
  }

  const affected = await prisma.application.findMany({
    where: {
      OR: [
        { ssn: { not: null } },
        { spouseSsn: { not: null } },
        { driversLicense: { not: null } },
        { spouseDriversLicense: { not: null } },
        { childrenResiding: { not: null } },
      ],
    },
    select: {
      id: true,
      applicantName: true,
      createdAt: true,
      ssn: true,
      spouseSsn: true,
      driversLicense: true,
      spouseDriversLicense: true,
      childrenResiding: true,
    },
  });

  if (affected.length === 0) {
    console.log("Nothing to purge — no rows hold SSN, driver's-licence or children's-name data.");
    return;
  }

  console.log(`${affected.length} application(s) hold data to purge:\n`);
  for (const a of affected) {
    const fields = [
      a.ssn ? "ssn" : null,
      a.spouseSsn ? "spouseSsn" : null,
      a.driversLicense ? "driversLicense" : null,
      a.spouseDriversLicense ? "spouseDriversLicense" : null,
      a.childrenResiding ? "childrenResiding" : null,
    ].filter(Boolean);
    console.log(
      `  ${a.id}  ${a.applicantName}  ` +
        `${a.createdAt.toISOString().slice(0, 10)}  [${fields.join(", ")}]`
    );
  }

  if (dryRun) {
    console.log("\nDry run — nothing was changed. Re-run with --confirm.");
    return;
  }

  const result = await prisma.application.updateMany({
    where: { id: { in: affected.map((a) => a.id) } },
    data: {
      ssn: null,
      spouseSsn: null,
      driversLicense: null,
      spouseDriversLicense: null,
      childrenResiding: null,
    },
  });

  console.log(`\nPurged ${result.count} application(s).`);
}

main()
  .catch((err) => {
    console.error("Purge failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
