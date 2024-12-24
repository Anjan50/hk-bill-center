// lib/sheets.ts
export async function appendToSheet(accessToken: string, values: (string | number)[][]) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.NEXT_PUBLIC_SHEET_ID}/values/Sheet1!A:I:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [values] }),
      }
    );
    return response.json();
  } catch {
    throw new Error('Failed to append to sheet');
  }
}