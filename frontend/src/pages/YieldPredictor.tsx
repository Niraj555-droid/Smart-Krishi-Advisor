import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { useLocation } from "@/contexts/LocationContext";
import { 
  TrendingUp, 
  Thermometer, 
  Droplets, 
  Sun, 
  Cloud,
  Leaf,
  BarChart3,
  Calendar,
  MapPin
} from "lucide-react";

interface YieldPrediction {
  crop: string;
  predictedYield: number;
  unit: string;
  confidenceScore: number;
  factors: {
    weather: number;
    soil: number;
    water: number;
    season: number;
  };
  comparison: {
    lastYear: number;
    average: number;
  };
  recommendations: string[];
}

const YieldPredictor = () => {
  const { userLocation } = useLocation();
  const [selectedCrop, setSelectedCrop] = useState("cotton");
  const [selectedSeason, setSelectedSeason] = useState("current");

  const yieldPredictions: Record<string, YieldPrediction> = {
    cotton: {
      crop: "Cotton",
      predictedYield: 2850,
      unit: "kg/hectare",
      confidenceScore: 87,
      factors: {
        weather: 85,
        soil: 90,
        water: 82,
        season: 88
      },
      comparison: {
        lastYear: 2650,
        average: 2700
      },
      recommendations: [
        "Weather conditions are favorable for cotton growth",
        "Maintain adequate irrigation during flowering stage",
        "Monitor for pink bollworm during peak season",
        "Consider intercropping with legumes to improve soil"
      ]
    },
    wheat: {
      crop: "Wheat",
      predictedYield: 3200,
      unit: "kg/hectare",
      confidenceScore: 92,
      factors: {
        weather: 95,
        soil: 88,
        water: 90,
        season: 95
      },
      comparison: {
        lastYear: 3100,
        average: 3050
      },
      recommendations: [
        "Excellent conditions for wheat cultivation",
        "Apply nitrogen fertilizer in split doses",
        "Ensure proper drainage to prevent waterlogging",
        "Monitor for rust diseases during grain filling"
      ]
    },
    soybean: {
      crop: "Soybean",
      predictedYield: 1800,
      unit: "kg/hectare",
      confidenceScore: 78,
      factors: {
        weather: 75,
        soil: 85,
        water: 70,
        season: 82
      },
      comparison: {
        lastYear: 1650,
        average: 1700
      },
      recommendations: [
        "Moderate conditions for soybean cultivation",
        "Ensure proper seed treatment before sowing",
        "Monitor rainfall patterns for irrigation planning",
        "Use rhizobium inoculant for better nodulation"
      ]
    }
  };

  const currentPrediction = yieldPredictions[selectedCrop];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-success/10 border-success/20';
    if (score >= 60) return 'bg-warning/10 border-warning/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  const weatherData = [
    { day: "Today", temp: "28°C", humidity: "65%", rainfall: "0mm", icon: Sun },
    { day: "Tomorrow", temp: "30°C", humidity: "70%", rainfall: "2mm", icon: Cloud },
    { day: "Day 3", temp: "27°C", humidity: "75%", rainfall: "5mm", icon: Cloud },
    { day: "Day 4", temp: "29°C", humidity: "68%", rainfall: "0mm", icon: Sun },
    { day: "Day 5", temp: "31°C", humidity: "60%", rainfall: "0mm", icon: Sun },
    { day: "Day 6", temp: "28°C", humidity: "72%", rainfall: "8mm", icon: Cloud },
    { day: "Day 7", temp: "26°C", humidity: "80%", rainfall: "12mm", icon: Cloud }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Yield Predictor" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {userLocation && (
          <div className="flex items-center space-x-2 text-muted-foreground mb-6">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {userLocation.district}, {userLocation.state}
            </span>
          </div>
        )}

        {/* Selection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Crop</label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="soybean">Soybean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Season</label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Season</SelectItem>
                    <SelectItem value="next">Next Season</SelectItem>
                    <SelectItem value="rabi">Rabi Season</SelectItem>
                    <SelectItem value="kharif">Kharif Season</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Prediction Card */}
        <Card className={`shadow-elevated mb-8 ${getScoreBg(currentPrediction.confidenceScore)}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Predicted Yield: {currentPrediction.predictedYield.toLocaleString()} {currentPrediction.unit}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {currentPrediction.crop} this season
                  </CardDescription>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-lg px-4 py-2 ${getScoreColor(currentPrediction.confidenceScore)}`}
              >
                {currentPrediction.confidenceScore}% Confidence
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Prediction Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Prediction Accuracy</span>
                  <span className={`font-bold ${getScoreColor(currentPrediction.confidenceScore)}`}>
                    {currentPrediction.confidenceScore}%
                  </span>
                </div>
                <Progress value={currentPrediction.confidenceScore} className="h-3" />
              </div>

              {/* Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Last Year</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {currentPrediction.comparison.lastYear.toLocaleString()} {currentPrediction.unit}
                  </div>
                  <div className="text-sm text-success">
                    +{((currentPrediction.predictedYield - currentPrediction.comparison.lastYear) / currentPrediction.comparison.lastYear * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">5-Year Average</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {currentPrediction.comparison.average.toLocaleString()} {currentPrediction.unit}
                  </div>
                  <div className="text-sm text-success">
                    +{((currentPrediction.predictedYield - currentPrediction.comparison.average) / currentPrediction.comparison.average * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contributing Factors */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5" />
              <span>Contributing Factors</span>
            </CardTitle>
            <CardDescription>
              Factors influencing the yield prediction based on past 7 days data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Weather</span>
                </div>
                <div className="flex items-center justify-between">
                  <Progress value={currentPrediction.factors.weather} className="flex-1 mr-2" />
                  <span className={`text-sm font-semibold ${getScoreColor(currentPrediction.factors.weather)}`}>
                    {currentPrediction.factors.weather}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Soil Health</span>
                </div>
                <div className="flex items-center justify-between">
                  <Progress value={currentPrediction.factors.soil} className="flex-1 mr-2" />
                  <span className={`text-sm font-semibold ${getScoreColor(currentPrediction.factors.soil)}`}>
                    {currentPrediction.factors.soil}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Water Availability</span>
                </div>
                <div className="flex items-center justify-between">
                  <Progress value={currentPrediction.factors.water} className="flex-1 mr-2" />
                  <span className={`text-sm font-semibold ${getScoreColor(currentPrediction.factors.water)}`}>
                    {currentPrediction.factors.water}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Seasonal Factors</span>
                </div>
                <div className="flex items-center justify-between">
                  <Progress value={currentPrediction.factors.season} className="flex-1 mr-2" />
                  <span className={`text-sm font-semibold ${getScoreColor(currentPrediction.factors.season)}`}>
                    {currentPrediction.factors.season}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Weather Impact */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="h-5 w-5" />
              <span>7-Day Weather Impact</span>
            </CardTitle>
            <CardDescription>
              Past week weather conditions used in yield calculation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weatherData.map((day, index) => (
                <Card key={index} className="p-3 text-center">
                  <div className="space-y-2">
                    <day.icon className="h-6 w-6 mx-auto text-primary" />
                    <div className="text-xs font-medium">{day.day}</div>
                    <div className="text-sm">
                      <div className="font-semibold">{day.temp}</div>
                      <div className="text-xs text-muted-foreground">{day.humidity}</div>
                      <div className="text-xs text-blue-600">{day.rainfall}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recommendations to Maximize Yield</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentPrediction.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg border">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm">{recommendation}</p>
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

export default YieldPredictor;