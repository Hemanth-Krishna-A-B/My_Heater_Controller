export async function GET(req) {
    try {
      // Simulating a request to ESP32 to check if it's online
      const espResponse = await fetch("http://esp32-ip-address/status", { timeout: 3000 });
  
      if (!espResponse.ok) {
        return new Response(JSON.stringify({ error: "ESP32 is offline" }), { status: 500 });
      }
  
      const data = await espResponse.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: "ESP32 is not responding" }), { status: 500 });
    }
  }
  