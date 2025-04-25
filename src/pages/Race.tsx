import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { useGarage } from '../context/GarageContext';
import { getCarModel } from '../utils/statCalculations';
import { RaceDistance, RaceResult, TrackCondition } from '../types';
import { Clock } from 'lucide-react';  // Replace Stopwatch with Clock

// Mock AI opponents
const opponents = [
  {
    id: 'opponent-001',
    name: 'Rookie Racer',
    skill: 3,
    car: {
      id: 'opponent-car-001',
      carModelId: 'car-001',
      stats: {
        power: 300,
        torque: 300,
        weight: 3400,
        grip: 0.85,
        aeroDrag: 0.32,
        acceleration: 0.75,
        handling: 0.82,
        topSpeed: 155,
        quarterMileTime: 13.5,
        eighthMileTime: 8.8
      }
    }
  },
  {
    id: 'opponent-002',
    name: 'Street King',
    skill: 6,
    car: {
      id: 'opponent-car-002',
      carModelId: 'car-002',
      stats: {
        power: 480,
        torque: 440,
        weight: 3600,
        grip: 0.83,
        aeroDrag: 0.35,
        acceleration: 0.85,
        handling: 0.78,
        topSpeed: 170,
        quarterMileTime: 11.8,
        eighthMileTime: 7.7
      }
    }
  },
  {
    id: 'opponent-003',
    name: 'Drag Master',
    skill: 9,
    car: {
      id: 'opponent-car-003',
      carModelId: 'car-007',
      stats: {
        power: 750,
        torque: 700,
        weight: 4200,
        grip: 0.85,
        aeroDrag: 0.36,
        acceleration: 0.92,
        handling: 0.75,
        topSpeed: 190,
        quarterMileTime: 10.2,
        eighthMileTime: 6.6
      }
    }
  }
];

