import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { useLocation } from "@/contexts/LocationContext";
import { Bell, Cloud, Droplets, AlertTriangle, Info, MapPin, Settings } from "lucide-react";

interface AlertNotification {
  id: string;
  type: "weather" | "irrigation" | "pest" | "market" | "general" | "model_alert";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  timestamp: string;
  actionRequired: boolean;
  isRead: boolean;
}

interface AlertSettings {
  weather: boolean;
  irrigation: boolean;
  pest: boolean;
  market: boolean;
  sms: boolean;
  email: boolean;
  phoneNumber: string;
}

const NotificationAlerts = () => {
  const { userLocation } = useLocation();
  const [activeTab, setActiveTab] = useState<"alerts" | "settings">("alerts");
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    weather: true,
    irrigation: true,
    pest: true,
    market: false,
    sms: true,
    email: false,
    phoneNumber: ""
  });
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!userLocation) return;

    const fetchAlerts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://127.0.0.1:5000/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: `${userLocation.district},${userLocation.state}`,
            sms: alertSettings.sms,
            email: alertSettings.email,
            phone_number: alertSettings.phoneNumber
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Backend returned an error");
        }

        const data = await response.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching alerts:", err.message);
        } else {
          console.error("Unknown error:", err);
        }
        setNotifications([]);
        setError("⚠️ Unable to reach backend. Make sure server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [userLocation, alertSettings]);

  const handleToggleChange = (key: Exclude<keyof AlertSettings, "phoneNumber">, value: boolean) => {
    setAlertSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (value: string) => {
    setAlertSettings(prev => ({ ...prev, phoneNumber: value }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weather": return <Cloud className="h-4 w-4 text-blue-500" />;
      case "irrigation": return <Droplets className="h-4 w-4 text-cyan-500" />;
      case "pest": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "market": return <Bell className="h-4 w-4 text-yellow-500" />;
      case "model_alert": return <Settings className="h-4 w-4 text-purple-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50";
      case "medium": return "border-l-yellow-500 bg-yellow-50";
      case "low": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge variant="destructive">High</Badge>;
      case "medium": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low": return <Badge variant="secondary" className="bg-green-100 text-green-800">Low</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Header title="Notification Alerts" showLogo={false} />

      <main className="container mx-auto px-4 py-6">
        {userLocation ? (
          <div className="flex items-center space-x-2 text-muted-foreground mb-6">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{userLocation.district}, {userLocation.state}</span>
          </div>
        ) : (
          <p className="text-sm text-red-500 mb-4">No location selected</p>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === "alerts" ? "default" : "outline"}
            onClick={() => setActiveTab("alerts")}
            className="flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" /> <span>Alerts</span>
            {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>}
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "outline"}
            onClick={() => setActiveTab("settings")}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" /> <span>Settings</span>
          </Button>
        </div>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading alerts...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-muted-foreground">No alerts available.</p>
            ) : (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <Card key={notification.id} className={`shadow-card border-l-4 ${getPriorityColor(notification.priority)} ${!notification.isRead ? 'ring-2 ring-blue-200' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(notification.type)}
                            {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-foreground">{notification.title}</h3>
                              {getPriorityBadge(notification.priority)}
                              {notification.actionRequired && <Badge variant="outline" className="border-orange-300 text-orange-600">Action Required</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                          </div>
                        </div>
                        {notification.actionRequired && !notification.isRead && <Button size="sm" variant="outline">Take Action</Button>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {["weather","irrigation","pest","market"].map(type => (
              <div key={type} className="flex items-center justify-between">
                <span className="font-medium">{type.charAt(0).toUpperCase()+type.slice(1)} Alerts</span>
                <Switch
                  checked={alertSettings[type as Exclude<keyof AlertSettings, "phoneNumber">]}
                  onCheckedChange={(checked: boolean) => handleToggleChange(type as Exclude<keyof AlertSettings, "phoneNumber">, checked)}
                />
              </div>
            ))}
            {alertSettings.sms && (
              <div className="mt-4">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={alertSettings.phoneNumber}
                  onChange={e => handleInputChange(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NotificationAlerts;
