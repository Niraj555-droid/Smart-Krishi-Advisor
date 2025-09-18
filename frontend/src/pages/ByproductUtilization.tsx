import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  Recycle, 
  Leaf,
  Calculator,
  Target,
  Phone
} from "lucide-react";

// -------------------------
// TypeScript Interfaces
// -------------------------
interface CompanyOption {
  id: string;
  name: string;
  address: string;
  status: string;
  domain: string;
  distance?: number;
  rating?: number;
}

interface CompanyOptionInput {
  company_name: string;
  address: string;
  status: string;
  domain: string;
  distance?: number;
  rating?: number;
}

interface ByproductProcess {
  id: string;
  name: string;
  image: string;
  processes: {
    method: string;
    description: string;
    cost: number;
    output: string;
    valueIncrease: number;
  }[];
}

// -------------------------
// Static options
// -------------------------
const cropOptions = [
  "Tur", "Gram", "Urad", "Moong", "Lentil", "Rice", "Wheat", "Maize", "Barley", 
  "Jowar", "Bajra", "Ragi", "Small Millets", "Shree Anna / Nutri Cereals",
  "Nutri/Coarse Cereals", "Groundnut", "Castorseed", "Sesamum", "Nigerseed",
  "Soybean", "Sunflower", "Rapeseed & Mustard", "Linseed", "Safflower", "Sugarcane",
  "Cotton", "Jute", "Mesta"
];

const districts = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
  "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
  "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
  "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad",
  "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha",
  "Washim", "Yavatmal"
];

