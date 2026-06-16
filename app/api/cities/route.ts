import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme";
  return (
    session?.value ===
    crypto.createHash("sha256").update(adminPassword).digest("hex")
  );
}

export async function GET() {
  const cities = await prisma.city.findMany({
    include: {
      _count: {
        select: { listings: { where: { status: "available" } } },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(
    cities.map((c) => ({
      id: c.id,
      name: c.name,
      state: c.state,
      slug: c.slug,
      imageUrl: c.imageUrl,
      availableCount: c._count.listings,
    }))
  );
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, state, slug, imageUrl } = await request.json();
  if (!name || !state || !slug) {
    return NextResponse.json(
      { error: "name, state, and slug are required" },
      { status: 400 }
    );
  }

  const city = await prisma.city.create({
    data: { name, state, slug, imageUrl: imageUrl ?? null },
  });
  return NextResponse.json(city, { status: 201 });
}
