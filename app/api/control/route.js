import { NextResponse } from "next/server";

let controlData = { relay: false, targetTemperature: 75 }; // Default values

export async function GET() {
  console.log("📥 GET request received:", controlData);
  return NextResponse.json(controlData);
}

export async function POST(req) {
  try {
    const newData = await req.json();
    console.log("✍️ Incoming POST data:", newData);

    // ✅ Prevent unnecessary updates
    if (
      (newData.targetTemperature !== undefined && newData.targetTemperature !== controlData.targetTemperature) ||
      (newData.relay !== undefined && newData.relay !== controlData.relay)
    ) {
      controlData = { ...controlData, ...newData };
      console.log("✅ Control data updated:", controlData);
    } else {
      console.log("⚠️ No changes detected, skipping update.");
    }

    return NextResponse.json({ message: "Control updated", data: controlData });
  } catch (error) {
    console.error("❌ Error in POST request:", error);
    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
  }
}
