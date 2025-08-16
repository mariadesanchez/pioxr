import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { imageUrl, tipo } = await request.json();

    if (!imageUrl || !tipo) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: imageUrl y tipo' },
        { status: 400 }
      );
    }

    const nuevoCaso = await prisma.casos.create({
      data: { imageUrl, tipo },
    });

    return NextResponse.json(nuevoCaso);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al guardar en la base de datos' },
      { status: 500 }
    );
  }
}
