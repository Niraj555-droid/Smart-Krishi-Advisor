
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter,
  MapPin,
  Calendar,
  BarChart3,
  AlertCircle
} from "lucide-react";

interface MarketData {
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrival: number;
  date: string;
  trend: "up" | "down" | "stable";
}

const MarketAnalysis = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("national");
  const [selectedCommodity, setSelectedCommodity] = useState("bajra");
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) setUserProfile(JSON.parse(profile));
  }, []);

  // Fetch market data from API
  useEffect(() => {
    if (!selectedCommodity) return;

    const fetchMarketData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000013f72e9caca004a947306969c59ceec3e&format=json&limit=50&filters[commodity]=${selectedCommodity}`
        );
        const data = await res.json();

        const formatted: MarketData[] = data.records.map((item: any) => ({
          district: item.district,
          market: item.market,
          commodity: item.commodity,
          variety: item.variety,
          grade: item.grade || "FAQ",
          minPrice: Number(item.min_price) || 0,
          maxPrice: Number(item.max_price) || 0,
          modalPrice: Number(item.modal_price) || 0,
          arrival: Number(item.arrival) || 0,
          date: item.arrival_date,
          trend: "stable"
        }));

        // Compute trend
        for (let i = 1; i < formatted.length; i++) {
          const prev = formatted[i - 1].modalPrice;
          const curr = formatted[i].modalPrice;
          if (curr > prev) formatted[i].trend = "up";
          else if (curr < prev) formatted[i].trend = "down";
        }

        setMarketData(formatted);
      } catch (err) {
        console.error("Error fetching market data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [selectedCommodity]);

  const filteredData = marketData.filter(item => 
    item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.market.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-success" />;
      case "down": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Compute price analysis
  const todayAvg = marketData.length > 0 ? Math.round(marketData.reduce((a, b) => a + b.modalPrice, 0) / marketData.length) : 0;
  const weeklyHigh = marketData.length > 0 ? Math.max(...marketData.map(d => d.modalPrice)) : 0;
  const weeklyLow = marketData.length > 0 ? Math.min(...marketData.map(d => d.modalPrice)) : 0;
  const marketTrend = todayAvg > (weeklyHigh + weeklyLow)/2 ? "Bullish ↗" : "Bearish ↘";
  const totalArrival = marketData.reduce((a, b) => a + b.arrival, 0);
  const demandLevel = todayAvg > (weeklyHigh + weeklyLow)/2 ? "High" : "Low";
  const exportPotential = demandLevel === "High" ? "Good" : "Limited";
  const recommendation = demandLevel === "High" ? "Sell Now" : "Hold";

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Market Analysis" showLogo={false} />
      <main className="container mx-auto px-4 py-6">
        {/* Location & Date */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{userProfile?.district}, {userProfile?.state}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Today: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Market Level Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {["national", "international"].map(level => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedLevel(level)}
              className="text-xs"
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          ))}
        </div>

        {/* Commodity Search */}
        <div className="flex space-x-3 mb-6">
          <Input
            placeholder="Enter commodity"
            value={selectedCommodity}
            onChange={e => setSelectedCommodity(e.target.value)}
          />
          <Button onClick={() => setSelectedCommodity(selectedCommodity)}>Search</Button>
        </div>

        {/* Search & Filter */}
        <div className="flex space-x-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commodity or market..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="secondary" size="sm"><Filter className="h-4 w-4 mr-2"/> Filter</Button>
        </div>

        {/* Advisory */}
        {marketData.length > 0 && (
          <Card className="shadow-card mb-6 border-success/20 bg-success/5">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-success mt-1" />
                <div>
                  <h3 className="font-semibold text-success-foreground mb-1">Market Advisory</h3>
                  <p className="text-sm text-foreground">
                    Average {selectedCommodity} price is ₹{todayAvg}/quintal. 
                    <span className="font-medium text-success"> Suggested: {recommendation}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5"/>
              <span>Live Market Prices - {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {loading ? <p>Loading...</p> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Market</TableHead>
                      <TableHead>Commodity</TableHead>
                      <TableHead>Variety</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Min Price</TableHead>
                      <TableHead>Max Price</TableHead>
                      <TableHead>Modal Price</TableHead>
                      <TableHead>Arrival (Qtl)</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.market}</TableCell>
                        <TableCell>{item.commodity}</TableCell>
                        <TableCell>{item.variety}</TableCell>
                        <TableCell>{item.grade}</TableCell>
                        <TableCell>₹{item.minPrice}</TableCell>
                        <TableCell>₹{item.maxPrice}</TableCell>
                        <TableCell>₹{item.modalPrice}</TableCell>
                        <TableCell>{item.arrival}</TableCell>
                        <TableCell>{getTrendIcon(item.trend)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-lg">Price Analysis</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Today's Avg</span><span className="font-semibold">₹{todayAvg}/Qtl</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Weekly High</span><span className="font-semibold text-success">₹{weeklyHigh}/Qtl</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Weekly Low</span><span className="font-semibold text-destructive">₹{weeklyLow}/Qtl</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Market Trend</span><span className={marketTrend.includes("Bullish") ? "font-semibold text-success" : "font-semibold text-destructive"}>{marketTrend}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-lg">Supply & Demand</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between"><span>Total Arrival</span><span className="font-semibold">{totalArrival} Qtl</span></div>
                <div className="flex justify-between"><span>Demand Level</span><span className={demandLevel==="High"?"font-semibold text-success":"font-semibold text-destructive"}>{demandLevel}</span></div>
                <div className="flex justify-between"><span>Export Potential</span><span className="font-semibold text-primary">{exportPotential}</span></div>
                <div className="flex justify-between"><span>Recommendation</span><span className={recommendation==="Sell Now"?"font-semibold text-success":"font-semibold text-yellow-600"}>{recommendation}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
      <Footer/>
    </div>
  );
};

export default MarketAnalysis;