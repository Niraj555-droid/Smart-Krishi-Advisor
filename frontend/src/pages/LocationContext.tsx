import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationData {
  state: string;
  district: string;
  village?: string;
}

interface LocationContextType {
  userLocation: LocationData | null;
  setUserLocation: (location: LocationData) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [userLocation, setUserLocationState] = useState<LocationData | null>(null);

  useEffect(() => {
    // Load location from localStorage on mount
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setUserLocationState(JSON.parse(savedLocation));
      } catch (error) {
        console.error('Error parsing saved location:', error);
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

  const setUserLocation = (location: LocationData) => {
    setUserLocationState(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  const clearLocation = () => {
    setUserLocationState(null);
    localStorage.removeItem('userLocation');
  };

  return (
    <LocationContext.Provider value={{ userLocation, setUserLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
};