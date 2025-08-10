'use client';

import { useState, ChangeEvent } from 'react';

type ImageData = {
  url: string;
  status: 'Normal' | 'Suspected_pulmonary_infarction' | 'Not_evaluable';
  id: number;
};

export default function Page() {
  const [images, setImages] = useState<ImageData[]>([]);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadImage = async (file: File) => {
    if (!cloudName || !uploadPreset) {
      alert('Configura NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en .env.local');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.secure_url) {
        setImages((prev) => [
          ...prev,
          {
            url: data.secure_url,
            status: 'Normal',
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

  const handleStatusChange = (id: number, status: ImageData['status']) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? {
              ...img,
              status,
            }
          : img
      )
    );
  };

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Sube imágenes a Cloudinary</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <div style={{ marginTop: 20 }}>
        {images.map(({ url, status, id }) => (
          <div key={id} style={{ marginBottom: 30 }}>
            <img src={url} alt="uploaded" style={{ maxWidth: '100%', borderRadius: 8 }} />
            <div style={{ marginTop: 10 }}>
              <label>
                <input
                  type="radio"
                  name={`status-${id}`}
                  value="Normal"
                  checked={status === 'Normal'}
                  onChange={() => handleStatusChange(id, 'Normal')}
                />
                Normal
              </label>
              <label style={{ marginLeft: 15 }}>
                <input
                  type="radio"
                  name={`status-${id}`}
                  value="Suspected_pulmonary_infarction"
                  checked={status === 'Suspected_pulmonary_infarction'}
                  onChange={() => handleStatusChange(id, 'Suspected_pulmonary_infarction')}
                />
                Suspected pulmonary infarction
              </label>
              <label style={{ marginLeft: 15 }}>
                <input
                  type="radio"
                  name={`status-${id}`}
                  value="Not_evaluable"
                  checked={status === 'Not_evaluable'}
                  onChange={() => handleStatusChange(id, 'Not_evaluable')}
                />
                Not evaluable
              </label>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

