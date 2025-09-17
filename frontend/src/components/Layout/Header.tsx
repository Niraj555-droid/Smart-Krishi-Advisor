import { Wheat, Leaf } from "lucide-react";

interface HeaderProps {
  showLogo?: boolean;
  title?: string;
}

const Header = ({ showLogo = true, title }: HeaderProps) => {
  return (
    <header className="bg-gradient-primary shadow-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {showLogo && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Wheat className="h-8 w-8 text-accent-light" />
                <Leaf className="h-4 w-4 text-primary-foreground absolute -top-1 -right-1" />
              </div>
              <div className="text-primary-foreground">
                <h1 className="text-xl font-heading font-bold tracking-tight">
                  Smart Krishi Advisor
                </h1>
              </div>
            </div>
          )}
          
          {title && !showLogo && (
            <h1 className="text-xl font-heading font-semibold text-primary-foreground">
              {title}
            </h1>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;