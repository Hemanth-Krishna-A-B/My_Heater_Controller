import { NextResponse } from "next/server";

let sensorData = { temperature: 0, humidity: 0 };

export async function GET() {
    return NextResponse.json(sensorData);
}

export async function POST(req) {
    const newData = await req.json();
    if (newData.temperature !== undefined) sensorData.temperature = newData.temperature;
    if (newData.humidity !== undefined) sensorData.humidity = newData.humidity;
    return NextResponse.json({ success: true, data: sensorData });
}
