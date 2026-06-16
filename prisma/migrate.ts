import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;
const client = createClient({ url, authToken });

const newColumns = [
  "presentAddress TEXT",
  "townStateZip TEXT",
  "ssn TEXT",
  "driversLicense TEXT",
  "birthDate TEXT",
  "employer TEXT",
  "employerAddress TEXT",
  "employerTownStateZip TEXT",
  "employerPhone TEXT",
  "employmentDuration TEXT",
  "monthlyWages TEXT",
  "previousEmployer TEXT",
  "spouseName TEXT",
  "spouseDriversLicense TEXT",
  "spouseBirthDate TEXT",
  "spouseSsn TEXT",
  "spouseEmployer TEXT",
  "spouseEmployerAddress TEXT",
  "spouseEmployerTownStateZip TEXT",
  "spouseEmployerPhone TEXT",
  "spouseEmploymentDuration TEXT",
  "spouseMonthlyWages TEXT",
  "spousePreviousEmployer TEXT",
  "childrenResiding TEXT",
  "adultsResiding TEXT",
  "currentLandlord TEXT",
  "currentLandlordPhone TEXT",
  "currentTenancyDuration TEXT",
  "currentRentAmount TEXT",
  "previousLandlord TEXT",
  "previousLandlordPhone TEXT",
  "previousAddressRented TEXT",
  "previousRentAmount TEXT",
  "felonyHistory TEXT",
  "electronicSignature TEXT",
  "signatureDate TEXT",
];

async function main() {
  for (const col of newColumns) {
    const colName = col.split(" ")[0];
    try {
      await client.execute(`ALTER TABLE Application ADD COLUMN "${colName}" TEXT`);
      console.log(`Added column: ${colName}`);
    } catch {
      console.log(`Skipped: ${colName} (already exists)`);
    }
  }
  console.log("Migration complete!");
  client.close();
}

main().catch(console.error);
