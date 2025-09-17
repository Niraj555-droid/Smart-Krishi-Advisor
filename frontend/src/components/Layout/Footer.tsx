import { ArrowLeft, Home, User, HelpCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const footerItems = [
    {
      icon: ArrowLeft,
      label: "Back",
      action: () => window.history.back(),
      variant: "secondary" as const
    },
    {
      icon: Home,
      label: "Home",
      action: () => navigate("/dashboard"),
      variant: "secondary" as const,
      active: location.pathname === "/dashboard"
    },
    {
      icon: User,
      label: "Profile",
      action: () => navigate("/profile"),
      variant: "secondary" as const,
      active: location.pathname === "/profile"
    },
    {
      icon: HelpCircle,
      label: "Help",
      action: () => navigate("/help"),
      variant: "secondary" as const,
      active: location.pathname === "/help"
    }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50">
      <div className="container mx-auto px-2 py-2">
        <div className="flex justify-around">
          {footerItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : item.variant}
              size="sm"
              onClick={item.action}
              className="flex-col h-12 w-16 p-1 text-xs"
            >
              <item.icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;