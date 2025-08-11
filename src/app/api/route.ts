import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  console.log("Recibido:", body);

  // Aquí podrías llamar a Cloudinary desde el backend si quieres seguridad total
  return NextResponse.json({ success: true });
}
