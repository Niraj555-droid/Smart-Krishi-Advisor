import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Zap,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  Sunrise,
  Sunset
} from "lucide-react";

interface WeatherData {
  date: string;
  day: string;
  temperature: {
    max: number;
    min: number;
  };
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: "sunny" | "cloudy" | "rainy" | "thunderstorm";
  advisory: string;
  farmingActivity: string;
}

interface Alert {
  type: "warning" | "advisory" | "emergency";
  title: string;
  message: string;
  validUntil: string;
}

const Weather = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  // Mock 5-day weather forecast
  const weatherForecast: WeatherData[] = [
    {
      date: "2024-08-23",
      day: "Today",
      temperature: { max: 28, min: 22 },
      humidity: 75,
      windSpeed: 12,
      precipitation: 5,
      condition: "cloudy",
      advisory: "Good conditions for fieldwork. Light cloud cover provides protection from harsh sun.",
      farmingActivity: "Ideal for sowing, weeding, and harvester operations"
    },
    {
      date: "2024-08-24",
      day: "Tomorrow", 
      temperature: { max: 30, min: 24 },
      humidity: 80,
      windSpeed: 8,
      precipitation: 15,
      condition: "rainy",
      advisory: "Light rain expected. Postpone spray operations and harvesting.",
      farmingActivity: "Indoor activities recommended. Check drainage systems"
    },
    {
      date: "2024-08-25",
      day: "Sunday",
      temperature: { max: 32, min: 25 },
      humidity: 85,
      windSpeed: 15,
      precipitation: 25,
      condition: "thunderstorm",
      advisory: "Heavy rain with thunderstorm. Secure equipment and livestock.",
      farmingActivity: "Avoid all outdoor farm activities. Emergency preparedness"
    },
    {
      date: "2024-08-26",
      day: "Monday",
      temperature: { max: 29, min: 23 },
      humidity: 70,
      windSpeed: 10,
      precipitation: 0,
      condition: "sunny",
      advisory: "Clear weather after rain. Perfect for post-rain field inspection.",
      farmingActivity: "Resume normal operations. Check for waterlogging"
    },
    {
      date: "2024-08-27",
      day: "Tuesday",
      temperature: { max: 31, min: 24 },
      humidity: 65,
      windSpeed: 14,
      precipitation: 0,
      condition: "sunny",
      advisory: "Sunny and warm. Good for drying harvested crops.",
      farmingActivity: "Ideal for harvesting, threshing, and field preparation"
    }
  ];

  const weatherAlerts: Alert[] = [
    {
      type: "warning",
      title: "Heavy Rain Alert",
      message: "Heavy rainfall (50-100mm) expected on Aug 25. Secure your crops and equipment. Avoid pesticide/fertilizer application.",
      validUntil: "Aug 25, 11:59 PM"
    },
    {
      type: "advisory",
      title: "Post-Rain Field Care",
      message: "After heavy rain on Aug 25, check fields for waterlogging. Apply fungicide if needed to prevent crop diseases.",
      validUntil: "Aug 27, 6:00 PM"
    }
  ];

  const seasonalTips = [
    "Monitor crops for fungal diseases due to high humidity",
    "Ensure proper drainage in fields to prevent waterlogging",
    "Store harvested crops in dry places to prevent spoilage",
    "Check weather forecast before applying fertilizers or pesticides",
    "Prepare farm equipment for post-rain field operations"
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny": return <Sun className="h-6 w-6 text-yellow-500" />;
      case "cloudy": return <Cloud className="h-6 w-6 text-gray-500" />;
      case "rainy": return <CloudRain className="h-6 w-6 text-blue-500" />;
      case "thunderstorm": return <Zap className="h-6 w-6 text-purple-500" />;
      default: return <Cloud className="h-6 w-6 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "emergency": return "border-destructive/20 bg-destructive/5";
      case "warning": return "border-warning/20 bg-warning/5";
      case "advisory": return "border-primary/20 bg-primary/5";
      default: return "border-muted";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "emergency": return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "advisory": return <CheckCircle className="h-5 w-5 text-primary" />;
      default: return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const selectedWeather = weatherForecast[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Weather & Agro-Advisory" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Location Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {userProfile?.village}, {userProfile?.district}, {userProfile?.state}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Last Updated: 2 hours ago</span>
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <div className="space-y-3 mb-6">
            {weatherAlerts.map((alert, index) => (
              <Card key={index} className={`shadow-card ${getAlertColor(alert.type)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
                      <p className="text-sm text-foreground mb-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">Valid until: {alert.validUntil}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 5-Day Forecast Overview */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="h-5 w-5" />
              <span>5-Day Weather Forecast</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {weatherForecast.map((weather, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedDay === index 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{weather.day}</div>
                    <div className="mb-2">{getWeatherIcon(weather.condition)}</div>
                    <div className="text-sm font-semibold">
                      {weather.temperature.max}°/{weather.temperature.min}°
                    </div>
                    <div className="text-xs text-muted-foreground">{weather.precipitation}mm</div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Weather for Selected Day */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getWeatherIcon(selectedWeather.condition)}
                <span>{selectedWeather.day} - Detailed Forecast</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {selectedWeather.condition.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Weather Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Thermometer className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">Temperature</div>
                <div className="font-semibold">
                  {selectedWeather.temperature.max}°C / {selectedWeather.temperature.min}°C
                </div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">Humidity</div>
                <div className="font-semibold">{selectedWeather.humidity}%</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Wind className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">Wind Speed</div>
                <div className="font-semibold">{selectedWeather.windSpeed} km/h</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <CloudRain className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">Rainfall</div>
                <div className="font-semibold">{selectedWeather.precipitation}mm</div>
              </div>
            </div>

            {/* Advisory & Farming Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold text-primary mb-2 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Weather Advisory</span>
                </h4>
                <p className="text-sm text-foreground">{selectedWeather.advisory}</p>
              </div>
              
              <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                <h4 className="font-semibold text-success mb-2 flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Recommended Activities</span>
                </h4>
                <p className="text-sm text-foreground">{selectedWeather.farmingActivity}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sun Times */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sun className="h-5 w-5" />
                <span>Sun Times & Visibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sunrise className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Sunrise</span>
                  </div>
                  <span className="font-semibold">6:15 AM</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sunset className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Sunset</span>
                  </div>
                  <span className="font-semibold">7:45 PM</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <span className="font-semibold">8 km</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">UV Index</span>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    MODERATE (6)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Farming Tips */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Seasonal Farming Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seasonalTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-foreground">{tip}</p>
                  </div>
                ))}
              </div>
              
              <Button size="sm" className="mt-4 w-full">
                Get Personalized Advisory
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Weather;