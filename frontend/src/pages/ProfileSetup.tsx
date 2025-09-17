import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/contexts/LocationContext";
import { locationData, parseLocation } from "@/data/locations";
import { MapPin, User, TreePine, Settings, Check, ChevronsUpDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type UserRole = "farmer" | "krishi_kendra" | "agricultural_officer";
type SoilType = "clay" | "sandy" | "loamy" | "black_cotton" | "red_laterite";
type WaterSource = "rainwater" | "bore_well" | "canal" | "river" | "tank";

interface ProfileData {
  // Step 1: Personal Info
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  
  // Step 2: Location
  state: string;
  district: string;
  
  // Step 3: Farm Info
  farmSize: string;
  soilType: SoilType;
  waterSource: WaterSource;
  
  
  // Step 4: Preferences
  language: string;
  notifications: boolean;
}

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserLocation } = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    phone: "",
    email: "",
    role: "farmer",
    state: "",
    district: "",
    farmSize: "",
    soilType: "loamy",
    waterSource: "rainwater",
    
    language: "english",
    notifications: true
  });

  useEffect(() => {
    // Load temp user data from signup
    const tempData = localStorage.getItem("tempUserData");
    if (tempData) {
      const userData = JSON.parse(tempData);
      setProfileData(prev => ({
        ...prev,
        name: userData.name,
        phone: userData.phone,
        email: userData.email
      }));
    }
  }, []);

  const steps = [
    { 
      number: 1, 
      title: "Personal Information", 
      icon: User,
      description: "Tell us about yourself"
    },
    { 
      number: 2, 
      title: "Location Details", 
      icon: MapPin,
      description: "Where is your farm located?"
    },
    { 
      number: 3, 
      title: "Farm Information", 
      icon: TreePine,
      description: "Details about your farming"
    },
    { 
      number: 4, 
      title: "Preferences", 
      icon: Settings,
      description: "Customize your experience"
    }
  ];

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!profileData.name || !profileData.phone || !profileData.email || !profileData.role) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2:
        if (!selectedLocation) {
          toast({
            title: "Location Required",
            description: "Please select your location from the dropdown",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3:
        if (!profileData.farmSize) {
          toast({
            title: "Farm Details Required",
            description: "Please provide your farm size",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = () => {
    // Save location to global context if selected
    if (selectedLocation) {
      const locationData = parseLocation(selectedLocation);
      setUserLocation(locationData);
    }
    
    // Save complete profile
    localStorage.setItem("userProfile", JSON.stringify(profileData));
    localStorage.removeItem("tempUserData");
    
    toast({
      title: "Profile Complete!",
      description: "Welcome to Smart Krishi Advisor",
    });
    
    navigate("/dashboard");
  };

  const progress = (currentStep / 4) * 100;

  const filteredLocations = locationData.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedLocations = filteredLocations.reduce((groups, location) => {
    const { state } = parseLocation(location);
    if (!groups[state]) {
      groups[state] = [];
    }
    groups[state].push(location);
    return groups;
  }, {} as Record<string, string[]>);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header title="Profile Setup" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Complete Your Profile
              </h2>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of 4
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicator */}
          <div className="flex justify-between mb-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex flex-col items-center space-y-2 ${
                  currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.number
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">{step.title}</p>
                </div>
              </div>
            ))}
          </div>

          <Card className="shadow-form">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {currentStep === 1 && <User className="w-5 h-5" />}
                {currentStep === 2 && <MapPin className="w-5 h-5" />}
                {currentStep === 3 && <TreePine className="w-5 h-5" />}
                {currentStep === 4 && <Settings className="w-5 h-5" />}
                <span>{steps[currentStep - 1].title}</span>
              </CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role *</Label>
                    <Select
                      value={profileData.role}
                      onValueChange={(value: UserRole) => setProfileData({ ...profileData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="krishi_kendra">Krishi Kendra Officer</SelectItem>
                        <SelectItem value="agricultural_officer">Agricultural Officer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Location Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">🌍 Select Your Location</h3>
                    <p className="text-muted-foreground">Choose your district and state to get region-specific recommendations</p>
                  </div>

                  {/* Location Search */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Search Location *
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between h-12 text-left"
                        >
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className={selectedLocation ? "text-foreground" : "text-muted-foreground"}>
                              {selectedLocation ? parseLocation(selectedLocation).district + ", " + parseLocation(selectedLocation).state : "Select location..."}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Search districts, states..." 
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandList className="max-h-[300px]">
                            <CommandEmpty>No locations found.</CommandEmpty>
                            {Object.entries(groupedLocations).map(([state, locations]) => (
                              <CommandGroup key={state} heading={state}>
                                {locations.slice(0, 10).map((location) => {
                                  const { district } = parseLocation(location);
                                  return (
                                    <CommandItem
                                      key={location}
                                      value={location}
                                      onSelect={() => {
                                        setSelectedLocation(location);
                                        const locationData = parseLocation(location);
                                        setProfileData({ 
                                          ...profileData, 
                                          state: locationData.state,
                                          district: locationData.district
                                        });
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedLocation === location ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <div className="flex items-center space-x-2">
                                        <span>{district}</span>
                                        <Badge variant="secondary" className="text-xs">
                                          {state}
                                        </Badge>
                                      </div>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Selected Location Preview */}
                  {selectedLocation && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold text-primary">Selected Location</p>
                            <p className="text-sm text-muted-foreground">
                              {parseLocation(selectedLocation).district}, {parseLocation(selectedLocation).state}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Benefits Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Benefits of Location Selection:</h4>
                    <div className="grid gap-3">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Region-specific crop recommendations</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Local mandi prices and market trends</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Weather forecasts and agro-advisory</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Fertilizer optimization for local soil conditions</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Farm Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (in acres) *</Label>
                    <Input
                      id="farmSize"
                      value={profileData.farmSize}
                      onChange={(e) => setProfileData({ ...profileData, farmSize: e.target.value })}
                      placeholder="e.g., 5.5"
                      type="number"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="soilType">Soil Type</Label>
                      <Select
                        value={profileData.soilType}
                        onValueChange={(value: SoilType) => setProfileData({ ...profileData, soilType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clay">Clay Soil</SelectItem>
                          <SelectItem value="sandy">Sandy Soil</SelectItem>
                          <SelectItem value="loamy">Loamy Soil</SelectItem>
                          <SelectItem value="black_cotton">Black Cotton Soil</SelectItem>
                          <SelectItem value="red_laterite">Red Laterite Soil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="waterSource">Primary Water Source</Label>
                      <Select
                        value={profileData.waterSource}
                        onValueChange={(value: WaterSource) => setProfileData({ ...profileData, waterSource: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rainwater">Rainwater</SelectItem>
                          <SelectItem value="bore_well">Bore Well</SelectItem>
                          <SelectItem value="canal">Canal</SelectItem>
                          <SelectItem value="river">River</SelectItem>
                          <SelectItem value="tank">Tank/Pond</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Preferences */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select
                      value={profileData.language}
                      onValueChange={(value) => setProfileData({ ...profileData, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi (Coming Soon)</SelectItem>
                        <SelectItem value="marathi">Marathi (Coming Soon)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Notification Preferences</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.notifications}
                          onChange={(e) => setProfileData({ ...profileData, notifications: e.target.checked })}
                          className="rounded border-border"
                        />
                        <span className="text-sm">
                          Receive weather alerts, market updates, and farming advisories
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                <Button onClick={handleNext}>
                  {currentStep === 4 ? "Complete Setup" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;