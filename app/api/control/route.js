import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ GET: Fetch the latest control settings
export async function GET() {
  const { data, error } = await supabase
    .from("control")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "No control settings found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// ✅ POST: Update control settings (Relay & Temperature)
export async function POST(req) {
  const newData = await req.json();

  const { error } = await supabase
    .from("control")
    .update(newData)
    .eq("id", 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Control settings updated", data: newData });
}
