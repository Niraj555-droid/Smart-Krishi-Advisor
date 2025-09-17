import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { useLocation } from "@/contexts/LocationContext";
import { 
  Wheat, 
  TrendingUp, 
  Droplets, 
  Sprout, 
  Shield,
  Bell,
  BarChart3,
  ArrowRight,
  MapPin
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { userLocation } = useLocation();

  const features = [
    {
      title: "🌾 Crop Advisor",
      description: "Smart crop recommendations based on your location and soil conditions",
      icon: Sprout,
      path: "/crop-advisor",
      color: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "💰 Market Analysis", 
      description: "Real-time mandi prices and market trends",
      icon: TrendingUp,
      path: "/market-analysis",
      color: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      title: "🌧️ Weather Forecast",
      description: "Accurate weather forecasts and farming advisories",
      icon: Droplets,
      path: "/weather",
      color: "bg-gradient-to-r from-cyan-500 to-cyan-600"
    },
    {
      title: "📊 Yield Predictor",
      description: "Predict crop yields with advanced analytics",
      icon: BarChart3,
      path: "/yield-predictor", 
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      title: "🌱 Fertiliser Optimisation",
      description: "NPK recommendations and resource optimization",
      icon: Shield,
      path: "/fertiliser-optimisation",
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600"
    },
    {
      title: "🔔 Smart Alerts",
      description: "Timely notifications for farming activities",
      icon: Bell,
      path: "/notification-alerts",
      color: "bg-gradient-to-r from-red-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Wheat className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Smart Krishi Advisor
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your intelligent farming companion for data-driven agriculture decisions
          </p>

          {userLocation && (
            <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-6">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">
                {userLocation.district}, {userLocation.state}
              </span>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate(userLocation ? "/dashboard" : "/location-selector")}
              className="text-lg px-8 py-3"
            >
              {userLocation ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/login")}
              className="text-lg px-8 py-3"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer group"
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-primary/5 rounded-lg p-8 border border-primary/20">
          <h2 className="text-2xl font-heading font-bold text-center mb-8">
            Why Choose Smart Krishi Advisor?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Increase Yields</h3>
              <p className="text-sm text-muted-foreground">
                Data-driven recommendations to optimize crop production
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Reduce Costs</h3>
              <p className="text-sm text-muted-foreground">
                Efficient resource management and fertilizer optimization
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Smart Farming</h3>
              <p className="text-sm text-muted-foreground">
                Modern technology for traditional farming practices
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