// -------------------------
// Component
// -------------------------
const ByproductUtilization = () => {
  type Page = "input" | "companies" | "process";

  const [currentPage, setCurrentPage] = useState<Page>("input");
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const [byproductList, setByproductList] = useState<ByproductProcess[]>([]);
  const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedByproductId, setSelectedByproductId] = useState<string | null>(null);

  // -------------------------
  // Mock data for byproducts
  // -------------------------
  useEffect(() => {
    if (selectedCrop) {
      const allByproducts: ByproductProcess[] = [
        {
          id: "byprod-1",
          name: "Rice Straw",
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
          processes: [
            { method: "Pelletization", description: "Turning straw into bio-pellets for energy.", cost: 1200, output: "Bio-pellets", valueIncrease: 30},
            { method: "Composting", description: "Convert to organic compost to enrich soil.", cost: 500, output: "Organic Compost", valueIncrease: 25 }
          ]
        },
        {
          id: "byprod-2",
          name: "Wheat Bran",
          image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop",
          processes: [
            { method: "Animal Feed Processing", description: "Processing bran for quality livestock feed.", cost: 1500, output: "Animal Feed", valueIncrease: 40 }
          ]
        },
        {
          id: "byprod-3",
          name: "Sugarcane Bagasse",
          image: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc2?w=400&h=300&fit=crop",
          processes: [
            { method: "Biofuel Conversion", description: "Convert bagasse into biofuel pellets.", cost: 1800, output: "Biofuel Pellets", valueIncrease: 35 },
            { method: "Paper Pulping", description: "Used in paper and fiberboard production.", cost: 2000, output: "Paper Pulp", valueIncrease: 30 }
          ]
        },
        {
          id: "byprod-4",
          name: "Cotton Seed Husk",
          image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=300&fit=crop",
          processes: [
            { method: "Oil Extraction", description: "Extract oil from seeds for edible or industrial use.", cost: 2200, output: "Cottonseed oil", valueIncrease: 50}
          ]
        },
        {
          id: "byprod-5",
          name: "Groundnut Shells",
          image: "https://images.unsplash.com/photo-1573495627925-4fabc6cbf692?w=400&h=300&fit=crop",
          processes: [
            { method: "Activated Carbon Production", description: "Used for water purification and filters.", cost: 2500, output: "Activated Carbon", valueIncrease: 40 }
          ]
        },
      ];
      setByproductList(allByproducts);
      setSelectedByproductId(null);
    } else {
      setByproductList([]);
      setSelectedByproductId(null);
    }
  }, [selectedCrop]);

  // -------------------------
  // Fetch companies
  // -------------------------
  const onFindOpportunities = async () => {
    if (!selectedCrop || !selectedDistrict) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop_name: selectedCrop, district: selectedDistrict }),
      });
      const data = await response.json();
      if (data.recommendations) {
        setCompanyOptions(
          (data.recommendations as CompanyOptionInput[]).map((rec, idx) => ({
            id: `${rec.company_name}_${idx}`,
            name: rec.company_name,
            address: rec.address,
            status: rec.status,
            domain: rec.domain,
            distance: rec.distance,
            rating: rec.rating,
          }))
        );
        setCurrentPage("companies");
      } else {
        alert(data.message || data.error);
      }
    } catch (e) {
      alert("Error contacting server");
    }
    setIsAnalyzing(false);
  };

  const onByproductClick = (id: string) => {
    setSelectedByproductId(id);
    setCurrentPage("process");
  };

  const resetToInputPage = () => {
    setCurrentPage("input");
    setSelectedCrop("");
    setSelectedDistrict("");
    setCompanyOptions([]);
    setSelectedByproductId(null);
  };

  // -------------------------
  // JSX - Input Page
  // -------------------------
  const renderInputPage = () => (
    <div className="max-w-4xl mx-auto space-y-8 text-center">
      <h1 className="text-4xl font-bold text-foreground mb-4">Turn Your Farm Waste Into Wealth</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
        Discover profitable ways to monetize your agricultural by-products. Connect with verified industries and maximize your farm income.
      </p>
      <Card className="shadow-elegant border-primary/20 bg-gradient-to-br from-background to-primary/5 max-w-xl mx-auto">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
            <Recycle className="h-7 w-7 text-primary" />
            <span>Find Utilization Opportunities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
                  {cropOptions.map(crop => (
                    <SelectItem key={crop} value={crop.toLowerCase()}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center">
                <Calculator className="h-4 w-4 mr-2 text-primary" />
                District
              </label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select your district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(dist => (
                    <SelectItem key={dist} value={dist.toLowerCase()}>{dist}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={onFindOpportunities}
            className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:bg-gradient-primary/90"
            size="lg"
            disabled={!selectedCrop || !selectedDistrict || isAnalyzing}
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
          {byproductList.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Processing-driven Byproducts</h2>
              <div className="flex space-x-6 overflow-x-auto max-w-xl mx-auto">
                {byproductList.map(bp => (
                  <div key={bp.id} className="cursor-pointer flex-shrink-0 w-24 text-center" onClick={() => onByproductClick(bp.id)}>
                    <img src={bp.image} alt={bp.name} className="rounded-lg w-full h-24 object-cover mb-2" />
                    <div>{bp.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // -------------------------
  // JSX - Companies Page
  // -------------------------
  const renderCompaniesPage = () => (
    <>
      <Card className="shadow-elegant bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 max-w-6xl mx-auto mb-6">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl mb-2">By-product Utilization Opportunities</CardTitle>
              <CardDescription className="text-base">
                Found {companyOptions.length} relevant industries for your {selectedCrop}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xl px-6 py-3 bg-gradient-primary text-white">
              Total Companies: {companyOptions.length}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {companyOptions.map(option => (
          <Card key={option.id} className="shadow-elegant overflow-hidden">
            <CardContent className="p-6 space-y-2">
              <h3 className="font-bold text-lg">{option.name}</h3>
              <p className="text-sm">{option.address}</p>
              <p>
                Status: <Badge variant={option.status === "Active" ? "default" : "secondary"}>{option.status}</Badge>
              </p>
              <p>Domain: {option.domain}</p>
              {option.distance !== undefined && <p>Distance: {option.distance} km</p>}
              {option.rating !== undefined && <p>Rating: {option.rating} ⭐</p>}
              <Button size="sm" variant="outline" onClick={() => alert(`Contacting ${option.name}`)}>
                <Phone className="h-4 w-4 mr-1" />
                Contact
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-6xl mx-auto mt-10 flex justify-end space-x-4">
        <Button onClick={resetToInputPage} size="lg" variant="secondary">
          Back
        </Button>
      </div>
    </>
  );

  // -------------------------
  // JSX - Process Page
  // -------------------------
  const renderProcessPage = () => {
    const bp = byproductList.find(b => b.id === selectedByproductId);
    if (!bp) return <p className="text-center mt-10">Byproduct details not found.</p>;

    return (
      <Card className="shadow-elegant max-w-4xl mx-auto my-6">
        <CardHeader>
          <CardTitle>{bp.name} Processing Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={bp.image} alt={bp.name} className="w-full h-48 object-cover rounded-md mb-6" />
          {bp.processes.map((proc, i) => (
            <Card key={i} className="mb-4">
              <CardHeader>
                <CardTitle>{proc.method}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{proc.description}</p>
                <p><b>Cost:</b> ₹{proc.cost}</p>
                <p><b>Output:</b> {proc.output}</p>
                <Badge className="bg-green-600 text-white">+{proc.valueIncrease}% Value Added</Badge>
              </CardContent>
            </Card>
          ))}
        </CardContent>
        <div className="max-w-6xl mx-auto flex justify-end px-6 py-4">
          <Button onClick={() => setCurrentPage("input")} variant="secondary">
            Back to Inputs
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="🌱 Farmland By-product Utilization" showLogo={false} />
      <main className="container mx-auto px-4 py-6">
        {currentPage === "input" && renderInputPage()}
        {currentPage === "companies" && renderCompaniesPage()}
        {currentPage === "process" && renderProcessPage()}
      </main>
      <Footer />
    </div>
  );
};

export default ByproductUtilization;
