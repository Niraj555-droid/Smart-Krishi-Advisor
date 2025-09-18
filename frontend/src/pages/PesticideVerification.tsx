import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Shield, CheckCircle } from "lucide-react";

interface AdvisoryReport {
  html: string;
  ai_response?: Record<string, unknown>; // ✅ replaced `any` with safe type
}

const PesticideVerification = () => {
  const [pesticideName, setPesticideName] = useState("");
  const [cropType, setCropType] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [report, setReport] = useState<AdvisoryReport | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Call Flask backend
  const handleVerifyProduct = async () => {
    if (!pesticideName.trim() || !cropType || !diseaseName) {
      setError("Please enter pesticide name, crop type, and disease.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/generate-advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pesticide: pesticideName,
          crop: cropType,
          disease: diseaseName,
        }),
      });

      const data = await response.json();
      console.log("✅ Backend Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify pesticide");
      }

      if (!data.report || !data.report.html) {
        throw new Error("Backend did not return a valid advisory report.");
      }

      setReport(data.report); // ✅ Save AI advisory report
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while verifying.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // 🔹 Reset form
  const resetForm = () => {
    setPesticideName("");
    setCropType("");
    setDiseaseName("");
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="🧪 Smart Pesticide Verification" showLogo={false} />

      <main className="container mx-auto px-4 py-6">
        {!report ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Input Form */}
            <Card className="shadow-elegant border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
                  <Shield className="h-7 w-7 text-primary" />
                  <span>Product Verification System</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Enter pesticide name, crop, and disease for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">❌ {error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Input
                    placeholder="Enter Pesticide Name"
                    value={pesticideName}
                    onChange={(e) => setPesticideName(e.target.value)}
                  />

                  <Select value={cropType} onValueChange={setCropType}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select Crop Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="tomato">Tomato</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Enter Disease/Pest"
                    value={diseaseName}
                    onChange={(e) => setDiseaseName(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleVerifyProduct}
                  disabled={isVerifying}
                  className="w-full h-14 text-lg font-bold"
                >
                  {isVerifying ? "Analyzing..." : "Verify Product & Generate Report"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-700 font-medium">
                ✅ Product verified successfully! AI-generated advisory report below.
              </AlertDescription>
            </Alert>

            {/* AI HTML Report */}
            <Card>
              <CardHeader>
                <CardTitle>📑 Advisory Report</CardTitle>
                <CardDescription>Generated by AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none bg-white p-4 rounded-md border"
                  dangerouslySetInnerHTML={{ __html: report.html }}
                />
              </CardContent>
            </Card>

            {/* Raw JSON for debugging */}
            {report.ai_response && (
              <details className="mt-4">
                <summary className="cursor-pointer text-primary">🔎 View Raw AI Response (JSON)</summary>
                <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                  {JSON.stringify(report.ai_response, null, 2)}
                </pre>
              </details>
            )}

            <Button onClick={resetForm} variant="outline">
              Scan Another Product
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PesticideVerification;
