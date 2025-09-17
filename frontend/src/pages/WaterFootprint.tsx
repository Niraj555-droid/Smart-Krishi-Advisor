import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  Droplets, 
  CloudRain, 
  Waves, 
  MapPin,
  Calendar,
  TrendingDown,
  TrendingUp,
  Leaf,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface WaterUsageData {
  crop: string;
  season: string;
  totalWaterUsed: number; // in mm
  sources: {
    rainwater: number;
    groundwater: number;
    irrigation: number;
  };
  efficiency: number; // percentage
  recommendation: string;
  status: "excellent" | "good" | "average" | "poor";
}

const WaterFootprint = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState("current");
  const [selectedCrop, setSelectedCrop] = useState("all");

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  // Mock water usage data
  const waterData: WaterUsageData[] = [
    {
      crop: "Onion",
      season: "Rabi 2023-24",
      totalWaterUsed: 450,
      sources: { rainwater: 180, groundwater: 200, irrigation: 70 },
      efficiency: 78,
      recommendation: "Good efficiency. Consider drip irrigation to reduce groundwater dependency.",
      status: "good"
    },
    {
      crop: "Wheat", 
      season: "Rabi 2023-24",
      totalWaterUsed: 380,
      sources: { rainwater: 150, groundwater: 180, irrigation: 50 },
      efficiency: 85,
      recommendation: "Excellent water management. Continue current practices.",
      status: "excellent"
    },
    {
      crop: "Bajra",
      season: "Kharif 2023",
      totalWaterUsed: 320,
      sources: { rainwater: 250, groundwater: 50, irrigation: 20 },
      efficiency: 92,
      recommendation: "Outstanding! Drought-resistant crop with minimal water needs.",
      status: "excellent"
    }
  ];

  const conservationTechniques = [
    {
      technique: "Drip Irrigation",
      waterSaving: "40-50%",
      cost: "₹45,000-60,000/acre",
      paybackPeriod: "2-3 years",
      suitability: "High",
      implemented: false
    },
    {
      technique: "Mulching",
      waterSaving: "20-30%", 
      cost: "₹8,000-12,000/acre",
      paybackPeriod: "1 season",
      suitability: "High",
      implemented: true
    },
    {
      technique: "Rainwater Harvesting",
      waterSaving: "25-35%",
      cost: "₹25,000-40,000",
      paybackPeriod: "3-4 years",
      suitability: "Medium",
      implemented: false
    },
    {
      technique: "Sprinkler System",
      waterSaving: "25-30%",
      cost: "₹35,000-45,000/acre", 
      paybackPeriod: "2-3 years",
      suitability: "Medium",
      implemented: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-success";
      case "good": return "text-primary";
      case "average": return "text-warning";
      case "poor": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent": return "bg-success/10 text-success border-success/20";
      case "good": return "bg-primary/10 text-primary border-primary/20";
      case "average": return "bg-warning/10 text-warning border-warning/20";
      case "poor": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const filteredData = selectedCrop === "all" 
    ? waterData 
    : waterData.filter(data => data.crop.toLowerCase() === selectedCrop.toLowerCase());

  const totalWaterUsed = filteredData.reduce((sum, data) => sum + data.totalWaterUsed, 0);
  const averageEfficiency = filteredData.reduce((sum, data) => sum + data.efficiency, 0) / filteredData.length;

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Water Footprint Monitor" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Location & Farm Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {userProfile?.village}, {userProfile?.district} • {userProfile?.farmSize} acres
            </span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Monitoring Period: Jan 2023 - Aug 2024</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Season</SelectItem>
              <SelectItem value="rabi">Rabi 2023-24</SelectItem>
              <SelectItem value="kharif">Kharif 2023</SelectItem>
              <SelectItem value="all">All Seasons</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="onion">Onion</SelectItem>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="bajra">Bajra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Water Usage Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalWaterUsed}mm</div>
                  <div className="text-sm text-muted-foreground">Total Water Used</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingDown className="h-4 w-4 text-success" />
                <span className="text-success">15% less than last year</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(averageEfficiency)}%</div>
                  <div className="text-sm text-muted-foreground">Water Efficiency</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-success">8% improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Good</div>
                  <div className="text-sm text-muted-foreground">Conservation Level</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-success">Above regional average</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crop-wise Water Usage */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="h-5 w-5" />
              <span>Crop-wise Water Footprint</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredData.map((data, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{data.crop}</h3>
                      <p className="text-sm text-muted-foreground">{data.season}</p>
                    </div>
                    <Badge className={`${getStatusBadge(data.status)} border`} variant="outline">
                      {data.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Water Usage Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium mb-3">Water Sources (mm)</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CloudRain className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Rainwater</span>
                          </div>
                          <span className="font-semibold">{data.sources.rainwater}mm</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Waves className="h-4 w-4 text-cyan-500" />
                            <span className="text-sm">Groundwater</span>
                          </div>
                          <span className="font-semibold">{data.sources.groundwater}mm</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Droplets className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Irrigation</span>
                          </div>
                          <span className="font-semibold">{data.sources.irrigation}mm</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Efficiency Metrics</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Water Use Efficiency</span>
                            <span className="text-sm font-semibold">{data.efficiency}%</span>
                          </div>
                          <Progress value={data.efficiency} className="h-2" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total Water Used</div>
                          <div className="font-semibold">{data.totalWaterUsed}mm</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Recommendation:</div>
                        <div className="text-sm text-muted-foreground">{data.recommendation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conservation Techniques */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5" />
              <span>Water Conservation Techniques</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conservationTechniques.map((technique, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 ${technique.implemented ? 'bg-success/5 border-success/20' : 'bg-muted/5'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold">{technique.technique}</h4>
                      {technique.implemented && (
                        <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                          IMPLEMENTED
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">{technique.waterSaving}</div>
                      <div className="text-xs text-muted-foreground">Water Saving</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Investment</div>
                      <div className="font-semibold">{technique.cost}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Payback Period</div>
                      <div className="font-semibold">{technique.paybackPeriod}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Suitability</div>
                      <div className={`font-semibold ${technique.suitability === 'High' ? 'text-success' : 'text-warning'}`}>
                        {technique.suitability}
                      </div>
                    </div>
                  </div>

                  {!technique.implemented && (
                    <Button size="sm" className="mt-3">
                      Learn More & Implement
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Water Conservation Score */}
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-primary">Your Water Conservation Score</h4>
                <div className="text-2xl font-bold text-primary">B+</div>
              </div>
              <p className="text-sm text-foreground">
                You're doing well! Implementing drip irrigation could improve your score to A and save 
                additional ₹25,000-35,000 annually in water costs.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default WaterFootprint;