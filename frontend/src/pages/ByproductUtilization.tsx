import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  Recycle, 
  Factory, 
  MapPin, 
  TrendingUp, 
  Leaf, 
  Building2,
  Phone,
  Calculator,
  Target,
  Truck,
  Play,
  ArrowUp,
  Star,
  CheckCircle
} from "lucide-react";

interface ByproductOption {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  estimatedValue: number;
  priceRange: {
    min: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
  };
  applications: string[];
  nearbyBuyers: BuyerInfo[];
  processingOptions: ProcessingOption[];
  image: string;
  videoUrl?: string;
}

interface BuyerInfo {
  name: string;
  location: string;
  distance: number;
  rate: number;
  contact: string;
  verified: boolean;
  type: string;
  status: 'Active' | 'Inactive';
  thumbnail: string;
  rating: number;
}

interface ProcessingOption {
  method: string;
  cost: number;
  output: string;
  valueIncrease: number;
  icon: string;
  nearbyPlants: number;
}

const ByproductUtilization = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [byproductOptions, setByproductOptions] = useState<ByproductOption[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockByproducts: ByproductOption[] = [
    {
      id: "rice-straw",
      name: "Rice Straw",
      type: "Agricultural Residue",
      quantity: 2.5,
      unit: "tonnes",
      estimatedValue: 15000,
      priceRange: {
        min: 5.5,
        max: 7.2,
        trend: 'up'
      },
      applications: ["Paper Manufacturing", "Bio-fuel Production", "Animal Bedding", "Mushroom Cultivation"],
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      nearbyBuyers: [
        {
          name: "Green Paper Mills Ltd.",
          location: "Pune Industrial Area",
          distance: 12,
          rate: 6000,
          contact: "+91-9876543210",
          verified: true,
          type: "Paper Mills",
          status: "Active",
          thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&h=100&fit=crop",
          rating: 4.5
        },
        {
          name: "BioFuel Industries",
          location: "Satara Highway",
          distance: 25,
          rate: 5500,
          contact: "+91-9876543211",
          verified: true,
          type: "Biofuel Plants",
          status: "Active",
          thumbnail: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=100&h=100&fit=crop",
          rating: 4.2
        }
      ],
      processingOptions: [
        {
          method: "Pelletization",
          cost: 2000,
          output: "Bio-pellets",
          valueIncrease: 40,
          icon: "🔄",
          nearbyPlants: 3
        },
        {
          method: "Composting",
          cost: 500,
          output: "Organic Compost",
          valueIncrease: 25,
          icon: "🌱",
          nearbyPlants: 7
        }
      ]
    },
    {
      id: "wheat-straw",
      name: "Wheat Straw",
      type: "Agricultural Residue", 
      quantity: 1.8,
      unit: "tonnes",
      estimatedValue: 12000,
      priceRange: {
        min: 6.0,
        max: 8.5,
        trend: 'stable'
      },
      applications: ["Construction Material", "Bio-energy", "Packaging", "Livestock Feed"],
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop",
      nearbyBuyers: [
        {
          name: "EcoBuild Materials",
          location: "Nashik Industrial Zone",
          distance: 18,
          rate: 6500,
          contact: "+91-9876543212",
          verified: true,
          type: "Construction Material",
          status: "Active",
          thumbnail: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&h=100&fit=crop",
          rating: 4.7
        }
      ],
      processingOptions: [
        {
          method: "Baling & Compression",
          cost: 800,
          output: "Construction Bales",
          valueIncrease: 35,
          icon: "📦",
          nearbyPlants: 5
        }
      ]
    }
  ];

  const handleAnalyze = () => {
    if (selectedCrop && quantity) {
      setIsAnalyzing(true);
      // Filter and customize results based on selected crop
      const filteredOptions = mockByproducts.filter(option => 
        selectedCrop === 'rice' ? option.id === 'rice-straw' : 
        selectedCrop === 'wheat' ? option.id === 'wheat-straw' : 
        true
      );
      
      setTimeout(() => {
        setByproductOptions(filteredOptions.length > 0 ? filteredOptions : mockByproducts);
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const handleContactBuyer = (buyerName: string, contact: string) => {
    // Simulate contacting buyer
    alert(`Connecting you with ${buyerName} at ${contact}`);
  };

  const handleProcessingInfo = (method: string) => {
    // Simulate showing processing info
    alert(`Getting detailed information about ${method} processing...`);
  };

  const resetAnalysis = () => {
    setSelectedCrop("");
    setQuantity("");
    setByproductOptions([]);
  };

  const getTotalValue = () => {
    return byproductOptions.reduce((total, option) => total + option.estimatedValue, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="🌱 Farmland By-product Utilization" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {byproductOptions.length === 0 ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl font-bold text-foreground">Turn Your Farm Waste Into Wealth</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover profitable ways to monetize your agricultural by-products. Connect with verified industries and maximize your farm income.
              </p>
            </div>

            {/* Hero Input Card */}
            <Card className="shadow-elegant border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
                  <Recycle className="h-7 w-7 text-primary" />
                  <span>Find Utilization Opportunities</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Select your crop type and quantity to discover profitable by-product opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center">
                      <Leaf className="h-4 w-4 mr-2 text-primary" />
                      Crop Type
                    </label>
                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select your crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">🌾 Rice</SelectItem>
                        <SelectItem value="wheat">🌾 Wheat</SelectItem>
                        <SelectItem value="sugarcane">🎋 Sugarcane</SelectItem>
                        <SelectItem value="corn">🌽 Corn</SelectItem>
                        <SelectItem value="cotton">🌿 Cotton</SelectItem>
                        <SelectItem value="soybean">🫘 Soybean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center">
                      <Calculator className="h-4 w-4 mr-2 text-primary" />
                      Quantity (tonnes)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleAnalyze}
                  disabled={!selectedCrop || !quantity || isAnalyzing}
                  className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:bg-gradient-primary/90"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Analyzing Your By-products...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Target className="h-6 w-6" />
                      <span>Find Utilization Opportunities</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Visual Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-card overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop" 
                    alt="Rice Straw"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary/90 text-white">Rice Straw</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Perfect for paper manufacturing and bio-fuel production</p>
                </CardContent>
              </Card>

              <Card className="shadow-card overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=200&fit=crop" 
                    alt="Wheat Straw"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary/90 text-white">Wheat Straw</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Ideal for construction materials and packaging industry</p>
                </CardContent>
              </Card>

              <Card className="shadow-card overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1516253593875-bd7ba052fbc2?w=400&h=200&fit=crop" 
                    alt="Sugarcane Bagasse"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary/90 text-white">Sugarcane Bagasse</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">High demand in pulp and paper industry</p>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Why Monetize Agricultural By-products?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <TrendingUp className="h-10 w-10 text-green-600" />
                    <div>
                      <p className="font-semibold">Extra Income</p>
                      <p className="text-sm text-muted-foreground">₹15,000-50,000 per harvest</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <Leaf className="h-10 w-10 text-blue-600" />
                    <div>
                      <p className="font-semibold">Zero Waste</p>
                      <p className="text-sm text-muted-foreground">Sustainable agriculture</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <Building2 className="h-10 w-10 text-purple-600" />
                    <div>
                      <p className="font-semibold">Industrial Links</p>
                      <p className="text-sm text-muted-foreground">Direct industry connections</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                    <Target className="h-10 w-10 text-orange-600" />
                    <div>
                      <p className="font-semibold">Market Access</p>
                      <p className="text-sm text-muted-foreground">Verified buyers network</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Summary */}
            <Card className="shadow-elegant bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">By-product Analysis Results</CardTitle>
                    <CardDescription className="text-base">
                      Found {byproductOptions.length} profitable opportunities for your {selectedCrop} residue
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xl px-6 py-3 bg-gradient-primary text-white">
                    Total Value: ₹{getTotalValue().toLocaleString()}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {byproductOptions.map((option) => (
                <Card key={option.id} className="shadow-elegant overflow-hidden">
                  {/* Product Image & Video */}
                  <div className="relative">
                    <img 
                      src={option.image} 
                      alt={option.name}
                      className="w-full h-48 object-cover"
                    />
                    {option.videoUrl && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Button variant="ghost" className="text-white hover:bg-white/20">
                          <Play className="h-8 w-8" />
                        </Button>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white text-lg px-4 py-2">
                        {option.name}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Value Insights */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center">
                          📈 By-product Value Insights
                        </h4>
                        <div className="flex items-center space-x-1">
                          <ArrowUp className={`h-4 w-4 ${option.priceRange.trend === 'up' ? 'text-green-600' : 'text-gray-500'}`} />
                          <span className="text-sm font-medium">
                            {option.priceRange.trend === 'up' ? 'Rising' : 'Stable'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                          ₹{option.priceRange.min} - ₹{option.priceRange.max}/kg
                        </span>
                        <Badge className="bg-green-600 text-white">
                          ₹{option.estimatedValue.toLocaleString()} Total
                        </Badge>
                      </div>
                    </div>

                    {/* Industry Connections */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                        Industry Connections
                      </h4>
                      <div className="space-y-3">
                        {option.nearbyBuyers.map((buyer, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:shadow-card transition-shadow">
                            <div className="flex items-start space-x-3">
                              <img 
                                src={buyer.thumbnail} 
                                alt={buyer.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold">{buyer.name}</span>
                                  <div className="flex items-center space-x-2">
                                    {buyer.verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                                    <Badge variant={buyer.status === 'Active' ? 'default' : 'secondary'}>
                                      {buyer.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 mb-2">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="text-sm">{buyer.rating}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <span className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {buyer.distance}km • {buyer.type}
                                  </span>
                                  <span className="font-semibold text-green-600">₹{buyer.rate}/tonne</span>
                                </div>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => handleContactBuyer(buyer.name, buyer.contact)}>
                                <Phone className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Processing Options */}
                    {option.processingOptions.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Factory className="h-5 w-5 mr-2 text-purple-600" />
                          Processing Options
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {option.processingOptions.map((process, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-2xl">{process.icon}</span>
                                  <span className="font-semibold">{process.method}</span>
                                </div>
                                <Badge className="bg-green-600 text-white">
                                  +{process.valueIncrease}%
                                </Badge>
                              </div>
                              <div className="text-sm space-y-1">
                                <p><span className="font-medium">Output:</span> {process.output}</p>
                                <p><span className="font-medium">Cost:</span> ₹{process.cost}</p>
                                <p><span className="font-medium">Nearby Plants:</span> {process.nearbyPlants}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="flex space-x-3 pt-4">
                    <Button 
                      className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90"
                      onClick={() => alert(`Connecting you with all ${option.nearbyBuyers.length} verified buyers for ${option.name}`)}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Connect Buyers
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => alert(`Finding ${option.processingOptions.length} processing facilities for ${option.name}`)}
                    >
                      <Factory className="h-4 w-4 mr-2" />
                      Find Processors
                    </Button>
                  </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom Action Card */}
            <Card className="shadow-card bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">Ready to monetize your by-products?</p>
                    <p className="text-muted-foreground">Connect with verified buyers and processing facilities in your area</p>
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={resetAnalysis} size="lg">
                      <Calculator className="h-5 w-5 mr-2" />
                      Analyze Again
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => alert("Our support team will contact you within 24 hours!")}>
                      <Phone className="h-5 w-5 mr-2" />
                      Get Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ByproductUtilization;