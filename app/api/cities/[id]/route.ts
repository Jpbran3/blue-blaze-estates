import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/adminAuth";


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name, state, slug, imageUrl } = await request.json();

  const city = await prisma.city.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(state && { state }),
      ...(slug && { slug }),
      imageUrl: imageUrl ?? null,
    },
  });
  return NextResponse.json(city);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.city.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
