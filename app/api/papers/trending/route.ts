import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cachePath = path.join(process.cwd(), 'data', 'papers_cache.json');
    
    if (fs.existsSync(cachePath)) {
      const fileContent = fs.readFileSync(cachePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      // Check if cache is older than 12 hours (43,200,000 ms)
      const isExpired = Date.now() - data.timestamp > 12 * 60 * 60 * 1000;
      
      if (isExpired) {
        console.log("Cache is expired, serving stale data and triggering background fetch...");
        try {
          const scriptPath = path.join(process.cwd(), 'scratch', 'fetch_papers.js');
          exec(`node "${scriptPath}"`, (err) => {
            if (err) {
              console.error("Background fetch process error:", err);
            } else {
              console.log("Background fetch finished successfully");
            }
          });
        } catch (e) {
          console.error("Failed to start background fetch process:", e);
        }
      }
      
      return NextResponse.json(data.papers);
    }
    
    // Fallback in case cache is missing
    console.log("Cache file not found, returning empty array");
    return NextResponse.json([]);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("API error fetching trending papers:", err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
