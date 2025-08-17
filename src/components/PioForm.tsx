'use client';

import { useState, useEffect } from "react";

type Pio = {
  id: number;
  tipo: string;
  imageUrl?: string | null;
  creadoEn: string;
};

export default function PioForm() {
  const [tipo, setTipo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [casos, setCasos] = useState<Pio[]>([]);
  const [loading, setLoading] = useState(false);

  // Traer todos los casos
  const fetchCasos = async () => {
    try {
      const res = await fetch("/api/casos");
      const data = await res.json();
      setCasos(data);
    } catch (error) {
      console.error("Error al obtener casos:", error);
    }
  };

  useEffect(() => {
    fetchCasos();
  }, []);

  // Crear nuevo caso
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo) return alert("El campo tipo es obligatorio");

    setLoading(true);
    try {
      const res = await fetch("/api/casos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, imageUrl }),
      });
      const data = await res.json();
      setCasos((prev) => [data, ...prev]);
      setTipo("");
      setImageUrl("");
    } catch (error) {
      console.error("Error al crear caso:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Crear nuevo caso</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="URL de imagen (opcional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Crear"}
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mt-4">Casos existentes</h3>
        {casos.length === 0 ? (
          <p>No hay casos aún.</p>
        ) : (
          <ul className="space-y-2">
            {casos.map((c) => (
              <li key={c.id} className="border p-2 rounded">
                <p><strong>Tipo:</strong> {c.tipo}</p>
                {c.imageUrl && (
                  <img src={c.imageUrl} alt={c.tipo} className="mt-1 max-h-32" />
                )}
                <p className="text-sm text-gray-500">Creado: {new Date(c.creadoEn).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
