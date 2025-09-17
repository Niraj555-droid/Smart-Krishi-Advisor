import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IndianRupee,
  Droplet,
  Sprout,
  Tractor,
  FileText,
  ShieldCheck,
} from "lucide-react";

// Define the scheme interface
interface Scheme {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility: string;
  benefits: string;
  processingTime: string;
  icon: any;
  applyLink: string;
}

// Schemes data
const schemes: Scheme[] = [
  {
    id: "PM-KISAN",
    name: "PM-KISAN Samman Nidhi",
    category: "welfare",
    description:
      "Provides income support to all farmer families across the country.",
    eligibility: "All landholding farmer families",
    benefits: "₹6,000 per year in three equal installments",
    processingTime: "30-45 days",
    icon: IndianRupee,
    applyLink: "https://pmkisan.gov.in/",
  },
  {
    id: "SOIL-CARD",
    name: "Soil Health Card",
    category: "advisory",
    description:
      "Soil health analysis and crop-specific fertilizer recommendations.",
    eligibility: "All farmers",
    benefits: "Soil quality assessment and fertilizer guidance",
    processingTime: "15-20 days",
    icon: Sprout,
    applyLink: "https://soilhealth.dac.gov.in/",
  },
  {
    id: "CROP-INSURANCE",
    name: "Pradhan Mantri Fasal Bima Yojana",
    category: "insurance",
    description: "Crop insurance scheme for farmers against natural calamities.",
    eligibility: "All farmers growing notified crops",
    benefits: "Insurance coverage & claim support",
    processingTime: "30-60 days",
    icon: ShieldCheck,
    applyLink: "https://pmfby.gov.in/",
  },
  {
    id: "TRACTOR-SUBSIDY",
    name: "Tractor Subsidy Scheme",
    category: "equipment",
    description: "Financial assistance for purchasing new tractors.",
    eligibility: "Small and marginal farmers",
    benefits: "25-50% subsidy on tractor cost",
    processingTime: "45-60 days",
    icon: Tractor,
    applyLink: "https://agrimachinery.nic.in/",
  },
  {
    id: "IRRIGATION",
    name: "Micro Irrigation Fund",
    category: "irrigation",
    description: "Promotes micro irrigation systems in agriculture.",
    eligibility: "All farmers",
    benefits: "Subsidy on drip and sprinkler irrigation systems",
    processingTime: "30-45 days",
    icon: Droplet,
    applyLink: "https://pmksy.gov.in/",
  },
  {
    id: "KCC",
    name: "Kisan Credit Card (KCC)",
    category: "credit",
    description:
      "Provides timely credit to farmers at subsidized interest rates.",
    eligibility: "All farmers",
    benefits: "Crop loan up to ₹3 lakh at 4% interest",
    processingTime: "15-30 days",
    icon: FileText,
    applyLink: "https://www.myscheme.gov.in/schemes/kcc",
  },
];

export default function CropAdvisor() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredSchemes =
    selectedCategory === "all"
      ? schemes
      : schemes.filter((scheme) => scheme.category === selectedCategory);

  // Categories list
  const categories = [
    { key: "all", label: "All" },
    { key: "welfare", label: "Welfare" },
    { key: "insurance", label: "Insurance" },
    { key: "equipment", label: "Equipment" },
    { key: "irrigation", label: "Irrigation" },
    { key: "credit", label: "Credit" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Government Schemes</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <Button
            key={cat.key}
            variant={selectedCategory === cat.key ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Schemes List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <Card
            key={scheme.id}
            className="shadow-lg hover:shadow-xl transition-all"
          >
            <CardContent className="p-6 space-y-4">
              <scheme.icon className="w-10 h-10 text-green-600" />
              <h2 className="text-xl font-semibold">{scheme.name}</h2>
              <p className="text-gray-600">{scheme.description}</p>
              <p>
                <strong>Eligibility:</strong> {scheme.eligibility}
              </p>
              <p>
                <strong>Benefits:</strong> {scheme.benefits}
              </p>
              <p>
                <strong>Processing Time:</strong> {scheme.processingTime}
              </p>
              <Button
                size="sm"
                onClick={() => window.open(scheme.applyLink, "_blank")}
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
