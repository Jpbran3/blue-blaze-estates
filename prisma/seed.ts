import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear old data
  await prisma.listing.deleteMany();
  await prisma.city.deleteMany();
  console.log("Cleared existing cities and listings.");

  // Seed property groups
  const mobileHomePark = await prisma.city.create({
    data: {
      name: "Blue Blaze Mobile Home Park",
      state: "IL",
      slug: "blue-blaze-mobile-home-park",
      imageUrl: "/images/blue-blaze-mobile-home-park.jpg",
    },
  });
  console.log(`Seeded property group: ${mobileHomePark.name}`);

  // Sample available listing (owner adds/edits real units in the admin dashboard)
  await prisma.listing.create({
    data: {
      cityId: mobileHomePark.id,
      title: "2BR Mobile Home — Blue Blaze Mobile Home Park",
      description:
        "Comfortable 2-bedroom mobile home in a quiet community in Herrin, IL. Central air, off-street parking, and a peaceful setting focused on quiet living.",
      bedrooms: 2,
      bathrooms: 1,
      rentPrice: 650,
      imageUrl: null,
      status: "available",
    },
  });
  console.log("Seeded sample listing in Blue Blaze Mobile Home Park");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