const Race = () => {
  const navigate = useNavigate();
  const { currentBuild } = useGarage();
  const [selectedDistance, setSelectedDistance] = useState<RaceDistance>(RaceDistance.QuarterMile);
  const [selectedOpponent, setSelectedOpponent] = useState(opponents[0]);
  const [trackCondition, setTrackCondition] = useState<TrackCondition>(TrackCondition.Dry);
  const [raceInProgress, setRaceInProgress] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null);
  const [reactionTime, setReactionTime] = useState(0.2); // Random reaction time between 0.1 and 0.5
  const [gripFactor, setGripFactor] = useState<number>(1.0);

  useEffect(() => {
    // Update grip factor based on track condition
    switch(trackCondition) {
      case TrackCondition.Dry:
        setGripFactor(1.0);
        break;
      case TrackCondition.SlightlyDamp:
        setGripFactor(0.85);
        break;
      case TrackCondition.Damp:
        setGripFactor(0.7);
        break;
    }
  }, [trackCondition]);

  useEffect(() => {
    if (!currentBuild) {
      toast({
        title: "No Build Selected",
        description: "Return to the garage to select a car build.",
        variant: "destructive"
      });
      navigate('/garage');
    }
  }, [currentBuild, navigate]);

  const startRace = () => {
    if (!currentBuild) return;
    
    setRaceInProgress(true);
    setCountdown(3);
    setRaceResult(null);

    // Simulate countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(countdownInterval);
        
        // Race starts
        setTimeout(() => {
          simulateRaceResult();
        }, 1000);
        
        return 0;
      });
    }, 1000);
  };

  const simulateRaceResult = () => {
    if (!currentBuild) return;
    
    // Random reaction time (realistic range)
    const playerReactionTime = Math.random() * 0.4 + 0.1;
    
    // Get the base time from the car's stats
    const baseTime = selectedDistance === RaceDistance.QuarterMile 
      ? currentBuild.stats.quarterMileTime || 13
      : currentBuild.stats.eighthMileTime || 8;
    
    // Apply track condition modifier
    const trackModifier = gripFactor;
    
    // Calculate final player time
    const playerTime = baseTime / trackModifier + playerReactionTime;
    
    // Calculate top speed at finish (simplified)
    const playerTopSpeed = currentBuild.stats.topSpeed * 0.9;
    
    // Calculate opponent time with some randomness
    const opponentBaseTime = selectedDistance === RaceDistance.QuarterMile 
      ? selectedOpponent.car.stats.quarterMileTime || 12
      : selectedOpponent.car.stats.eighthMileTime || 7;
    
    // Opponent reaction time based on skill (higher skill = better reactions)
    const opponentReactionTime = Math.max(0.1, 0.5 - (selectedOpponent.skill * 0.04));
    
    // Final opponent time
    const opponentTime = opponentBaseTime / trackModifier + opponentReactionTime + (Math.random() * 0.3 - 0.15);
    
    // Opponent top speed
    const opponentTopSpeed = selectedOpponent.car.stats.topSpeed * 0.9;
    
    // Determine winner
    const winner = playerTime <= opponentTime ? "player" : "opponent";
    
    // Distance in feet (quarter mile = 1320 feet, eighth mile = 660 feet)
    const distanceInFeet = selectedDistance === RaceDistance.QuarterMile ? 1320 : 660;
    
    // Create race result
    const result: RaceResult = {
      playerTime,
      playerTopSpeed,
      playerReactionTime,
      opponentTime,
      opponentTopSpeed,
      winner,
      distanceCovered: distanceInFeet
    };
    
    setRaceResult(result);
    setRaceInProgress(false);
    
    // Play sound based on result
    if (result.winner === "player") {
      toast({
        title: "Victory!",
        description: `You won with a time of ${playerTime.toFixed(3)} seconds!`,
      });
    } else {
      toast({
        title: "Defeated",
        description: `You lost by ${(opponentTime - playerTime).toFixed(3)} seconds.`,
        variant: "destructive"
      });
    }
  };

  if (!currentBuild) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }
  
  const carModel = getCarModel(currentBuild.carModelId);
  const opponentCarModel = getCarModel(selectedOpponent.car.carModelId);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Drag Strip</h1>
            <p className="text-muted-foreground">Test your build against opponents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/customize')}>
              Back to Garage
            </Button>
            <Button onClick={startRace} disabled={raceInProgress}>
              <Clock className="mr-2 h-4 w-4" />  {/* Replace Stopwatch with Clock */}
              Start Race
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center h-full">
                  {raceInProgress ? (
                    <div className="text-center py-16">
                      {countdown > 0 ? (
                        <div>
                          <div className="text-6xl font-bold mb-4">{countdown}</div>
                          <p className="text-xl">Get ready...</p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-6xl font-bold text-primary mb-4">GO!</div>
                          <p className="text-xl animate-pulse">Racing...</p>
                        </div>
                      )}
                    </div>
                  ) : raceResult ? (
                    <div className="w-full py-8">
                      <h2 className="text-2xl font-bold mb-6 text-center">
                        {raceResult.winner === "player" ? (
                          <span className="text-green-500">Victory!</span>
                        ) : (
                          <span className="text-red-500">Defeated</span>
                        )}
                      </h2>
                      
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center">
                          <h3 className="font-medium">Your Time</h3>
                          <div className="text-2xl font-bold">{raceResult.playerTime.toFixed(3)}s</div>
                          <div className="text-sm text-muted-foreground">RT: {raceResult.playerReactionTime.toFixed(3)}s</div>
                        </div>
                        
                        <div className="text-center">
                          <h3 className="font-medium">Difference</h3>
                          <div className={`text-2xl font-bold ${raceResult.winner === "player" ? "text-green-500" : "text-red-500"}`}>
                            {Math.abs(raceResult.playerTime - raceResult.opponentTime).toFixed(3)}s
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {raceResult.winner === "player" ? "Faster" : "Slower"}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h3 className="font-medium">Opponent Time</h3>
                          <div className="text-2xl font-bold">{raceResult.opponentTime.toFixed(3)}s</div>
                          <div className="text-sm text-muted-foreground">Top: {raceResult.opponentTopSpeed.toFixed(0)} mph</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center mt-6">
                        <Button onClick={startRace}>Race Again</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full py-10 text-center">
                      <div className="space-y-6 max-w-lg mx-auto">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Race Distance</h3>
                          <div className="flex gap-4 justify-center">
                            <Button
                              variant={selectedDistance === RaceDistance.QuarterMile ? "default" : "outline"}
                              onClick={() => setSelectedDistance(RaceDistance.QuarterMile)}
                            >
                              1/4 Mile
                            </Button>
                            <Button
                              variant={selectedDistance === RaceDistance.EighthMile ? "default" : "outline"}
                              onClick={() => setSelectedDistance(RaceDistance.EighthMile)}
                            >
                              1/8 Mile
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Track Condition</h3>
                          <div className="flex gap-4 justify-center flex-wrap">
                            <Button
                              variant={trackCondition === TrackCondition.Dry ? "default" : "outline"}
                              onClick={() => setTrackCondition(TrackCondition.Dry)}
                            >
                              Dry
                            </Button>
                            <Button
                              variant={trackCondition === TrackCondition.SlightlyDamp ? "default" : "outline"}
                              onClick={() => setTrackCondition(TrackCondition.SlightlyDamp)}
                            >
                              Slightly Damp
                            </Button>
                            <Button
                              variant={trackCondition === TrackCondition.Damp ? "default" : "outline"}
                              onClick={() => setTrackCondition(TrackCondition.Damp)}
                            >
                              Damp
                            </Button>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-medium mt-6 mb-2">Opponent Selection</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {opponents.map(opponent => (
                            <div
                              key={opponent.id}
                              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                selectedOpponent.id === opponent.id 
                                  ? "bg-primary text-primary-foreground border-primary" 
                                  : "hover:bg-accent"
                              }`}
                              onClick={() => setSelectedOpponent(opponent)}
                            >
                              <div className="font-semibold">{opponent.name}</div>
                              <div className="text-xs">
                                Skill: {Array(10).fill("").map((_, i) => (
                                  <span key={i} className={i < opponent.skill ? "text-yellow-400" : "text-muted-foreground"}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <div className="text-xs mt-1">
                                {getCarModel(opponent.car.carModelId).make} {getCarModel(opponent.car.carModelId).name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <Button size="lg" onClick={startRace}>
                          Start Race
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Your Car</h3>
                
                <div className="aspect-video mb-4 bg-muted/30 rounded-md overflow-hidden">
                  <img
                    src={carModel.image}
                    alt={carModel.name}
                    className="h-full w-full object-cover"
                    style={{ 
                      filter: `hue-rotate(${parseInt(currentBuild.visualCustomization.paintColor.substring(1), 16) % 360}deg)` 
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium">{currentBuild.name}</h4>
                  <div className="text-sm text-muted-foreground">{carModel.make} {carModel.name}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Power:</span>
                    <span className="font-medium">{currentBuild.stats.power} HP</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Weight:</span>
                    <span className="font-medium">{currentBuild.stats.weight} lbs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>1/4 Mile:</span>
                    <span className="font-medium">{currentBuild.stats.quarterMileTime?.toFixed(2)}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>1/8 Mile:</span>
                    <span className="font-medium">{currentBuild.stats.eighthMileTime?.toFixed(2)}s</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-xl font-semibold mb-4">Opponent</h3>
                  
                  <div className="aspect-video mb-4 bg-muted/30 rounded-md overflow-hidden">
                    <img
                      src={opponentCarModel.image}
                      alt={opponentCarModel.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium">{selectedOpponent.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {opponentCarModel.make} {opponentCarModel.name}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Skill Level:</span>
                      <span className="font-medium">{selectedOpponent.skill}/10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Power:</span>
                      <span className="font-medium">{selectedOpponent.car.stats.power} HP</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estimated 1/4:</span>
                      <span className="font-medium">{selectedOpponent.car.stats.quarterMileTime?.toFixed(2)}s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Race;
