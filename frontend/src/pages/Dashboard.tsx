import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  Cloud, 
  TrendingUp, 
  Droplets, 
  Sprout, 
  MapPin, 
  Bell,
  BarChart3,
  Building2,
  Thermometer,
  ArrowRight,
  Users
} from "lucide-react";

interface UserProfile {
  name: string;
  role: string;
  state: string;
  district: string;
  farmSize: string;
  soilType: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    } else {
      navigate("/profile-setup");
    }
  }, [navigate]);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "farmer": return "Farmer";
      case "krishi_kendra": return "Krishi Kendra Officer";
      case "agricultural_officer": return "Agricultural Officer";
      default: return "User";
    }
  };

  const getWeatherGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const quickActions = [
    {
      title: "Market Analysis",
      description: "Check current prices & trends",
      icon: TrendingUp,
      path: "/market-analysis",
      color: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "Crop Advisor",
      description: "Smart crop recommendations",
      icon: Sprout,
      path: "/crop-advisor",
      color: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      title: "Community",
      description: "Connect with farmers & share experiences",
      icon: Users,
      path: "/community",
      color: "bg-gradient-to-r from-orange-500 to-orange-600"
    },
    {
      title: "Water Monitor",
      description: "Track water usage & conservation",
      icon: Droplets,
      path: "/water-monitor",
      color: "bg-gradient-to-r from-cyan-500 to-cyan-600"
    },
    {
      title: "Weather Forecast",
      description: "5-day weather & agro-advisory",
      icon: Cloud,
      path: "/weather",
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    }
  ];

  // AI Crop Recommendations
  const recommendedCrops = [
    { name: "Orange", suitability: 53, price: "₹12,000", market: "Adimali" },
    { name: "Coconut", suitability: 20, price: "₹14,000", market: "Tumkur" },
    { name: "Pomegranate", suitability: 7, price: "₹18,000", market: "Durg" }
  ];

  const topCrop = recommendedCrops[0];

  const insightCards = [
    {
      title: "Today's Weather",
      value: "28°C",
      description: "Partly cloudy, good for fieldwork",
      icon: Thermometer,
      trend: "+2°C from yesterday"
    },
    {
      title: "Market Alert",
      value: topCrop.price,
      description: `${topCrop.name} price per quintal`,
      icon: BarChart3,
      trend: "+5% from last week"
    },
    {
      title: "Water Status", 
      value: "Adequate",
      description: `Sufficient for ${topCrop.name} cultivation`,
      icon: Droplets,
      trend: "Stable for season"
    },
    {
      title: "Farm Score",
      value: "82%",
      description: `Optimized for ${topCrop.name} (${topCrop.suitability}%)`,
      icon: Sprout,
      trend: "+8% this month"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {userProfile.district}, {userProfile.state}
            </span>
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            {getWeatherGreeting()}, {userProfile.name}!
          </h1>
          
          <p className="text-muted-foreground mb-3">
            {getRoleTitle(userProfile.role)} • {userProfile.farmSize} acres
          </p>

          {/* Recommended Crop Header */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  Recommended Crop: {topCrop.name} ({topCrop.suitability}%)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Optimal for your farm conditions
                </p>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate("/crop-advisor")}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {insightCards.map((card, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <card.icon className="h-5 w-5 text-muted-foreground" />
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.title}</p>
                  <p className="text-xs text-foreground">{card.description}</p>
                  <p className="text-xs text-success">{card.trend}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
            onClick={() => navigate("/yield-predictor")}
          >
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white mx-auto w-fit mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                Yield Predictor
              </h3>
              <p className="text-sm text-muted-foreground">
                Track predicted yield for {topCrop.name}
              </p>
            </CardContent>
          </Card>

          <Card 
            className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
            onClick={() => navigate("/notification-alerts")}
          >
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white mx-auto w-fit mb-4">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                Notification Alerts
              </h3>
              <p className="text-sm text-muted-foreground">
                Weather alerts & farming advisories
              </p>
            </CardContent>
          </Card>

          <Card 
            className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
            onClick={() => navigate("/fertiliser-optimisation")}
          >
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white mx-auto w-fit mb-4">
                <Sprout className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                Fertiliser Optimisation
              </h3>
              <p className="text-sm text-muted-foreground">
                NPK recommendations & pesticide advice
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Farm Analysis Section */}
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-4">🌾 Farm Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-4 text-center">
                <Sprout className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Crop Health Status</p>
                <p className="text-lg font-bold text-green-600">Healthy</p>
                <p className="text-xs text-muted-foreground">85% Score</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-4 text-center">
                <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Soil Nutrient Levels</p>
                <p className="text-lg font-bold text-blue-600">Balanced</p>
                <p className="text-xs text-muted-foreground">NPK: 7.2-5.8-6.1</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-4 text-center">
                <Droplets className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Water Usage Efficiency</p>
                <p className="text-lg font-bold text-cyan-600">78%</p>
                <p className="text-xs text-muted-foreground">Optimal utilization</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Pest/Disease Risk</p>
                <p className="text-lg font-bold text-yellow-600">Low</p>
                <p className="text-xs text-muted-foreground">Preventive action</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Profitability Estimate</p>
                <p className="text-lg font-bold text-green-600">₹45K</p>
                <p className="text-xs text-muted-foreground">6 months ROI</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-4">🌟 Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
              onClick={() => navigate("/pesticide-verification")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                    <div className="text-2xl">🧪</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Smart Pesticide Verification
                    </h3>
                    <p className="text-sm text-muted-foreground">Scan products for lab-tested reports & safety details</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
              onClick={() => navigate("/byproduct-utilization")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
                    <div className="text-2xl">🌱</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      By-product Utilization
                    </h3>
                    <p className="text-sm text-muted-foreground">Monetize agricultural waste through industry connections</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
              onClick={() => navigate("/blockchain-traceability")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
                    <div className="text-2xl">📦</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Blockchain Traceability
                    </h3>
                    <p className="text-sm text-muted-foreground">QR codes for transparent crop tracking & pricing</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
              onClick={() => navigate("/farmer-support")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white">
                    <div className="text-2xl">👨‍🌾</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Farmer Support Tools
                    </h3>
                    <p className="text-sm text-muted-foreground">AI chatbot, disease prediction & expert advisory</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Government Schemes & Subsidies</span>
              </CardTitle>
              <CardDescription>
                Available schemes and subsidies for your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">PM-KISAN Scheme</span>
                  <Button size="sm" variant="secondary">Apply</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Soil Health Card</span>
                  <Button size="sm" variant="secondary">Check Status</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Crop Insurance</span>
                  <Button size="sm" variant="secondary">Register</Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/government-schemes")}
                >
                  View All Schemes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Farm Analytics</span>
              </CardTitle>
              <CardDescription>
                Insights and trends for your farm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-sm font-medium text-success-foreground">
                    📈 Farm Health Score: 82%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Excellent conditions for {topCrop.name}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/crop-advisor")}
                >
                  View Full Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;