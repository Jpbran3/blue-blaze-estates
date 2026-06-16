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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const imageList: string[] | undefined = Array.isArray(body.images)
    ? body.images
    : undefined;

  const listing = await prisma.listing.update({
    where: { id },
    data: {
      ...(body.cityId && { cityId: body.cityId }),
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.bedrooms != null && { bedrooms: Number(body.bedrooms) }),
      ...(body.bathrooms != null && { bathrooms: Number(body.bathrooms) }),
      ...(body.rentPrice != null && { rentPrice: Number(body.rentPrice) }),
      ...(body.status && { status: body.status }),
      ...(imageList !== undefined && {
        images: imageList.length > 0 ? JSON.stringify(imageList) : null,
        imageUrl: imageList[0] ?? null,
      }),
    },
  });

  let parsedImages: string[] = [];
  try {
    parsedImages = listing.images ? JSON.parse(listing.images) : [];
  } catch {
    parsedImages = [];
  }

  return NextResponse.json({ ...listing, images: parsedImages });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
