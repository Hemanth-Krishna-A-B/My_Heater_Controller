import { NextResponse } from "next/server";

let controlData = { relay: false, targetTemperature: 75 };

export async function GET() {
  return NextResponse.json(controlData);
}

export async function POST(req) {
  const newData = await req.json();
  controlData = { ...controlData, ...newData };
  return NextResponse.json({ message: "Control updated", data: controlData });
}
