'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";

type ImageData = {
  url: string;
  status: 'Normal' | 'Suspected_pulmonary_infarction' | 'Not_evaluable';
  id: number;
};

export default function Page() {
  const { data: session, status } = useSession();
  const [images, setImages] = useState<ImageData[]>([]);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (status === "loading") return <p>Cargando sesión...</p>;

  if (!session) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>No autorizado</h1>
        <button onClick={() => signIn()}>Iniciar sesión</button>
      </div>
    );
  }

  const uploadImage = async (file: File) => {
    if (!cloudName || !uploadPreset) {
      alert('Configura variables en .env');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.secure_url) {
      setImages(prev => [...prev, {
        url: data.secure_url,
        status: 'Normal',
        id: Date.now() + Math.random(),
      }]);
    } else {
      alert("Error al subir");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadImage(e.target.files[0]);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Sube imágenes a Cloudinary</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div style={{ marginTop: 20 }}>
        {images.map(({ url, status, id }) => (
          <div key={id} style={{ marginBottom: 30 }}>
            <img src={url} alt="uploaded" style={{ maxWidth: '100%', borderRadius: 8 }} />
          </div>
        ))}
      </div>
    </main>
  );
}

