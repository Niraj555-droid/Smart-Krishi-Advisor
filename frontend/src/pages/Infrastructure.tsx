import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  Wifi, 
  Truck, 
  Droplets, 
  Zap,
  MapPin,
  Phone,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  IndianRupee,
  ArrowUp
} from "lucide-react";

interface InfrastructureData {
  category: string;
  icon: any;
  currentScore: number;
  items: {
    name: string;
    status: "good" | "average" | "poor";
    distance?: string;
    quality?: string;
    availability?: string;
  }[];
  upgradeSuggestions: {
    suggestion: string;
    cost: string;
    benefit: string;
    priority: "high" | "medium" | "low";
  }[];
}

const Infrastructure = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("connectivity");

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const infrastructureData: Record<string, InfrastructureData> = {
    connectivity: {
      category: "Communication & Connectivity",
      icon: Wifi,
      currentScore: 65,
      items: [
        { name: "Mobile Network", status: "good", quality: "4G Available", availability: "95%" },
        { name: "Internet Connectivity", status: "average", quality: "Broadband", availability: "60%" },
        { name: "Telephone Lines", status: "poor", quality: "Landline", availability: "20%" },
        { name: "Digital Banking", status: "good", distance: "2 km", availability: "ATM + UPI" }
      ],
      upgradeSuggestions: [
        {
          suggestion: "Install Wi-Fi hotspot for farm monitoring",
          cost: "₹15,000-25,000",
          benefit: "Real-time crop monitoring, weather alerts",
          priority: "high"
        },
        {
          suggestion: "Upgrade to fiber optic internet",
          cost: "₹5,000-8,000 annually",
          benefit: "Faster data access, video calls with experts",
          priority: "medium"
        }
      ]
    },
    transportation: {
      category: "Transportation & Logistics",
      icon: Truck,
      currentScore: 58,
      items: [
        { name: "Village Roads", status: "average", quality: "Paved", availability: "All weather" },
        { name: "Highway Access", status: "good", distance: "8 km", quality: "National Highway" },
        { name: "Nearest Mandi", status: "good", distance: "12 km", availability: "Daily operations" },
        { name: "Railway Station", status: "average", distance: "25 km", availability: "Goods transport" },
        { name: "Cold Storage", status: "poor", distance: "35 km", availability: "Limited capacity" }
      ],
      upgradeSuggestions: [
        {
          suggestion: "Establish village-level cold storage facility",
          cost: "₹2-5 lakhs (community)",
          benefit: "Reduce post-harvest losses by 30-40%",
          priority: "high"
        },
        {
          suggestion: "Organize farmer producer groups for transport",
          cost: "₹10,000 membership",
          benefit: "Reduced transport cost, bulk sales",
          priority: "medium"
        }
      ]
    },
    water: {
      category: "Water Resources",
      icon: Droplets,
      currentScore: 72,
      items: [
        { name: "Groundwater", status: "good", quality: "Good quality", availability: "Year-round" },
        { name: "Canal Irrigation", status: "average", distance: "3 km", availability: "Seasonal" },
        { name: "Rainfall", status: "average", quality: "750mm annual", availability: "Monsoon dependent" },
        { name: "Water Storage", status: "poor", quality: "Farm pond needed", availability: "Limited" }
      ],
      upgradeSuggestions: [
        {
          suggestion: "Construct farm pond (1 acre capacity)",
          cost: "₹80,000-1,20,000",
          benefit: "Water security, fish farming option",
          priority: "high"
        },
        {
          suggestion: "Install drip irrigation system",
          cost: "₹45,000-60,000 per acre",
          benefit: "40-50% water savings, better yields",
          priority: "medium"
        },
        {
          suggestion: "Rainwater harvesting system",
          cost: "₹25,000-40,000",
          benefit: "Recharge groundwater, reduce dependency",
          priority: "low"
        }
      ]
    },
    power: {
      category: "Power & Energy",
      icon: Zap,
      currentScore: 55,
      items: [
        { name: "Grid Electricity", status: "average", quality: "380V 3-phase", availability: "18 hours/day" },
        { name: "Solar Power", status: "poor", quality: "Not installed", availability: "N/A" },
        { name: "Diesel Generator", status: "average", quality: "5 KVA backup", availability: "Emergency use" }
      ],
      upgradeSuggestions: [
        {
          suggestion: "Install 10 KW solar system with subsidy",
          cost: "₹3-4 lakhs (after subsidy)",
          benefit: "Energy independence, reduced costs",
          priority: "high"
        },
        {
          suggestion: "Upgrade electrical infrastructure",
          cost: "₹50,000-80,000", 
          benefit: "Stable power for equipment",
          priority: "medium"
        }
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-success";
      case "average": return "text-warning";
      case "poor": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good": return "bg-success/10 text-success border-success/20";
      case "average": return "bg-warning/10 text-warning border-warning/20";
      case "poor": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const categories = [
    { key: "connectivity", label: "Connectivity", icon: Wifi },
    { key: "transportation", label: "Transport", icon: Truck },
    { key: "water", label: "Water", icon: Droplets },
    { key: "power", label: "Power", icon: Zap }
  ];

  const currentData = infrastructureData[selectedCategory];

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Infrastructure Assessment" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Location Info */}
        <div className="flex items-center space-x-2 text-muted-foreground mb-6">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">
            {userProfile?.village}, {userProfile?.district}, {userProfile?.state}
          </span>
        </div>

        {/* Overall Infrastructure Score */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Overall Infrastructure Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-primary mb-2">62%</div>
              <Progress value={62} className="w-full max-w-md mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Good foundation with room for targeted improvements
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const data = infrastructureData[cat.key];
                return (
                  <div key={cat.key} className="text-center p-3 bg-muted/50 rounded-lg">
                    <cat.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">{cat.label}</div>
                    <div className={`font-semibold ${data.currentScore >= 70 ? 'text-success' : data.currentScore >= 50 ? 'text-warning' : 'text-destructive'}`}>
                      {data.currentScore}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Category Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(category.key)}
              className="flex items-center space-x-2"
            >
              <category.icon className="h-4 w-4" />
              <span>{category.label}</span>
            </Button>
          ))}
        </div>

        {/* Detailed Assessment */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <currentData.icon className="h-5 w-5" />
              <span>{currentData.category}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Category Score */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-2xl font-bold text-primary">{currentData.currentScore}%</div>
                <div className="text-sm text-muted-foreground">Current Status</div>
              </div>
              <Progress value={currentData.currentScore} className="w-48" />
            </div>

            {/* Infrastructure Items */}
            <div className="space-y-4">
              {currentData.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quality && `${item.quality} • `}
                      {item.distance && `${item.distance} • `}
                      {item.availability}
                    </div>
                  </div>
                  <Badge className={`${getStatusBadge(item.status)} border`} variant="outline">
                    {item.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Suggestions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowUp className="h-5 w-5" />
              <span>Upgrade Suggestions & Cost-Benefit Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.upgradeSuggestions.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{suggestion.suggestion}</h4>
                    <Badge 
                      variant="outline" 
                      className={`${getPriorityColor(suggestion.priority)} border-current`}
                    >
                      {suggestion.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Investment Required</div>
                        <div className="font-semibold">{suggestion.cost}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <div>
                        <div className="text-sm text-muted-foreground">Expected Benefit</div>
                        <div className="font-semibold text-success">{suggestion.benefit}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Government Schemes Info */}
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-primary">Available Government Support</h4>
              </div>
              <div className="text-sm text-foreground space-y-1">
                <p>• Solar subsidy: Up to 40% under PM-KUSUM scheme</p>
                <p>• Cold storage: 50% subsidy under Mission for Integrated Development of Horticulture</p>
                <p>• Drip irrigation: 55% subsidy for small farmers</p>
                <p>• Farm pond: 100% subsidy under MGNREGA</p>
              </div>
              <Button size="sm" className="mt-3">
                Check Eligibility & Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Infrastructure;