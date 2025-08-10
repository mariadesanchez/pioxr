import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import FormData from 'form-data';

// Desactivar parsing automático del body
export const config = {
  api: {
    bodyParser: false,
  },
};

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
const apiKey = process.env.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

export async function POST(req: NextRequest) {
  // formidable no funciona directamente con NextRequest,
  // así que tenemos que convertirlo a un stream o usar otro enfoque.
  // Aquí una forma para convertir el body a buffer:

  const form = new formidable.IncomingForm();

  // Para usar formidable con Next 13 App Router, tenemos que parsear el raw body:

  const buf = Buffer.from(await req.arrayBuffer());

  return new Promise(async (resolve) => {
    form.parse(
      { headers: req.headers, ...{ on: () => {}, emit: () => {}, readable: true } } as any,
      async (err, fields, files) => {
        if (err) {
          resolve(NextResponse.json({ message: 'Error parsing form' }, { status: 500 }));
          return;
        }

        // Por ahora formidable no funcionará bien, mejor usar otra librería o enfoque.
        // Alternativa más simple: recibí la imagen directamente desde el front y hacé el upload directo desde el front a Cloudinary usando signed upload preset,
        // o hacelo desde el backend con otra librería.

        resolve(NextResponse.json({ message: 'Subida no implementada aún' }, { status: 501 }));
      }
    );
  });
}
