import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export async function POST(request) {
  try {
    const { eventId } = await request.json();

    // Run your Python script
    const scriptPath = path.join(process.cwd(), "/backend/main.py");
    const { stdout, stderr } = await execAsync(
      `python3 ${scriptPath} ${eventId}`
    );

    if (stderr) {
      throw new Error(stderr);
    }

    const result = JSON.parse(stdout);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in Python script:", error);
    return NextResponse.json(
      { error: "Python Script Error", details: error.message },
      { status: 500 }
    );
  }
}
