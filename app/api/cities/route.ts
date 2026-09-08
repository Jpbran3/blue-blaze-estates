import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/adminAuth";


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
