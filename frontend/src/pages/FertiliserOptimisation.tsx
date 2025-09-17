import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { useLocation } from "@/contexts/LocationContext";
import { 
  Leaf, 
  Beaker, 
  Droplets, 
  Shield, 
  TrendingUp,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

interface NPKRecommendation {
  crop: string;
  stage: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  application: string[];
  timing: string;
  cost: string;
}

interface PesticideRecommendation {
  name: string;
  type: 'fungicide' | 'insecticide' | 'herbicide';
  dosage: string;
  application: string;
  targetPest: string;
  cost: string;
  priority: 'high' | 'medium' | 'low';
}

interface WaterOptimization {
  dailyRequirement: string;
  frequency: string;
  method: string;
  efficiency: number;
  savings: string;
}

const FertiliserOptimisation = () => {
  const { userLocation } = useLocation();
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [selectedStage, setSelectedStage] = useState("tillering");

  const npkRecommendations: Record<string, Record<string, NPKRecommendation>> = {
    wheat: {
      tillering: {
        crop: "Wheat",
        stage: "Tillering Stage",
        nitrogen: 150,
        phosphorus: 75,
        potassium: 60,
        application: [
          "Apply full phosphorus and potassium as basal",
          "Apply 50% nitrogen as basal dose",
          "Remaining nitrogen at tillering and flowering"
        ],
        timing: "20-25 days after sowing",
        cost: "₹3,800 per hectare"
      },
      flowering: {
        crop: "Wheat",
        stage: "Flowering Stage",
        nitrogen: 120,
        phosphorus: 60,
        potassium: 50,
        application: [
          "Apply remaining nitrogen at flowering",
          "Monitor for disease symptoms",
          "Ensure adequate water supply"
        ],
        timing: "At 50% flowering stage",
        cost: "₹2,200 per hectare"
      }
    },
    maize: {
      vegetative: {
        crop: "Maize",
        stage: "Vegetative Stage",
        nitrogen: 120,
        phosphorus: 80,
        potassium: 60,
        application: [
          "Apply full dose of phosphorus as basal",
          "Apply 50% nitrogen as basal dose",
          "Apply remaining nitrogen in 2 splits",
          "Potassium in equal splits"
        ],
        timing: "30-35 days after sowing",
        cost: "₹4,100 per hectare"
      },
      tasseling: {
        crop: "Maize",
        stage: "Tasseling Stage", 
        nitrogen: 90,
        phosphorus: 60,
        potassium: 40,
        application: [
          "Apply remaining nitrogen before tasseling",
          "Ensure proper moisture",
          "Monitor for pest damage"
        ],
        timing: "At tasseling stage",
        cost: "₹3,200 per hectare"
      }
    },
    rice: {
      transplanting: {
        crop: "Rice",
        stage: "Transplanting Stage",
        nitrogen: 100,
        phosphorus: 50,
        potassium: 50,
        application: [
          "Apply full phosphorus as basal",
          "Apply 25% nitrogen at transplanting",
          "Split nitrogen in 3 applications",
          "Potassium in 2 splits"
        ],
        timing: "At transplanting",
        cost: "₹3,500 per hectare"
      },
      panicle: {
        crop: "Rice",
        stage: "Panicle Initiation",
        nitrogen: 80,
        phosphorus: 40,
        potassium: 40,
        application: [
          "Apply nitrogen at panicle initiation",
          "Maintain water level at 2-3 cm",
          "Apply remaining potassium"
        ],
        timing: "At panicle initiation stage",
        cost: "₹2,800 per hectare"
      }
    }
  };

  const pesticideRecommendations: PesticideRecommendation[] = [
    {
      name: "Imidacloprid 17.8% SL",
      type: 'insecticide',
      dosage: "0.5 ml per liter",
      application: "Foliar spray during early morning",
      targetPest: "Aphids, Whitefly, Thrips",
      cost: "₹380 per hectare",
      priority: 'high'
    },
    {
      name: "Mancozeb 75% WP",
      type: 'fungicide', 
      dosage: "2.5 g per liter",
      application: "Foliar spray at 15-day intervals",
      targetPest: "Leaf spot, Blight diseases",
      cost: "₹420 per hectare",
      priority: 'high'
    },
    {
      name: "Chlorpyrifos 20% EC",
      type: 'insecticide',
      dosage: "2 ml per liter",
      application: "Soil application or foliar spray",
      targetPest: "Bollworm, Cutworm",
      cost: "₹520 per hectare",
      priority: 'medium'
    },
    {
      name: "2,4-D Sodium Salt 80% WP",
      type: 'herbicide',
      dosage: "1.25 g per liter",
      application: "Post-emergence spray",
      targetPest: "Broad-leaf weeds",
      cost: "₹290 per hectare",
      priority: 'low'
    }
  ];

  const waterOptimization: WaterOptimization = {
    dailyRequirement: "25-30 mm",
    frequency: "Every 7-10 days",
    method: "Drip irrigation recommended",
    efficiency: 85,
    savings: "₹8,500 per season"
  };

  const currentNPK = npkRecommendations[selectedCrop]?.[selectedStage] || npkRecommendations.wheat.tillering;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'insecticide': return <Shield className="h-4 w-4 text-red-500" />;
      case 'fungicide': return <Beaker className="h-4 w-4 text-blue-500" />;
      case 'herbicide': return <Leaf className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Fertiliser & Resource Optimisation" showLogo={false} />
      
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
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Growth Stage</label>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tillering">Tillering Stage</SelectItem>
                    <SelectItem value="flowering">Flowering Stage</SelectItem>
                    <SelectItem value="vegetative">Vegetative Stage</SelectItem>
                    <SelectItem value="tasseling">Tasseling Stage</SelectItem>
                    <SelectItem value="transplanting">Transplanting Stage</SelectItem>
                    <SelectItem value="panicle">Panicle Initiation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NPK Recommendation */}
        <Card className="shadow-elevated mb-8 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center space-x-2">
              <Beaker className="h-6 w-6 text-primary" />
              <span>NPK Fertiliser Recommendation</span>
            </CardTitle>
            <CardDescription>
              Optimized nutrient doses for {currentNPK.crop} - {currentNPK.stage}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* NPK Values */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{currentNPK.nitrogen}</div>
                  <div className="text-sm font-medium text-blue-800">Nitrogen (N)</div>
                  <div className="text-xs text-blue-600">kg per hectare</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{currentNPK.phosphorus}</div>
                  <div className="text-sm font-medium text-green-800">Phosphorus (P)</div>
                  <div className="text-xs text-green-600">kg per hectare</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{currentNPK.potassium}</div>
                  <div className="text-sm font-medium text-purple-800">Potassium (K)</div>
                  <div className="text-xs text-purple-600">kg per hectare</div>
                </div>
              </div>

              {/* Application Guidelines */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Application Guidelines</span>
                </h4>
                <div className="space-y-2">
                  {currentNPK.application.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg border">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm">{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timing & Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-background">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Best Timing</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentNPK.timing}</p>
                </Card>
                <Card className="p-4 bg-background">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Estimated Cost</span>
                  </div>
                  <p className="text-sm font-semibold text-green-600">{currentNPK.cost}</p>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pesticide Recommendations */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Top 2 Pesticide Recommendations</span>
            </CardTitle>
            <CardDescription>
              Based on current pest risk and local weather conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pesticideRecommendations.slice(0, 2).map((pesticide, index) => (
                <Card key={index} className={`p-4 border-l-4 ${getPriorityColor(pesticide.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(pesticide.type)}
                        <div className="text-xs uppercase font-semibold text-muted-foreground">
                          {pesticide.type}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold">{pesticide.name}</h4>
                          {getPriorityBadge(pesticide.priority)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Target Pest:</span>
                            <p className="text-muted-foreground">{pesticide.targetPest}</p>
                          </div>
                          <div>
                            <span className="font-medium">Dosage:</span>
                            <p className="text-muted-foreground">{pesticide.dosage}</p>
                          </div>
                          <div>
                            <span className="font-medium">Application:</span>
                            <p className="text-muted-foreground">{pesticide.application}</p>
                          </div>
                          <div>
                            <span className="font-medium">Cost:</span>
                            <p className="font-semibold text-green-600">{pesticide.cost}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Water Usage Optimization */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="h-5 w-5" />
              <span>Water Usage Optimization</span>
            </CardTitle>
            <CardDescription>
              Efficient irrigation recommendations for better water management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Water Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 text-center bg-blue-50 border-blue-200">
                  <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-800">Daily Requirement</div>
                  <div className="text-lg font-bold text-blue-600">{waterOptimization.dailyRequirement}</div>
                </Card>
                
                <Card className="p-4 text-center bg-green-50 border-green-200">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-green-800">Frequency</div>
                  <div className="text-lg font-bold text-green-600">{waterOptimization.frequency}</div>
                </Card>
                
                <Card className="p-4 text-center bg-purple-50 border-purple-200">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-purple-800">Efficiency</div>
                  <div className="text-lg font-bold text-purple-600">{waterOptimization.efficiency}%</div>
                </Card>
                
                <Card className="p-4 text-center bg-yellow-50 border-yellow-200">
                  <CheckCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="font-semibold text-yellow-800">Potential Savings</div>
                  <div className="text-lg font-bold text-yellow-600">{waterOptimization.savings}</div>
                </Card>
              </div>

              {/* Irrigation Method */}
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Recommended Method</h4>
                    <p className="text-blue-700">{waterOptimization.method}</p>
                    <p className="text-sm text-blue-600">Saves water and reduces labor costs significantly</p>
                  </div>
                </div>
              </Card>

              {/* Water Efficiency Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Water Use Efficiency</span>
                  <span className="font-bold text-blue-600">{waterOptimization.efficiency}%</span>
                </div>
                <Progress value={waterOptimization.efficiency} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  Compared to traditional flood irrigation (45% efficiency)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default FertiliserOptimisation;