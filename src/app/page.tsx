'use client';

import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

type ImageData = {
  url: string;
  id: number;
};

export default function UploadPage() {
  const { data: session, status } = useSession();
  const [images, setImages] = useState<ImageData[]>([]);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadImage = async (file: File) => {
    if (!cloudName || !uploadPreset) {
      alert('Configura las variables NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en .env.local');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'pioxr');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('Respuesta Cloudinary:', data);

      if (res.ok && data.secure_url) {
        setImages((prev) => [
          ...prev,
          {
            url: data.secure_url,
            id: Date.now() + Math.random(),
          },
        ]);
      } else {
        alert('Error al subir la imagen');
      }
    } catch (error) {
      alert('Error en la conexión con Cloudinary');
      console.error(error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadImage(e.target.files[0]);
    }
  };

  if (status === 'loading') {
    return <p>Cargando sesión...</p>;
  }

  if (!session) {
    return (
      <main style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
        <h1>Por favor, inicia sesión para subir imágenes</h1>
        <button onClick={() => signIn()}>Iniciar sesión</button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Sube imágenes a Cloudinary en carpeta &quot;pioxr&quot;</h1>
      <button onClick={() => signOut({ callbackUrl: '/' })} style={{ marginBottom: 20 }}>
        Cerrar sesión
      </button>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <div style={{ marginTop: 20 }}>
        {images.map(({ url, id }) => (
          <div key={id} style={{ marginBottom: 30 }}>
            <Image
              src={url}
              alt="Imagen subida"
              width={600}
              height={400}
              style={{ borderRadius: 8 }}
              priority={false}
            />
          </div>
        ))}
      </div>
    </main>
  );
}


