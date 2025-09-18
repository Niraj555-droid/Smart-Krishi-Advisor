import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { MapPin, RotateCw } from "lucide-react";
import Papa from "papaparse";

interface CropRow {
  [key: string]: string;
}

type CropData = {
  [crop: string]: CropRow[];
};

interface LocationResult {
  Address: string;
  Region: string;
  Crops: string;
  Attributes: Record<string, number>;
}

interface Alert {
  id: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  timestamp: string;
  actionRequired: boolean;
  isRead: boolean;
}

const initialLocation = "Akola";

const CropAdvisor: React.FC = () => {
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [locationResult, setLocationResult] = useState<LocationResult | null>(null);
  const [marketData, setMarketData] = useState<CropData>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCropMarketData = async (crop: string): Promise<CropRow[]> => {
    try {
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000013f72e9caca004a947306969c59ceec3e&format=csv&filters%5Bcommodity%5D=${encodeURIComponent(crop)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch crop market data");
      const text = await response.text();
      const parsed = Papa.parse<CropRow>(text, { header: true });
      return parsed.data.slice(0, 3);
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchData = useCallback(async (loc: string) => {
    if (!loc.trim()) return;

    setLoading(true);
    setError(null);
    setLocationResult(null);
    setMarketData({});
    setAlerts([]);

    try {
      // Fetch soil + crop data
      const resLocation = await fetch("http://127.0.0.1:8000/location-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: loc.trim().toLowerCase() }),
      });
      if (!resLocation.ok) throw new Error("Failed to fetch location info");
      const data: LocationResult = await resLocation.json();
      setLocationResult(data);

      // Fetch market data for top 5 crops
      const cropsArray =
        data.Crops && data.Crops !== "No data"
          ? data.Crops.split(",").map((c) => c.trim()).slice(0, 5)
          : [];

      const marketEntries = await Promise.all(
        cropsArray.map(async (crop) => [crop, await fetchCropMarketData(crop)] as [string, CropRow[]])
      );
      setMarketData(Object.fromEntries(marketEntries));

      // Fetch real-time alerts
      const resAlerts = await fetch("http://127.0.0.1:8000/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: loc.trim().toLowerCase(), sms: false }),
      });
      if (resAlerts.ok) {
        const alertData: Alert[] = await resAlerts.json();
        setAlerts(alertData);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching data. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(initialLocation);
  }, [fetchData]);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Crop Advisor & Market Data" showLogo={false} />

      <main className="container mx-auto px-4 py-6">
        {/* Location Input */}
        <div className="mb-6 flex items-center space-x-2">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Enter location"
            className="border px-3 py-1 rounded w-40"
          />
          <button
            onClick={() => fetchData(locationInput)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Fetch
          </button>
        </div>

        {loading && <p>Loading data...</p>}
        {error && <div className="p-4 mb-4 border rounded bg-red-100 text-red-600">{error}</div>}

        {/* Location Info & Soil */}
        {locationResult && (
          <Card className="mb-6 shadow-card bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <MapPin className="h-5 w-5" /> Location Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Location:</strong> {locationResult.Address}, {locationResult.Region}
              </p>
              <p>
                <strong>Predicted Crops:</strong> {locationResult.Crops}
              </p>
              <div className="mt-4">
                <h4 className="font-semibold">Soil Attributes (NPK & pH)</h4>
                <ul className="list-disc pl-6">
                  {Object.entries(locationResult.Attributes).map(([k, v]) => (
                    <li key={k}>
                      {k}: {v}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Data */}
        {Object.keys(marketData).length > 0 && (
          <div className="space-y-6">
            {Object.entries(marketData).map(([crop, rows]) => (
              <Card key={crop} className="shadow-card">
                <CardHeader>
                  <CardTitle>{crop} Market Data</CardTitle>
                  {getRiskBadge("medium")}
                </CardHeader>
                <CardContent>
                  {rows.length === 0 ? (
                    <p>No data available</p>
                  ) : (
                    <div className="overflow-x-auto mt-4">
                      <table className="min-w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            {Object.keys(rows[0]).map((col) => (
                              <th key={col} className="border px-2 py-1">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              {Object.values(row).map((val, i) => (
                                <td key={i} className="border px-2 py-1">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="mt-6 shadow-card bg-yellow-50">
            <CardHeader>
              <CardTitle>⚠️ Real-Time Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6">
                {alerts.map((alert) => (
                  <li key={alert.id}>
                    <strong>{alert.title}</strong> - {alert.message} (
                    {alert.priority.toUpperCase()})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CropAdvisor;
