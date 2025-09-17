import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  Camera, 
  Scan, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Beaker,
  Globe,
  ArrowRight,
  Upload,
  Leaf,
  Bug,
  Star,
  Download,
  Users,
  Award,
  Target
} from "lucide-react";

interface PesticideReport {
  id: string;
  name: string;
  activeIngredient: string;
  safetyRating: "Safe" | "Caution" | "Danger";
  labTestDate: string;
  effectiveness: number;
  dosage: string;
  alternatives: Alternative[];
  localLanguageGuide: boolean;
  cropCompatibility: CropCompatibility[];
  qualityScore: number;
  certifications: string[];
  manufacturer: string;
  expiryDate: string;
}

interface Alternative {
  name: string;
  price: string;
  effectiveness: number;
  safetyRating: "Safe" | "Caution" | "Danger";
  availability: string;
}

interface CropCompatibility {
  crop: string;
  compatibility: number;
  recommendedFor: string[];
  notRecommendedFor: string[];
}

const PesticideVerification = () => {
  const [pesticideName, setPesticideName] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [pesticideReport, setPesticideReport] = useState<PesticideReport | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockReport: PesticideReport = {
    id: "PST-2024-001",
    name: "AgriGuard Pro Insecticide",
    activeIngredient: "Imidacloprid 17.8% SL",
    safetyRating: "Safe",
    labTestDate: "2024-01-15",
    effectiveness: 87,
    dosage: "2ml per liter of water",
    qualityScore: 92,
    manufacturer: "BioAgri Sciences Ltd.",
    expiryDate: "2025-12-31",
    certifications: ["ISO 9001", "BIS Certified", "CIBRC Approved"],
    alternatives: [
      {
        name: "BioPest Natural",
        price: "₹450/L",
        effectiveness: 89,
        safetyRating: "Safe",
        availability: "In Stock"
      },
      {
        name: "EcoShield Organic", 
        price: "₹380/L",
        effectiveness: 76,
        safetyRating: "Safe",
        availability: "Limited"
      },
      {
        name: "CropSafe Plus",
        price: "₹520/L", 
        effectiveness: 94,
        safetyRating: "Caution",
        availability: "In Stock"
      }
    ],
    cropCompatibility: [
      {
        crop: "Rice",
        compatibility: 95,
        recommendedFor: ["Brown Plant Hopper", "Stem Borer", "Leaf Folder"],
        notRecommendedFor: ["White Backed Plant Hopper"]
      },
      {
        crop: "Cotton",
        compatibility: 88,
        recommendedFor: ["Bollworm", "Aphids", "Thrips"],
        notRecommendedFor: ["Pink Bollworm in flowering stage"]
      }
    ],
    localLanguageGuide: true
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setPesticideReport(mockReport);
    }, 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyProduct = () => {
    if ((!uploadedImage && !pesticideName.trim()) || !cropType || !diseaseName) {
      return;
    }
    
    setIsVerifying(true);
    // Simulate AI verification process
    setTimeout(() => {
      setIsVerifying(false);
      setPesticideReport(mockReport);
    }, 4000);
  };

  const resetForm = () => {
    setPesticideName("");
    setUploadedImage(null);
    setCropType("");
    setDiseaseName("");
    setPesticideReport(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case "Safe": return "bg-green-500";
      case "Caution": return "bg-yellow-500";
      case "Danger": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="🧪 Smart Pesticide Verification" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {!pesticideReport ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl font-bold text-foreground">Smart Pesticide Verification</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Verify pesticide authenticity with AI-powered lab reports. Protect your crops with trusted, certified products.
              </p>
            </div>

            {/* Main Input Card */}
            <Card className="shadow-elegant border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
                  <Shield className="h-7 w-7 text-primary" />
                  <span>Product Verification System</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Upload pesticide image or scan barcode, specify your crop and disease for comprehensive analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Image Upload Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-primary" />
                      Product Image
                    </h3>
                    
                    {!uploadedImage ? (
                      <div className="space-y-4">
                        <div 
                          className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground mb-2">Click to upload pesticide image</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG or PDF up to 10MB</p>
                        </div>
                        
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        
                        <div className="text-center">
                          <div className="relative mb-4">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t border-muted" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-card px-2 text-muted-foreground">Or scan barcode</span>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={handleScan}
                            disabled={isScanning}
                            variant="outline"
                            className="w-full h-12"
                          >
                            {isScanning ? (
                              <div className="flex items-center space-x-2">
                                {/* Scanning Animation */}
                                <div className="relative">
                                  <Scan className="h-6 w-6 text-primary" />
                                  <div className="absolute inset-0 border-2 border-primary rounded animate-pulse"></div>
                                </div>
                                <span>Scanning...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Scan className="h-6 w-6" />
                                <span>Start Camera Scan</span>
                              </div>
                            )}
                          </Button>
                          
                          <div className="mt-3">
                            <Input
                              placeholder="Or enter pesticide name (e.g., Dimethoate, Chlorpyrifos)"
                              value={pesticideName}
                              onChange={(e) => setPesticideName(e.target.value)}
                              className="text-center"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded pesticide product"
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          <Button 
                            onClick={() => setUploadedImage(null)}
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            Remove
                          </Button>
                        </div>
                        <Badge className="w-full justify-center py-2 bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Image uploaded successfully
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Crop and Disease Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground flex items-center">
                        <Leaf className="h-4 w-4 mr-2 text-primary" />
                        Crop Type
                      </label>
                      <Select value={cropType} onValueChange={setCropType}>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select your crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rice">🌾 Rice</SelectItem>
                          <SelectItem value="wheat">🌾 Wheat</SelectItem>
                          <SelectItem value="cotton">🌿 Cotton</SelectItem>
                          <SelectItem value="sugarcane">🎋 Sugarcane</SelectItem>
                          <SelectItem value="corn">🌽 Corn</SelectItem>
                          <SelectItem value="soybean">🫘 Soybean</SelectItem>
                          <SelectItem value="tomato">🍅 Tomato</SelectItem>
                          <SelectItem value="potato">🥔 Potato</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground flex items-center">
                        <Bug className="h-4 w-4 mr-2 text-primary" />
                        Disease/Pest Name
                      </label>
                      <Input
                        placeholder="e.g., Brown Plant Hopper, Stem Borer, Aphids"
                        value={diseaseName}
                        onChange={(e) => setDiseaseName(e.target.value)}
                        className="h-12 text-base"
                      />
                      <p className="text-xs text-muted-foreground">
                        Specify the pest or disease you want to treat for better recommendations
                      </p>
                    </div>

                    {/* Illustrations */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Beaker className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-xs font-medium">Lab Verified</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-xs font-medium">Certified Quality</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Big Green Verify Button */}
                <Button 
                  onClick={handleVerifyProduct}
                  disabled={(!uploadedImage && !pesticideName.trim()) || !cropType || !diseaseName || isVerifying}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                >
                  {isVerifying ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      <div className="text-left">
                        <p className="text-lg">AI Analysis in Progress...</p>
                        <p className="text-sm opacity-90">Generating comprehensive report</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Target className="h-8 w-8" />
                      <span>Verify Product & Generate Report</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center p-4 shadow-card hover:shadow-md transition-shadow">
                <Beaker className="h-10 w-10 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Lab-Tested Report</h4>
                <p className="text-sm text-muted-foreground">Comprehensive analysis with effectiveness ratings</p>
              </Card>
              
              <Card className="text-center p-4 shadow-card hover:shadow-md transition-shadow">
                <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Crop Compatibility</h4>
                <p className="text-sm text-muted-foreground">Verified suitability for your specific crops</p>
              </Card>
              
              <Card className="text-center p-4 shadow-card hover:shadow-md transition-shadow">
                <Globe className="h-10 w-10 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Local Language Guide</h4>
                <p className="text-sm text-muted-foreground">Instructions in Hindi, Marathi & regional languages</p>
              </Card>
              
              <Card className="text-center p-4 shadow-card hover:shadow-md transition-shadow">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Smart Alternatives</h4>
                <p className="text-sm text-muted-foreground">Better & safer product recommendations</p>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Success Header */}
            <div className="text-center space-y-4">
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-400 font-medium">
                  ✅ Product verified successfully! AI-generated lab report ready below.
                </AlertDescription>
              </Alert>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Uploaded Image Display */}
              <div className="lg:col-span-1">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Scanned Product</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {uploadedImage ? (
                      <div className="space-y-3">
                        <img 
                          src={uploadedImage} 
                          alt="Scanned pesticide product"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Badge className="w-full justify-center py-1 bg-green-100 text-green-800">
                          Image Analyzed
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Scan className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Barcode Scanned</p>
                      </div>
                    )}
                    
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Crop:</span>
                        <span className="font-medium capitalize">{cropType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="font-medium">{diseaseName}</span>
                      </div>
                      {pesticideName && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Product:</span>
                          <span className="font-medium">{pesticideName}</span>
                        </div>
                      )}
                    </div>

                    <Button onClick={resetForm} className="w-full mt-4" variant="outline">
                      <Scan className="h-4 w-4 mr-2" />
                      Scan New Product
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Report Cards */}
              <div className="lg:col-span-3 space-y-6">
                {/* Lab-Tested Report Card */}
                <Card className="shadow-elegant border-l-4 border-l-primary">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <Beaker className="h-6 w-6 text-primary" />
                      <span>🧪 Lab-Tested Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{pesticideReport.qualityScore}%</div>
                        <div className="text-sm text-muted-foreground">Quality Score</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{pesticideReport.effectiveness}%</div>
                        <div className="text-sm text-muted-foreground">Effectiveness</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                        <Badge className={`${getSafetyColor(pesticideReport.safetyRating)} text-white text-lg px-3 py-1`}>
                          {pesticideReport.safetyRating}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-2">Safety Rating</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">User Rating</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Product Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{pesticideReport.name}</span></div>
                          <div><span className="text-muted-foreground">Active Ingredient:</span> <span className="font-medium">{pesticideReport.activeIngredient}</span></div>
                          <div><span className="text-muted-foreground">Manufacturer:</span> <span className="font-medium">{pesticideReport.manufacturer}</span></div>
                          <div><span className="text-muted-foreground">Lab Test Date:</span> <span className="font-medium">{pesticideReport.labTestDate}</span></div>
                          <div><span className="text-muted-foreground">Expiry Date:</span> <span className="font-medium">{pesticideReport.expiryDate}</span></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {pesticideReport.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="bg-primary/10">
                              <Award className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Recommended Dosage</h4>
                          <p className="text-lg font-bold text-primary">{pesticideReport.dosage}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Crop Compatibility Card */}
                <Card className="shadow-elegant border-l-4 border-l-green-500">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <span>🌱 Crop Compatibility Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pesticideReport.cropCompatibility.map((crop, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{crop.crop}</h4>
                            <Badge className="bg-green-100 text-green-800">
                              {crop.compatibility}% Compatible
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-green-600">✅ Recommended for:</p>
                              <p className="text-sm text-muted-foreground">{crop.recommendedFor.join(', ')}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-red-600">❌ Not recommended for:</p>
                              <p className="text-sm text-muted-foreground">{crop.notRecommendedFor.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Local Language Guide Card */}
                <Card className="shadow-elegant border-l-4 border-l-blue-500">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <Globe className="h-6 w-6 text-blue-600" />
                      <span>🗣️ Local Language Guide</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            Application Instructions
                          </h4>
                          <ul className="text-sm space-y-1">
                            <li>• Mix {pesticideReport.dosage} for optimal results</li>
                            <li>• Apply during early morning (6-8 AM) or evening (4-6 PM)</li>
                            <li>• Ensure uniform coverage on affected plant parts</li>
                            <li>• Avoid spraying during rain or high wind</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center">
                            <Shield className="h-4 w-4 text-red-600 mr-2" />
                            Safety Precautions
                          </h4>
                          <ul className="text-sm space-y-1">
                            <li>• Wear protective clothing, gloves & mask</li>
                            <li>• Keep away from children and livestock</li>
                            <li>• Do not eat, drink or smoke during use</li>
                            <li>• Wash hands and face after application</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        हिंदी गाइड
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        मराठी गाइड
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        English Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Smart Alternatives Card */}
                <Card className="shadow-elegant border-l-4 border-l-purple-500">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <Users className="h-6 w-6 text-purple-600" />
                      <span>🔄 Smart Alternatives</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {pesticideReport.alternatives.map((alt, index) => (
                        <Card key={index} className="p-4 border hover:shadow-md transition-shadow">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{alt.name}</h4>
                              <Badge className={`${getSafetyColor(alt.safetyRating)} text-white text-xs`}>
                                {alt.safetyRating}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Price:</span>
                                <span className="font-medium">{alt.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Effectiveness:</span>
                                <span className="font-medium text-green-600">{alt.effectiveness}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Availability:</span>
                                <Badge variant={alt.availability === 'In Stock' ? 'default' : 'secondary'} className="text-xs">
                                  {alt.availability}
                                </Badge>
                              </div>
                            </div>
                            
                            <Button size="sm" className="w-full" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                <Download className="h-4 w-4 mr-2" />
                Download Complete Report
              </Button>
              <Button variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Quality Issue
              </Button>
              <Button onClick={resetForm} variant="secondary">
                <Scan className="h-4 w-4 mr-2" />
                Verify Another Product
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PesticideVerification;