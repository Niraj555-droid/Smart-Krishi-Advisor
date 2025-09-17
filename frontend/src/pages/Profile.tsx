import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { 
  User, 
  MapPin, 
  Sprout, 
  Settings,
  Edit3,
  Save,
  LogOut,
  Trash2,
  Shield,
  Bell,
  Globe,
  BarChart3
} from "lucide-react";

interface UserProfile {
  name: string;
  role: string;
  state: string;
  district: string;
  village: string;
  farmSize: string;
  soilType: string;
  mainCrop: string;
  language: string;
  notifications: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    role: "",
    state: "",
    district: "",
    village: "",
    farmSize: "",
    soilType: "",
    mainCrop: "",
    language: "english",
    notifications: true
  });

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      const profileData = JSON.parse(profile);
      setUserProfile({
        ...profileData,
        language: profileData.language || "english",
        notifications: profileData.notifications !== false
      });
    } else {
      navigate("/profile-setup");
    }
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userProfile");
    navigate("/login");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      localStorage.clear();
      navigate("/login");
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        variant: "destructive",
      });
    }
  };

  const farmStats = [
    { label: "Farm Size", value: `${userProfile.farmSize} acres`, icon: Sprout },
    { label: "Soil Type", value: userProfile.soilType, icon: MapPin },
    { label: "Main Crop", value: userProfile.mainCrop, icon: Sprout },
    { label: "Location", value: `${userProfile.village}, ${userProfile.district}`, icon: MapPin }
  ];

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "farmer": return "Farmer";
      case "krishi_kendra": return "Krishi Kendra Officer";
      case "agricultural_officer": return "Agricultural Officer";
      default: return "User";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Profile & Settings" showLogo={false} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                  <p className="text-muted-foreground">{getRoleTitle(userProfile.role)}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{userProfile.village}, {userProfile.district}, {userProfile.state}</span>
                  </div>
                </div>
              </div>
              <Button
                variant={isEditing ? "default" : "secondary"}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Farm Statistics */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Farm Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {farmStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="font-semibold text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={userProfile.role} 
                  onValueChange={(value) => setUserProfile({...userProfile, role: value})}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="krishi_kendra">Krishi Kendra Officer</SelectItem>
                    <SelectItem value="agricultural_officer">Agricultural Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={userProfile.state}
                  onChange={(e) => setUserProfile({...userProfile, state: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={userProfile.district}
                  onChange={(e) => setUserProfile({...userProfile, district: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="village">Village/City</Label>
                <Input
                  id="village"
                  value={userProfile.village}
                  onChange={(e) => setUserProfile({...userProfile, village: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Information */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sprout className="h-5 w-5" />
              <span>Farm Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="farmSize">Farm Size (acres)</Label>
                <Input
                  id="farmSize"
                  value={userProfile.farmSize}
                  onChange={(e) => setUserProfile({...userProfile, farmSize: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="soilType">Soil Type</Label>
                <Select 
                  value={userProfile.soilType} 
                  onValueChange={(value) => setUserProfile({...userProfile, soilType: value})}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black Soil</SelectItem>
                    <SelectItem value="red">Red Soil</SelectItem>
                    <SelectItem value="alluvial">Alluvial Soil</SelectItem>
                    <SelectItem value="sandy">Sandy Soil</SelectItem>
                    <SelectItem value="clay">Clay Soil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mainCrop">Main Crop</Label>
                <Input
                  id="mainCrop"
                  value={userProfile.mainCrop}
                  onChange={(e) => setUserProfile({...userProfile, mainCrop: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>App Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={userProfile.language} 
                  onValueChange={(value) => setUserProfile({...userProfile, language: value})}
                  disabled={!isEditing}
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
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label>Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive weather alerts and scheme updates</p>
                </div>
                <Button
                  variant={userProfile.notifications ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setUserProfile({...userProfile, notifications: !userProfile.notifications})}
                  disabled={!isEditing}
                >
                  {userProfile.notifications ? "ON" : "OFF"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Account Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <LogOut className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Logout</div>
                    <div className="text-sm text-muted-foreground">Sign out of your account</div>
                  </div>
                </div>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="flex items-center space-x-3">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <div>
                    <div className="font-medium text-destructive">Delete Account</div>
                    <div className="text-sm text-muted-foreground">Permanently delete your account and all data</div>
                  </div>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;