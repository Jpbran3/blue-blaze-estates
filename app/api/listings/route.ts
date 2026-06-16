import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const adminPassword = (process.env.ADMIN_PASSWORD ?? "changeme").trim();
  return (
    session?.value ===
    crypto.createHash("sha256").update(adminPassword).digest("hex")
  );
}

function parseImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("cityId");
  const citySlug = searchParams.get("citySlug");
  const status = searchParams.get("status");

  const listings = await prisma.listing.findMany({
    where: {
      ...(cityId && { cityId }),
      ...(citySlug && { city: { slug: citySlug } }),
      ...(status && { status }),
    },
    include: { city: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    listings.map((l) => ({ ...l, images: parseImages(l.images) }))
  );
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cityId, title, description, bedrooms, bathrooms, rentPrice, images, imageUrl, status } =
    await request.json();

  if (!cityId || !title || bedrooms == null || bathrooms == null || rentPrice == null) {
    return NextResponse.json(
      { error: "cityId, title, bedrooms, bathrooms, rentPrice are required" },
      { status: 400 }
    );
  }

  const imageList: string[] = Array.isArray(images) ? images : (imageUrl ? [imageUrl] : []);

  const listing = await prisma.listing.create({
    data: {
      cityId,
      title,
      description: description ?? null,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      rentPrice: Number(rentPrice),
      imageUrl: imageList[0] ?? null,
      images: imageList.length > 0 ? JSON.stringify(imageList) : null,
      status: status ?? "available",
    },
  });

  return NextResponse.json({ ...listing, images: imageList }, { status: 201 });
}
