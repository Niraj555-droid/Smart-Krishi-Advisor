import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { locationData, parseLocation } from "@/data/locations";
import { useLocation } from "@/pages/LocationContext";
import { MapPin, Check, ChevronsUpDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const LocationSelector = () => {
  const navigate = useNavigate();
  const { setUserLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const filteredLocations = locationData.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedLocations = filteredLocations.reduce((groups, location) => {
    const { state } = parseLocation(location);
    if (!groups[state]) groups[state] = [];
    groups[state].push(location);
    return groups;
  }, {} as Record<string, string[]>);

  const handleLocationSelect = async () => {
    if (!selectedLocation) return;

    const locationDataParsed = parseLocation(selectedLocation);
    setUserLocation(locationDataParsed);

    // Call backend API for alerts
    try {
      const response = await fetch("http://localhost:8000/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: `${locationDataParsed.district},${locationDataParsed.state}`,
          send_sms: false, // or true if you want SMS
          phone_number: "" // optional phone number
        }),
      });
      const data = await response.json();

      // Pick first alert message to show immediately
      const firstAlert = Array.isArray(data) && data.length > 0 ? data[0].message : "";
      setAlertMessage(firstAlert);

      // Navigate and pass alertMessage to Dashboard
      navigate("/dashboard", { state: { alertMessage: firstAlert } });

    } catch (err) {
      console.error(err);
      setAlertMessage("⚠️ Error connecting to server.");
      navigate("/dashboard", { state: { alertMessage: "⚠️ Error connecting to server." } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header title="Location Selection" showLogo={false} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-elevated">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-heading">🌍 Select Your Location</CardTitle>
              <CardDescription className="text-lg">
                Choose your state, district, or village to get region-specific recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search Location</label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-12 text-left">
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
                                    <Badge variant="secondary" className="text-xs">{state}</Badge>
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

              {/* Continue Button */}
              <Button 
                onClick={handleLocationSelect}
                disabled={!selectedLocation}
                className="w-full h-12 text-lg"
              >
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LocationSelector;
