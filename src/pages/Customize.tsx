
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useGarage } from '../context/GarageContext';
import { calculateStats } from '../utils/statCalculations';
import { getCarModel } from '../utils/statCalculations';

const Customize = () => {
  const navigate = useNavigate();
  const { currentBuild, saveBuild } = useGarage();
  const [buildName, setBuildName] = useState('');
  const [localBuild, setLocalBuild] = useState<any>(null);
  
  useEffect(() => {
    if (!currentBuild) {
      navigate('/garage');
      return;
    }
    
    setLocalBuild(JSON.parse(JSON.stringify(currentBuild)));
    setBuildName(currentBuild.name);
  }, [currentBuild, navigate]);
  
  if (!localBuild) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center py-20">
          <p>Loading build data...</p>
        </div>
      </Layout>
    );
  }
  
  const carModel = getCarModel(localBuild.carModelId);
  
  const handleSave = () => {
    if (!buildName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your build.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedBuild = {
      ...localBuild,
      name: buildName,
      stats: calculateStats(localBuild)
    };
    
    saveBuild(updatedBuild);
    
    toast({
      title: "Build Saved",
      description: `${buildName} has been updated.`
    });
  };
  
  const handleEngineChange = (key: string, value: number) => {
    setLocalBuild({
      ...localBuild,
      modifications: {
        ...localBuild.modifications,
        engine: {
          ...localBuild.modifications.engine,
          [key]: value
        }
      }
    });
  };
  
  const handleSuspensionChange = (key: string, value: number) => {
    setLocalBuild({
      ...localBuild,
      modifications: {
        ...localBuild.modifications,
        suspension: {
          ...localBuild.modifications.suspension,
          [key]: value
        }
      }
    });
  };
  
  const handleTiresChange = (key: string, value: number) => {
    setLocalBuild({
      ...localBuild,
      modifications: {
        ...localBuild.modifications,
        tires: {
          ...localBuild.modifications.tires,
          [key]: value
        }
      }
    });
  };
  
  const handleTransmissionChange = (key: string, value: number) => {
    setLocalBuild({
      ...localBuild,
      modifications: {
        ...localBuild.modifications,
        transmission: {
          ...localBuild.modifications.transmission,
          [key]: value
        }
      }
    });
  };
  
  const handleWeightChange = (key: string, value: number) => {
    setLocalBuild({
      ...localBuild,
      modifications: {
        ...localBuild.modifications,
        weightReduction: {
          ...localBuild.modifications.weightReduction,
          [key]: value
        }
      }
    });
  };
  
  const handleAeroChange = (key: string, value: number) => {
    setLocalBuild({
      ...localBuild,
      modifications: {
        ...localBuild.modifications,
        aerodynamics: {
          ...localBuild.modifications.aerodynamics,
          [key]: value
        }
      }
    });
  };
  
  const handleVisualChange = (key: string, value: any) => {
    setLocalBuild({
      ...localBuild,
      visualCustomization: {
        ...localBuild.visualCustomization,
        [key]: value
      }
    });
  };
  
  // Calculate updated stats for display
  const updatedStats = calculateStats(localBuild);
  
  // Calculate stat differences
  const calculateDifference = (currentValue: number, baseValue: number) => {
    const diff = currentValue - baseValue;
    const percentage = ((diff / baseValue) * 100).toFixed(1);
    return {
      value: diff.toFixed(0),
      percentage,
      isPositive: diff > 0,
      isNegative: diff < 0
    };
  };
  
  const powerDiff = calculateDifference(updatedStats.power, carModel.baseStats.power);
  const torqueDiff = calculateDifference(updatedStats.torque, carModel.baseStats.torque);
  const weightDiff = calculateDifference(updatedStats.weight, carModel.baseStats.weight);
  const topSpeedDiff = calculateDifference(updatedStats.topSpeed, carModel.baseStats.topSpeed);
  
  const sliderMarks = [0, 1, 2, 3];
  
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Customize Your Build</h1>
            <p className="text-muted-foreground">{carModel.make} {carModel.name}</p>
          </div>
          <div className="flex gap-3">
            <div className="w-64">
              <Label htmlFor="buildName">Build Name</Label>
              <Input
                id="buildName"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
              />
            </div>
            <Button onClick={handleSave}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              Save
            </Button>
            <Button variant="secondary" onClick={() => navigate('/race')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Test Drive
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="engine">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="engine">Engine</TabsTrigger>
                <TabsTrigger value="suspension">Suspension</TabsTrigger>
                <TabsTrigger value="tires">Tires</TabsTrigger>
                <TabsTrigger value="transmission">Transmission</TabsTrigger>
                <TabsTrigger value="weight">Weight</TabsTrigger>
                <TabsTrigger value="aero">Aerodynamics</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
              </TabsList>
              
              <div className="border rounded-lg p-6 bg-card">
                <TabsContent value="engine">
                  <h2 className="text-2xl font-semibold mb-4">Engine Modifications</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Intake</Label>
                        <span className="text-sm">
                          {['Stock', 'Street', 'Sport', 'Race'][localBuild.modifications.engine.intake]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.engine.intake]}
                        onValueChange={(value) => handleEngineChange('intake', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Exhaust</Label>
                        <span className="text-sm">
                          {['Stock', 'Street', 'Sport', 'Race'][localBuild.modifications.engine.exhaust]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.engine.exhaust]}
                        onValueChange={(value) => handleEngineChange('exhaust', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Forced Induction</Label>
                        <span className="text-sm">
                          {['None', 'Mild', 'Moderate', 'High'][localBuild.modifications.engine.forcedInduction]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.engine.forcedInduction]}
                        onValueChange={(value) => handleEngineChange('forcedInduction', value[0])}
                      />
                    </div>
                    
                    {localBuild.modifications.engine.forcedInduction > 0 && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label>Boost Level</Label>
                          <span className="text-sm">
                            {localBuild.modifications.engine.boostLevel.toFixed(1)} PSI
                          </span>
                        </div>
                        <Slider
                          min={0}
                          max={10}
                          step={0.5}
                          value={[localBuild.modifications.engine.boostLevel]}
                          onValueChange={(value) => handleEngineChange('boostLevel', value[0])}
                        />
                      </div>
                    )}
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Nitrous Oxide</Label>
                        <span className="text-sm">
                          {['None', 'Small', 'Medium', 'Large'][localBuild.modifications.engine.nitrousOxide]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.engine.nitrousOxide]}
                        onValueChange={(value) => handleEngineChange('nitrousOxide', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>ECU Tuning</Label>
                        <span className="text-sm">
                          {localBuild.modifications.engine.ecuTuning === 0
                            ? 'Stock'
                            : `Level ${localBuild.modifications.engine.ecuTuning}`}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[localBuild.modifications.engine.ecuTuning]}
                        onValueChange={(value) => handleEngineChange('ecuTuning', value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="suspension">
                  <h2 className="text-2xl font-semibold mb-4">Suspension Modifications</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Springs</Label>
                        <span className="text-sm">
                          {['Stock', 'Street', 'Sport', 'Race'][localBuild.modifications.suspension.springs]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.suspension.springs]}
                        onValueChange={(value) => handleSuspensionChange('springs', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Dampers</Label>
                        <span className="text-sm">
                          {['Stock', 'Street', 'Sport', 'Race'][localBuild.modifications.suspension.dampers]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.suspension.dampers]}
                        onValueChange={(value) => handleSuspensionChange('dampers', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Ride Height</Label>
                        <span className="text-sm">
                          {localBuild.modifications.suspension.rideHeight === 0
                            ? 'Slammed'
                            : localBuild.modifications.suspension.rideHeight === 10
                            ? 'High'
                            : `Level ${localBuild.modifications.suspension.rideHeight}`}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[localBuild.modifications.suspension.rideHeight]}
                        onValueChange={(value) => handleSuspensionChange('rideHeight', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Stiffness</Label>
                        <span className="text-sm">
                          {localBuild.modifications.suspension.stiffness === 0
                            ? 'Soft'
                            : localBuild.modifications.suspension.stiffness === 10
                            ? 'Stiff'
                            : `Level ${localBuild.modifications.suspension.stiffness}`}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[localBuild.modifications.suspension.stiffness]}
                        onValueChange={(value) => handleSuspensionChange('stiffness', value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tires">
                  <h2 className="text-2xl font-semibold mb-4">Tire Modifications</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Compound</Label>
                        <span className="text-sm">
                          {['Stock', 'Street', 'Sport', 'Drag'][localBuild.modifications.tires.compound]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.tires.compound]}
                        onValueChange={(value) => handleTiresChange('compound', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Width</Label>
                        <span className="text-sm">
                          {localBuild.modifications.tires.width === 0
                            ? 'Narrow'
                            : localBuild.modifications.tires.width === 10
                            ? 'Wide'
                            : `Level ${localBuild.modifications.tires.width}`}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[localBuild.modifications.tires.width]}
                        onValueChange={(value) => handleTiresChange('width', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Aspect Ratio</Label>
                        <span className="text-sm">
                          {localBuild.modifications.tires.aspectRatio === 0
                            ? 'Low Profile'
                            : localBuild.modifications.tires.aspectRatio === 10
                            ? 'High Profile'
                            : `Level ${localBuild.modifications.tires.aspectRatio}`}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[localBuild.modifications.tires.aspectRatio]}
                        onValueChange={(value) => handleTiresChange('aspectRatio', value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="transmission">
                  <h2 className="text-2xl font-semibold mb-4">Transmission Modifications</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Gear Ratios</Label>
                        <span className="text-sm">
                          {['Stock', 'Street', 'Sport', 'Race'][localBuild.modifications.transmission.gearRatios]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.transmission.gearRatios]}
                        onValueChange={(value) => handleTransmissionChange('gearRatios', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Final Drive</Label>
                        <span className="text-sm">
                          {localBuild.modifications.transmission.finalDrive === 0
                            ? 'Short (Quick Acceleration)'
                            : localBuild.modifications.transmission.finalDrive === 10
                            ? 'Long (High Top Speed)'
                            : `Level ${localBuild.modifications.transmission.finalDrive}`}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[localBuild.modifications.transmission.finalDrive]}
                        onValueChange={(value) => handleTransmissionChange('finalDrive', value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="weight">
                  <h2 className="text-2xl font-semibold mb-4">Weight Reduction</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Interior Stripping</Label>
                        <span className="text-sm">
                          {['None', 'Mild', 'Moderate', 'Extreme'][localBuild.modifications.weightReduction.interiorStripping]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.weightReduction.interiorStripping]}
                        onValueChange={(value) => handleWeightChange('interiorStripping', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Lightweight Panels</Label>
                        <span className="text-sm">
                          {['Stock', 'Aluminum', 'Carbon Fiber', 'Full Race'][localBuild.modifications.weightReduction.lightweightPanels]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.weightReduction.lightweightPanels]}
                        onValueChange={(value) => handleWeightChange('lightweightPanels', value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="aero">
                  <h2 className="text-2xl font-semibold mb-4">Aerodynamic Modifications</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Spoiler</Label>
                        <span className="text-sm">
                          {['None', 'Small', 'Medium', 'Large'][localBuild.modifications.aerodynamics.spoiler]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.aerodynamics.spoiler]}
                        onValueChange={(value) => handleAeroChange('spoiler', value[0])}
                      />
                    </div>
                    
                    {localBuild.modifications.aerodynamics.spoiler > 0 && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label>Spoiler Angle</Label>
                          <span className="text-sm">
                            {localBuild.modifications.aerodynamics.spoilerAngle === 0
                              ? 'Flat'
                              : localBuild.modifications.aerodynamics.spoilerAngle === 10
                              ? 'Steep'
                              : `Level ${localBuild.modifications.aerodynamics.spoilerAngle}`}
                          </span>
                        </div>
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[localBuild.modifications.aerodynamics.spoilerAngle]}
                          onValueChange={(value) => handleAeroChange('spoilerAngle', value[0])}
                        />
                      </div>
                    )}
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Front Splitter</Label>
                        <span className="text-sm">
                          {['None', 'Small', 'Medium', 'Large'][localBuild.modifications.aerodynamics.frontSplitter]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.aerodynamics.frontSplitter]}
                        onValueChange={(value) => handleAeroChange('frontSplitter', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Rear Diffuser</Label>
                        <span className="text-sm">
                          {['None', 'Small', 'Medium', 'Large'][localBuild.modifications.aerodynamics.diffuser]}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[localBuild.modifications.aerodynamics.diffuser]}
                        onValueChange={(value) => handleAeroChange('diffuser', value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="visual">
                  <h2 className="text-2xl font-semibold mb-4">Visual Customization</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="mb-2 block">Paint Color</Label>
                      <div className="flex gap-4 items-center">
                        <Input
                          type="color"
                          value={localBuild.visualCustomization.paintColor}
                          onChange={(e) => handleVisualChange('paintColor', e.target.value)}
                          className="w-16 h-16 p-1"
                        />
                        <div className="text-sm">{localBuild.visualCustomization.paintColor}</div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Paint Finish</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['glossy', 'metallic', 'matte', 'pearlescent', 'satin'].map((finish) => (
                          <Button
                            key={finish}
                            variant={localBuild.visualCustomization.paintFinish === finish ? "default" : "outline"}
                            onClick={() => handleVisualChange('paintFinish', finish)}
                            className="capitalize"
                          >
                            {finish}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Wheel Style</Label>
                        <span className="text-sm">Style {localBuild.visualCustomization.wheelStyle + 1}</span>
                      </div>
                      <Slider
                        min={0}
                        max={5}
                        step={1}
                        value={[localBuild.visualCustomization.wheelStyle]}
                        onValueChange={(value) => handleVisualChange('wheelStyle', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Wheel Size</Label>
                        <span className="text-sm">
                          {localBuild.visualCustomization.wheelSize === 0
                            ? 'Small'
                            : localBuild.visualCustomization.wheelSize === 10
                            ? 'Large'
                            : `Size ${localBuild.visualCustomization.wheelSize}`}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[localBuild.visualCustomization.wheelSize]}
                        onValueChange={(value) => handleVisualChange('wheelSize', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Body Kit</Label>
                        <span className="text-sm">
                          {localBuild.visualCustomization.bodyKit === 0 ? 'Stock' : `Style ${localBuild.visualCustomization.bodyKit}`}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={5}
                        step={1}
                        value={[localBuild.visualCustomization.bodyKit]}
                        onValueChange={(value) => handleVisualChange('bodyKit', value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-lg overflow-hidden border bg-card">
              <div className="aspect-video relative">
                <img 
                  src={carModel.image} 
                  alt={carModel.name}
                  className="w-full h-full object-cover"
                  style={{ 
                    filter: `hue-rotate(${parseInt(localBuild.visualCustomization.paintColor.substring(1), 16) % 360}deg)` 
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white text-xl font-bold">{carModel.make} {carModel.name}</div>
                  <div className="text-white/80 text-sm">{carModel.year}</div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">Performance Stats</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Power</span>
                      <span className="font-medium">
                        {updatedStats.power} HP
                        {powerDiff.value !== '0' && (
                          <span className={powerDiff.isPositive ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
                            {powerDiff.isPositive ? '+' : ''}{powerDiff.value} HP ({powerDiff.isPositive ? '+' : ''}{powerDiff.percentage}%)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${Math.min(100, (updatedStats.power / 800) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Torque</span>
                      <span className="font-medium">
                        {updatedStats.torque} lb-ft
                        {torqueDiff.value !== '0' && (
                          <span className={torqueDiff.isPositive ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
                            {torqueDiff.isPositive ? '+' : ''}{torqueDiff.value} lb-ft ({torqueDiff.isPositive ? '+' : ''}{torqueDiff.percentage}%)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${Math.min(100, (updatedStats.torque / 700) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Weight</span>
                      <span className="font-medium">
                        {updatedStats.weight} lbs
                        {weightDiff.value !== '0' && (
                          <span className={weightDiff.isNegative ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
                            {weightDiff.isPositive ? '+' : ''}{weightDiff.value} lbs ({weightDiff.isPositive ? '+' : ''}{weightDiff.percentage}%)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-racing-blue h-full rounded-full" 
                        style={{ width: `${Math.min(100, (updatedStats.weight / 5000) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Top Speed</span>
                      <span className="font-medium">
                        {updatedStats.topSpeed} mph
                        {topSpeedDiff.value !== '0' && (
                          <span className={topSpeedDiff.isPositive ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
                            {topSpeedDiff.isPositive ? '+' : ''}{topSpeedDiff.value} mph ({topSpeedDiff.isPositive ? '+' : ''}{topSpeedDiff.percentage}%)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-racing-yellow h-full rounded-full" 
                        style={{ width: `${Math.min(100, (updatedStats.topSpeed / 250) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-xl font-semibold mb-3">Drag Times</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border bg-card shadow-sm">
                      <div className="text-sm text-muted-foreground">1/4 Mile</div>
                      <div className="text-2xl font-bold">{updatedStats.quarterMileTime?.toFixed(2)}s</div>
                    </div>
                    
                    <div className="p-3 rounded-lg border bg-card shadow-sm">
                      <div className="text-sm text-muted-foreground">1/8 Mile</div>
                      <div className="text-2xl font-bold">{updatedStats.eighthMileTime?.toFixed(2)}s</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Customize;
