import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

let pythonProcess = null; // Global variable to store the Python process

// Handle POST requests to start or terminate the Python script
export async function POST(request) {
  try {
    const { eventId, action } = await request.json(); // Get both eventId and action

    if (action === "start") {
      // Start Python script
      const scriptPath = path.join(
        process.cwd(),
        "face_recognition",
        "main.py"
      );
      pythonProcess = exec(
        `python3 ${scriptPath} ${eventId}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing Python script: ${error.message}`);
          }
          if (stderr) {
            console.error(`Python script stderr: ${stderr}`);
          }
        }
      );

      return NextResponse.json({
        message: "Python script started",
        pid: pythonProcess.pid,
      });
    }

    if (action === "terminate") {
      // Terminate Python process
      if (pythonProcess) {
        pythonProcess.kill();
        pythonProcess = null;
        return NextResponse.json({ message: "Python script terminated" });
      } else {
        return NextResponse.json(
          { message: "No Python process running" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in handling Python process:", error);
    return NextResponse.json(
      { error: "Python Script Error", details: error.message },
      { status: 500 }
    );
  }
}
