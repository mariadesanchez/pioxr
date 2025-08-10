"use client";
import { useState } from "react";

const categories = ["Normal", "Suspected_pulmonary_infarction", "Not_evaluable"];

// Solo las imágenes del 1 al 17
const images = Array.from({ length: 17 }, (_, i) => `${i + 1}.jpg`);

const correctCategories: Record<string, string> = {
  "1.jpg": "Not_evaluable",
  "2.jpg": "Not_evaluable",
  "3.jpg": "Not_evaluable",
  "4.jpg": "Suspected_pulmonary_infarction",
  "5.jpg": "Suspected_pulmonary_infarction",
  "6.jpg": "Suspected_pulmonary_infarction",
  "7.jpg": "Suspected_pulmonary_infarction",
  "8.jpg": "Suspected_pulmonary_infarction",
  "9.jpg": "Suspected_pulmonary_infarction",
  "10.jpg": "Suspected_pulmonary_infarction",
  "11.jpg": "Suspected_pulmonary_infarction",
  // Asumamos que del 12 al 17 son "Normal"
  "12.jpg": "Normal",
  "13.jpg": "Normal",
  "14.jpg": "Normal",
  "15.jpg": "Normal",
  "16.jpg": "Normal",
  "17.jpg": "Normal",
};

export default function HomePage() {
  const [userInfo, setUserInfo] = useState({ country: "", years: "", specialty: "" });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  const handleSelect = (filename: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [filename]: value }));
  };

  const handleSubmit = async () => {
    if (!userInfo.country || !userInfo.years || !userInfo.specialty) {
      alert("Por favor completa todos los datos personales.");
      return;
    }

    const errors = images.filter(
      (filename) =>
        answers[filename] !== undefined &&
        answers[filename] !== correctCategories[filename]
    );

    if (errors.length === 0) {
      alert("¡Muy bien! Todas tus respuestas son correctas.");
      setFinished(true);
      return;
    }

    const payload = errors.map((filename) => ({
      country: userInfo.country,
      years: userInfo.years,
      specialty: userInfo.specialty,
      filename,
      correct_answer: correctCategories[filename],
      user_answer: answers[filename],
      correct: "No",
    }));

    try {
      const res = await fetch("/api/sendResults", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status === "ok") {
        alert("Errores enviados correctamente.");
      } else {
        alert("Hubo un error enviando los datos.");
      }
    } catch (error: any) {
      alert("Error enviando los datos: " + error.message);
    }

    setFinished(true);
  };

  if (!finished) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Encuesta de imágenes</h1>

        <div className="mb-6 flex gap-3">
          <input
            className="border p-2 rounded flex-grow"
            placeholder="Country"
            value={userInfo.country}
            onChange={(e) => setUserInfo({ ...userInfo, country: e.target.value })}
          />
          <input
            className="border p-2 rounded flex-grow"
            placeholder="Years of profession"
            value={userInfo.years}
            onChange={(e) => setUserInfo({ ...userInfo, years: e.target.value })}
          />
          <input
            className="border p-2 rounded flex-grow"
            placeholder="Medical specialty"
            value={userInfo.specialty}
            onChange={(e) => setUserInfo({ ...userInfo, specialty: e.target.value })}
          />
        </div>

        {images.map((filename) => {
          const selected = answers[filename] || "";
          return (
            <div key={filename} className="mb-6 border p-4 rounded">
              <p className="font-semibold mb-1">{filename}</p>
              <img
                src={`/img/${filename}`}
                alt={filename}
                className="w-64 mb-2 border"
                draggable={false}
              />
              <div>
                {categories.map((cat) => (
                  <label key={`${filename}-${cat}`} className="mr-6 cursor-pointer select-none">
                    <input
                      type="radio"
                      name={filename}
                      value={cat}
                      checked={selected === cat}
                      onChange={() => handleSelect(filename, cat)}
                      className="mr-1"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    );
  }

  const errores = images.filter(
    (filename) => answers[filename] !== correctCategories[filename]
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Errores cometidos</h1>

      {errores.length === 0 ? (
        <p className="text-green-600 font-semibold">🎉 ¡Todas las respuestas son correctas!</p>
      ) : (
        errores.map((filename) => (
          <div key={filename} className="mb-6 border p-4 rounded bg-red-50">
            <p className="font-semibold mb-1">{filename}</p>
            <img
              src={`/img/${filename}`}
              alt={filename}
              className="w-64 mb-2 border"
              draggable={false}
            />
            <p>
              ✅ Respuesta correcta: <strong>{correctCategories[filename]}</strong>
            </p>
            <p>
              ❌ Tu respuesta: <strong>{answers[filename]}</strong>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
