import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        project_id: process.env.GOOGLE_PROJECT_ID,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Pasamos directamente el auth a sheets, sin llamar a getClient()
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const values = data.map((item: any) => [
      item.country,
      item.years,
      item.specialty,
      item.filename,
      item.correct_answer,
      item.user_answer,
      item.correct,
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Survey Results!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Error en sendResults:", error);
    return NextResponse.json({ status: "error", message: error.message || "Unknown error" });
  }
}
