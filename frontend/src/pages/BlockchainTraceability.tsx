import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  QrCode, 
  Download, 
  Shield, 
  Calendar,
  MapPin,
  Beaker,
  Printer,
  Share2,
  CheckCircle,
  FileText,
  Package,
  Scan
} from "lucide-react";

interface CropBatch {
  id: string;
  qrCode: string;
  cropType: string;
  variety: string;
  harvestDate: string;
  quantity: number;
  unit: string;
  farmerName: string;
  location: string;
  sellingPrice: number;
  qualityReport: QualityReport;
  certifications: string[];
  transactions: Transaction[];
}

interface QualityReport {
  testDate: string;
  pesticides: "None Detected" | "Within Limits" | "Exceeded";
  moisture: number;
  purity: number;
  grade: "A+" | "A" | "B+" | "B";
}

interface Transaction {
  date: string;
  buyer: string;
  type: "Harvest" | "Sale" | "Transfer";
  quantity: number;
  price?: number;
}

const BlockchainTraceability = () => {
  const [userRole, setUserRole] = useState<"farmer" | "distributor" | "retailer" | "consumer">("farmer");
  const [activeTab, setActiveTab] = useState<"add" | "my_products" | "scan">("add");
  const [cropBatch, setCropBatch] = useState<CropBatch | null>(null);
  const [scanCode, setScanCode] = useState("");
  
  const [formData, setFormData] = useState({
    cropType: "",
    variety: "",
    quantity: "",
    unit: "quintals",
    harvestDate: "",
    sellingPrice: "",
    notes: ""
  });

  const mockBatch: CropBatch = {
    id: "SKA-2024-001",
    qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjEyIj5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4=",
    cropType: "Rice",
    variety: "Basmati 370",
    harvestDate: "2024-01-15",
    quantity: 25,
    unit: "quintals",
    farmerName: "Ravi Kumar",
    location: "Pune, Maharashtra",
    sellingPrice: 3500,
    qualityReport: {
      testDate: "2024-01-16",
      pesticides: "None Detected",
      moisture: 12.5,
      purity: 98.5,
      grade: "A+"
    },
    certifications: ["Organic Certified", "Pesticide-Free", "Quality Assured"],
    transactions: [
      { date: "2024-01-15", buyer: "Farmer", type: "Harvest", quantity: 25 },
      { date: "2024-01-20", buyer: "Local Distributor", type: "Sale", quantity: 15, price: 52500 },
      { date: "2024-01-25", buyer: "Retail Chain", type: "Transfer", quantity: 10, price: 35000 }
    ]
  };

  const handleCreateBatch = () => {
    if (formData.cropType && formData.quantity && formData.harvestDate) {
      setCropBatch(mockBatch);
    }
  };

  const handleScanQR = () => {
    if (scanCode.trim()) {
      setCropBatch(mockBatch);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="📦 Blockchain Traceability" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Role Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Select Your Role</h2>
          <div className="flex flex-wrap gap-2">
            {(["farmer", "distributor", "retailer", "consumer"] as const).map((role) => (
              <Button
                key={role}
                variant={userRole === role ? "default" : "outline"}
                onClick={() => setUserRole(role)}
                className="capitalize"
              >
                {role === "farmer" && "👨‍🌾"} {role === "distributor" && "🚛"} 
                {role === "retailer" && "🏪"} {role === "consumer" && "👥"} {role}
              </Button>
            ))}
          </div>
        </div>

        {/* Role-Based Dashboards */}
        {userRole === "farmer" && (
          <div className="space-y-6">
            <div className="flex space-x-2">
              <Button 
                variant={activeTab === "add" ? "default" : "outline"}
                onClick={() => setActiveTab("add")}
              >
                Add New Produce
              </Button>
              <Button 
                variant={activeTab === "my_products" ? "default" : "outline"}
                onClick={() => setActiveTab("my_products")}
              >
                My Products
              </Button>
            </div>

            {activeTab === "add" && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Register New Crop Batch</CardTitle>
                  <CardDescription>Create a blockchain record with QR code for your harvest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Crop Type</label>
                      <Select value={formData.cropType} onValueChange={(value) => setFormData({...formData, cropType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="maize">Maize</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                      <Input
                        type="number"
                        placeholder="Enter quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Harvest Date</label>
                      <Input
                        type="date"
                        value={formData.harvestDate}
                        onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Price (₹/quintal)</label>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        value={formData.sellingPrice}
                        onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateBatch}
                    className="w-full"
                    size="lg"
                    disabled={!formData.cropType || !formData.quantity || !formData.harvestDate}
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Register Produce & Generate QR
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Consumer Dashboard */}
        {userRole === "consumer" && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scan className="h-5 w-5" />
                <span>🔍 Scan Product for Full Traceability</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter QR code or product ID"
                  value={scanCode}
                  onChange={(e) => setScanCode(e.target.value)}
                />
                <Button onClick={handleScanQR}>
                  <Scan className="h-4 w-4 mr-2" />
                  Trace
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Traceability Results */}
        {cropBatch && (
          <Card className="shadow-card mt-6">
            <CardHeader>
              <CardTitle>Complete Traceability Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cropBatch.transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{transaction.type} - {transaction.buyer}</h4>
                      <span className="text-sm text-muted-foreground">{transaction.date}</span>
                    </div>
                    <Badge className="bg-green-500 text-white">✓ Verified</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BlockchainTraceability;