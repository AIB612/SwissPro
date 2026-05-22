import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.csv');

export async function POST(req: NextRequest) {
  try {
    const { canton, email, locale, timestamp } = await req.json();

    if (!canton || !email) {
      return NextResponse.json({ error: 'Canton and email are required' }, { status: 400 });
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });

    // Check if file exists, if not create with header
    let fileExists = false;
    try {
      await fs.access(SUBSCRIBERS_FILE);
      fileExists = true;
    } catch {
      // File doesn't exist yet
    }

    const csvLine = `"${timestamp}","${canton}","${email}","${locale}"\n`;

    if (!fileExists) {
      const header = '"Timestamp","Canton","Email","Locale"\n';
      await fs.writeFile(SUBSCRIBERS_FILE, header + csvLine, 'utf-8');
    } else {
      await fs.appendFile(SUBSCRIBERS_FILE, csvLine, 'utf-8');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
