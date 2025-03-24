"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const [sensorData, setSensorData] = useState({ temperature: 0, humidity: 0 });
  const [controlData, setControlData] = useState({ relay: false, targetTemperature: 75 });
  const [newTargetTemp, setNewTargetTemp] = useState(75);
  const [loading, setLoading] = useState(false);

  // Fetch sensor & control data from ESP32 API
  const fetchData = async () => {
    try {
      const [sensorRes, controlRes] = await Promise.all([
        fetch("/api/sensor"),
        fetch("/api/control"),
      ]);

      if (!sensorRes.ok || !controlRes.ok) {
        throw new Error("ESP32 is offline");
      }

      const sensorJson = await sensorRes.json();
      const controlJson = await controlRes.json();
      setSensorData(sensorJson);
      setControlData(controlJson);
      setNewTargetTemp(controlJson.targetTemperature);
    } catch (error) {
      toast.error("ESP32 is offline. Check connection.");
    }
  };

  // Toggle Relay ON/OFF
  const toggleRelay = async () => {
    setLoading(true);
    const updatedRelay = !controlData.relay;

    try {
      const res = await fetch("/api/control", {
        method: "POST",
        body: JSON.stringify({ relay: updatedRelay }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setControlData((prev) => ({ ...prev, relay: updatedRelay }));
        toast.success(`Relay ${updatedRelay ? "ON" : "OFF"}`);
      } else {
        throw new Error("Failed to update relay");
      }
    } catch (error) {
      toast.error("ESP32 did not respond. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update Target Temperature
  const confirmTargetTemperature = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/control", {
        method: "POST",
        body: JSON.stringify({ targetTemperature: newTargetTemp }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setControlData((prev) => ({ ...prev, targetTemperature: newTargetTemp }));
        toast.success(`Target Temperature set to ${newTargetTemp}°C`);
      } else {
        throw new Error("Failed to update temperature");
      }
    } catch (error) {
      toast.error("ESP32 did not respond. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto turn off relay if temp exceeds threshold
  useEffect(() => {
    if (sensorData.temperature > controlData.targetTemperature) {
      setControlData((prev) => ({ ...prev, relay: false }));
    }
  }, [sensorData]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-4">🔥 Heater Controller</h1>

        {/* Temperature & Humidity Display */}
        <div className="grid grid-cols-2 gap-4 bg-gray-700 p-4 rounded-lg mb-4">
          <div className="text-center">
            <p className="text-lg">Temperature</p>
            <h2 className="text-4xl font-bold">{sensorData.temperature}°C</h2>
          </div>
          <div className="text-center">
            <p className="text-lg">Humidity</p>
            <h2 className="text-4xl font-bold">{sensorData.humidity}%</h2>
          </div>
        </div>

        {/* Relay Control */}
        <button
          onClick={toggleRelay}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-lg font-semibold transition ${
            controlData.relay ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          } ${loading && "opacity-50 cursor-not-allowed"}`}
        >
          {loading ? "Updating..." : controlData.relay ? "Turn OFF" : "Turn ON"}
        </button>

        {/* Target Temperature Slider */}
        <div className="mt-6">
          <label className="block text-lg mb-2">Set Temperature Threshold</label>
          <input
            type="range"
            min="25"
            max="75"
            value={newTargetTemp}
            onChange={(e) => setNewTargetTemp(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <p className="text-center text-xl mt-2">{newTargetTemp}°C</p>

          {/* Set Temperature Button */}
          <button
            onClick={confirmTargetTemperature}
            disabled={loading}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Setting..." : "Set Temperature"}
          </button>
        </div>
      </div>
    </div>
  );
}
