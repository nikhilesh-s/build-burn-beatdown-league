
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CarBuild, User, Garage } from '../types';
import { getDefaultBuild } from '../data/cars';

interface GarageContextType {
  user: User | null;
  currentBuild: CarBuild | null;
  setCurrentBuild: (build: CarBuild) => void;
  saveBuild: (build: CarBuild) => void;
  deleteBuild: (buildId: string) => void;
  createNewBuild: (carModelId: string, name: string) => void;
  duplicateBuild: (buildId: string, newName: string) => void;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

// Mock initial user with empty garage
const initialUser: User = {
  id: 'user-001',
  username: 'DragRacer',
  avatar: '/avatars/default.png',
  garage: {
    savedBuilds: []
  }
};

export const GarageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentBuild, setCurrentBuild] = useState<CarBuild | null>(null);
  
  // Initialize user from localStorage or use default
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(initialUser);
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const saveBuild = (build: CarBuild) => {
    if (!user) return;
    
    const updatedBuild = {
      ...build,
      dateModified: new Date().toISOString()
    };
    
    // Check if build already exists in garage
    const buildIndex = user.garage.savedBuilds.findIndex(b => b.id === build.id);
    
    if (buildIndex >= 0) {
      // Update existing build
      const updatedBuilds = [...user.garage.savedBuilds];
      updatedBuilds[buildIndex] = updatedBuild;
      
      setUser({
        ...user,
        garage: {
          ...user.garage,
          savedBuilds: updatedBuilds
        }
      });
    } else {
      // Add new build
      setUser({
        ...user,
        garage: {
          ...user.garage,
          savedBuilds: [...user.garage.savedBuilds, updatedBuild]
        }
      });
    }
    
    setCurrentBuild(updatedBuild);
  };

  const deleteBuild = (buildId: string) => {
    if (!user) return;
    
    const updatedBuilds = user.garage.savedBuilds.filter(build => build.id !== buildId);
    
    setUser({
      ...user,
      garage: {
        ...user.garage,
        savedBuilds: updatedBuilds
      }
    });
    
    if (currentBuild && currentBuild.id === buildId) {
      setCurrentBuild(null);
    }
  };

  const createNewBuild = (carModelId: string, name: string) => {
    const newBuild = getDefaultBuild(carModelId);
    newBuild.name = name;
    saveBuild(newBuild);
    setCurrentBuild(newBuild);
  };

  const duplicateBuild = (buildId: string, newName: string) => {
    if (!user) return;
    
    const buildToDuplicate = user.garage.savedBuilds.find(build => build.id === buildId);
    
    if (buildToDuplicate) {
      const duplicatedBuild = {
        ...buildToDuplicate,
        id: `build-${Date.now()}`,
        name: newName,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString()
      };
      
      saveBuild(duplicatedBuild);
    }
  };
  
  return (
    <GarageContext.Provider 
      value={{ 
        user, 
        currentBuild, 
        setCurrentBuild,
        saveBuild, 
        deleteBuild, 
        createNewBuild,
        duplicateBuild 
      }}
    >
      {children}
    </GarageContext.Provider>
  );
};

export const useGarage = () => {
  const context = useContext(GarageContext);
  if (context === undefined) {
    throw new Error('useGarage must be used within a GarageProvider');
  }
  return context;
};
