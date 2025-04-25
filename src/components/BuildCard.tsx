
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CarBuild } from '../types';
import { getCarModel } from '../utils/statCalculations';
import { formatDistanceToNow } from 'date-fns';

interface BuildCardProps {
  build: CarBuild;
  onSelect: (build: CarBuild) => void;
  onDuplicate: (buildId: string) => void;
  onDelete: (buildId: string) => void;
}

const BuildCard = ({ build, onSelect, onDuplicate, onDelete }: BuildCardProps) => {
  const carModel = getCarModel(build.carModelId);
  
  return (
    <Card className="car-card overflow-hidden">
      <CardContent className="p-4">
        <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4 bg-muted/30">
          <img 
            src={carModel.image} 
            alt={carModel.name} 
            className="h-full w-full object-cover transition-transform hover:scale-105"
            style={{ 
              filter: `hue-rotate(${parseInt(build.visualCustomization.paintColor.substring(1), 16) % 360}deg)` 
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{build.name}</h3>
            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
              {carModel.make} {carModel.name}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Modified {formatDistanceToNow(new Date(build.dateModified), { addSuffix: true })}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="stat-badge">
              <span>Power:</span>
              <span>{build.stats.power} HP</span>
            </div>
            <div className="stat-badge">
              <span>Weight:</span>
              <span>{build.stats.weight} lbs</span>
            </div>
            <div className="stat-badge">
              <span>¼ Mile:</span>
              <span>{build.stats.quarterMileTime?.toFixed(2)}s</span>
            </div>
            <div className="stat-badge">
              <span>Top:</span>
              <span>{build.stats.topSpeed} mph</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button onClick={() => onSelect(build)} variant="default" className="flex-1">
          Select
        </Button>
        <Button onClick={() => onDuplicate(build.id)} variant="secondary" size="icon" className="px-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
        </Button>
        <Button onClick={() => onDelete(build.id)} variant="destructive" size="icon" className="px-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BuildCard;
