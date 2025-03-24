import { NextResponse } from "next/server";

let sensorData = { temperature: null, humidity: null };

export async function GET() {
  return NextResponse.json(sensorData); // ✅ Frontend can GET latest data
}

export async function POST(req) {
  try {
    const newData = await req.json();
    sensorData = { ...sensorData, ...newData }; // ✅ Store latest data
    console.log("🌡️ Sensor Data Updated:", sensorData);
    return NextResponse.json({ message: "Sensor data updated", data: sensorData });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
  }
}
