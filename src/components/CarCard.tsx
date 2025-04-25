
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CarModel } from '../types';

interface CarCardProps {
  car: CarModel;
  onSelect: (car: CarModel) => void;
}

const CarCard = ({ car, onSelect }: CarCardProps) => {
  return (
    <Card className="car-card overflow-hidden">
      <CardContent className="p-4">
        <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4 bg-muted/30">
          <img 
            src={car.image} 
            alt={`${car.make} ${car.name}`} 
            className="h-full w-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{car.make} {car.name}</h3>
            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">{car.class}</span>
          </div>
          <div className="text-sm text-muted-foreground">{car.year}</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="stat-badge">
              <span>Power:</span>
              <span>{car.baseStats.power} HP</span>
            </div>
            <div className="stat-badge">
              <span>Weight:</span>
              <span>{car.baseStats.weight} lbs</span>
            </div>
            <div className="stat-badge">
              <span>0-60:</span>
              <span>{(10 / car.baseStats.acceleration).toFixed(1)}s</span>
            </div>
            <div className="stat-badge">
              <span>Top:</span>
              <span>{car.baseStats.topSpeed} mph</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onSelect(car)} className="w-full">
          Select
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
