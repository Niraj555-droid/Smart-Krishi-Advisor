import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  Sprout, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Droplets,
  Thermometer,
  MapPin,
  TrendingUp
} from "lucide-react";

interface CropSuitability {
  name: string;
  suitabilityScore: number;
  factors: {
    soil: number;
    water: number;
    weather: number;
    market: number;
  };
  recommendation: "high" | "medium" | "low";
  advisory: string;
}

const CropSuitability = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchCrop, setSearchCrop] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<CropSuitability | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  // Mock crop suitability data based on user profile
  const cropDatabase: Record<string, CropSuitability> = {
    "wheat": {
      name: "Wheat",
      suitabilityScore: 85,
      factors: { soil: 90, water: 75, weather: 88, market: 87 },
      recommendation: "high",
      advisory: "Excellent choice! Your soil and water conditions strongly support wheat cultivation. Current market demand is high."
    },
    "bajra": {
      name: "Bajra (Pearl Millet)",
      suitabilityScore: 78,
      factors: { soil: 85, water: 90, weather: 70, market: 68 },
      recommendation: "high",
      advisory: "Great crop for your region. Drought-resistant and well-suited to your soil type. Good market prices expected."
    },
    "cotton": {
      name: "Cotton",
      suitabilityScore: 45,
      factors: { soil: 60, water: 30, weather: 55, market: 35 },
      recommendation: "low",
      advisory: "Not recommended. Your region has insufficient water availability for cotton. Consider drought-resistant alternatives."
    },
    "sugarcane": {
      name: "Sugarcane", 
      suitabilityScore: 55,
      factors: { soil: 70, water: 25, weather: 80, market: 45 },
      recommendation: "medium",
      advisory: "Risky choice. High water requirement but limited water availability in your area. Consider improved irrigation before planting."
    },
    "onion": {
      name: "Onion",
      suitabilityScore: 92,
      factors: { soil: 95, water: 85, weather: 95, market: 92 },
      recommendation: "high", 
      advisory: "Perfect match! Your soil conditions and climate are ideal for onion. Strong export demand and good profit margins."
    }
  };

  const topAlternatives = [
    { name: "Onion", score: 92, profit: "High" },
    { name: "Wheat", score: 85, profit: "Good" },
    { name: "Bajra", score: 78, profit: "Good" },
    { name: "Jowar", score: 74, profit: "Medium" },
    { name: "Gram", score: 69, profit: "Medium" }
  ];

  const handleCropSearch = () => {
    const crop = cropDatabase[searchCrop.toLowerCase()];
    if (crop) {
      setSelectedCrop(crop);
    } else {
      // Default response for crops not in database
      setSelectedCrop({
        name: searchCrop,
        suitabilityScore: 60,
        factors: { soil: 65, water: 55, weather: 60, market: 60 },
        recommendation: "medium",
        advisory: `Limited data available for ${searchCrop}. Consult your local agricultural officer for detailed guidance.`
      });
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "high": return <CheckCircle className="h-6 w-6 text-success" />;
      case "medium": return <AlertTriangle className="h-6 w-6 text-warning" />;
      case "low": return <XCircle className="h-6 w-6 text-destructive" />;
      default: return <AlertTriangle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "high": return "border-success/20 bg-success/5";
      case "medium": return "border-warning/20 bg-warning/5";
      case "low": return "border-destructive/20 bg-destructive/5";
      default: return "border-muted";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Crop Suitability" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Location Info */}
        <div className="flex items-center space-x-2 text-muted-foreground mb-6">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">
            {userProfile?.village}, {userProfile?.district}, {userProfile?.state} • 
            {userProfile?.soilType} Soil • {userProfile?.farmSize} acres
          </span>
        </div>

        {/* Crop Search */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Check Crop Suitability</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <Input
                placeholder="Enter crop name (e.g., wheat, cotton, onion)..."
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleCropSearch()}
              />
              <Button onClick={handleCropSearch} disabled={!searchCrop.trim()}>
                Check Suitability
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Crop Suitability Result */}
        {selectedCrop && (
          <Card className={`shadow-card mb-6 ${getRecommendationColor(selectedCrop.recommendation)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <Sprout className="h-6 w-6" />
                  <span>{selectedCrop.name} Suitability Analysis</span>
                </CardTitle>
                {getRecommendationIcon(selectedCrop.recommendation)}
              </div>
            </CardHeader>
            <CardContent>
              {/* Overall Score */}
              <div className="text-center mb-6">
                <div className={`text-4xl font-bold ${getScoreColor(selectedCrop.suitabilityScore)} mb-2`}>
                  {selectedCrop.suitabilityScore}%
                </div>
                <Progress value={selectedCrop.suitabilityScore} className="w-full max-w-md mx-auto mb-3" />
                <div className="text-lg font-semibold">
                  {selectedCrop.recommendation === "high" && "✅ Highly Recommended"}
                  {selectedCrop.recommendation === "medium" && "⚠️ Proceed with Caution"}
                  {selectedCrop.recommendation === "low" && "❌ Not Recommended"}
                </div>
              </div>

              {/* Factor Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sprout className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Soil Match</div>
                  <div className={`text-lg font-semibold ${getScoreColor(selectedCrop.factors.soil)}`}>
                    {selectedCrop.factors.soil}%
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Droplets className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Water Needs</div>
                  <div className={`text-lg font-semibold ${getScoreColor(selectedCrop.factors.water)}`}>
                    {selectedCrop.factors.water}%
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Thermometer className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Climate</div>
                  <div className={`text-lg font-semibold ${getScoreColor(selectedCrop.factors.weather)}`}>
                    {selectedCrop.factors.weather}%
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Market</div>
                  <div className={`text-lg font-semibold ${getScoreColor(selectedCrop.factors.market)}`}>
                    {selectedCrop.factors.market}%
                  </div>
                </div>
              </div>

              {/* Advisory */}
              <div className="p-4 bg-card rounded-lg border">
                <h4 className="font-semibold mb-2">Expert Advisory:</h4>
                <p className="text-sm text-foreground">{selectedCrop.advisory}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Top 5 Alternative Crops */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sprout className="h-5 w-5" />
              <span>AI Top 5 Recommended Crops for Your Farm</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAlternatives.map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold text-primary">#{index + 1}</div>
                    <div>
                      <div className="font-semibold">{crop.name}</div>
                      <div className="text-sm text-muted-foreground">Profit Potential: {crop.profit}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(crop.score)}`}>
                      {crop.score}%
                    </div>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => {
                        setSearchCrop(crop.name.toLowerCase());
                        setSelectedCrop(cropDatabase[crop.name.toLowerCase()] || null);
                      }}
                    >
                      Analyze
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default CropSuitability;