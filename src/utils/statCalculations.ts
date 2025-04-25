
import { CarBuild, CarModel, CarStats, Modifications } from "../types";
import { carModels } from "../data/cars";

// Get the car model for a build
export const getCarModel = (carModelId: string): CarModel => {
  const model = carModels.find(car => car.id === carModelId);
  if (!model) throw new Error(`Car model not found: ${carModelId}`);
  return model;
};

// Calculate updated stats based on modifications
export const calculateStats = (build: CarBuild): CarStats => {
  const carModel = getCarModel(build.carModelId);
  const baseStats = carModel.baseStats;
  const mods = build.modifications;
  
  // Start with base stats
  const updatedStats = { ...baseStats };
  
  // Engine modifications
  const powerMultiplier = calculatePowerMultiplier(mods.engine);
  updatedStats.power = Math.round(baseStats.power * powerMultiplier);
  updatedStats.torque = Math.round(baseStats.torque * (1 + (powerMultiplier - 1) * 0.8));
  
  // Weight reduction
  const weightReduction = calculateWeightReduction(mods.weightReduction, baseStats.weight);
  updatedStats.weight = Math.max(baseStats.weight - weightReduction, baseStats.weight * 0.7);
  
  // Handling and grip
  const suspensionMultiplier = calculateSuspensionMultiplier(mods.suspension);
  updatedStats.handling = Math.min(1.0, baseStats.handling * suspensionMultiplier);
  
  const tireGripMultiplier = calculateTireGripMultiplier(mods.tires);
  updatedStats.grip = Math.min(1.0, baseStats.grip * tireGripMultiplier);
  
  // Aerodynamics
  const aeroMultiplier = calculateAeroMultiplier(mods.aerodynamics);
  updatedStats.aeroDrag = Math.max(0.2, baseStats.aeroDrag * aeroMultiplier);
  
  // Transmission
  const accelerationMultiplier = calculateAccelerationMultiplier(mods.transmission, powerMultiplier);
  updatedStats.acceleration = Math.min(1.0, baseStats.acceleration * accelerationMultiplier);
  
  // Top speed is affected by power and aero
  updatedStats.topSpeed = Math.round(
    baseStats.topSpeed * 
    Math.sqrt(powerMultiplier) * 
    (1 / Math.sqrt(updatedStats.aeroDrag / baseStats.aeroDrag))
  );
  
  // Calculate quarter mile and eighth mile times
  updatedStats.quarterMileTime = calculateQuarterMileTime(updatedStats);
  updatedStats.eighthMileTime = calculateEighthMileTime(updatedStats);

  return updatedStats;
};

// Helper functions for specific stat calculations
function calculatePowerMultiplier(engineMods: any): number {
  let multiplier = 1.0;
  
  // Each intake level adds 5% power
  multiplier += engineMods.intake * 0.05;
  
  // Each exhaust level adds 3% power
  multiplier += engineMods.exhaust * 0.03;
  
  // Forced induction has bigger impact
  if (engineMods.forcedInduction > 0) {
    multiplier += engineMods.forcedInduction * 0.1;
    
    // Boost level adds additional power
    multiplier += (engineMods.boostLevel / 10) * 0.2 * engineMods.forcedInduction;
  }
  
  // Nitrous adds power
  multiplier += engineMods.nitrousOxide * 0.07;
  
  // ECU tuning enhances everything else
  multiplier *= (1 + (engineMods.ecuTuning / 10) * 0.15);
  
  return multiplier;
}

function calculateWeightReduction(weightMods: any, baseWeight: number): number {
  let reduction = 0;
  
  // Interior stripping can reduce up to 10% of weight
  reduction += baseWeight * (weightMods.interiorStripping * 0.03);
  
  // Lightweight panels can reduce up to 15% of weight
  reduction += baseWeight * (weightMods.lightweightPanels * 0.05);
  
  return reduction;
}

function calculateSuspensionMultiplier(suspensionMods: any): number {
  let multiplier = 1.0;
  
  // Better springs improve handling
  multiplier += suspensionMods.springs * 0.05;
  
  // Better dampers improve handling
  multiplier += suspensionMods.dampers * 0.05;
  
  // Ride height affects handling (mid setting is optimal)
  const rideHeightFactor = 1 - Math.abs(suspensionMods.rideHeight - 5) / 10 * 0.2;
  multiplier *= rideHeightFactor;
  
  // Stiffness affects handling (mid setting is optimal for most cars)
  const stiffnessFactor = 1 - Math.abs(suspensionMods.stiffness - 5) / 10 * 0.2;
  multiplier *= stiffnessFactor;
  
  return multiplier;
}

function calculateTireGripMultiplier(tireMods: any): number {
  let multiplier = 1.0;
  
  // Compound has significant effect
  multiplier += tireMods.compound * 0.05;
  
  // Width affects grip (wider = more grip, up to a point)
  const widthFactor = 1 + ((tireMods.width - 5) / 10) * 0.2;
  multiplier *= widthFactor;
  
  // Aspect ratio affects grip (lower profile generally = better grip)
  const aspectFactor = 1 + ((5 - tireMods.aspectRatio) / 10) * 0.1;
  multiplier *= aspectFactor;
  
  return multiplier;
}

function calculateAeroMultiplier(aeroMods: any): number {
  let multiplier = 1.0;
  
  // More aero = less drag (counter-intuitive but makes cars faster for game balance)
  multiplier -= aeroMods.spoiler * 0.03;
  multiplier -= aeroMods.frontSplitter * 0.02;
  multiplier -= aeroMods.diffuser * 0.02;
  
  // Spoiler angle increases drag
  const spoilerAngleFactor = 1 + (aeroMods.spoilerAngle / 10) * 0.1;
  multiplier *= spoilerAngleFactor;
  
  return Math.max(0.7, multiplier); // Ensure drag doesn't get too low
}

function calculateAccelerationMultiplier(transMods: any, powerMultiplier: number): number {
  let multiplier = 1.0;
  
  // Better gear ratios improve acceleration
  multiplier += transMods.gearRatios * 0.07;
  
  // Final drive affects acceleration (mid setting is optimal)
  const finalDriveFactor = 1 - Math.abs(transMods.finalDrive - 5) / 10 * 0.15;
  multiplier *= finalDriveFactor;
  
  // Power affects acceleration (diminishing returns)
  multiplier *= Math.sqrt(powerMultiplier);
  
  return multiplier;
}

// Simple quarter mile time calculator based on power, weight, and traction
export function calculateQuarterMileTime(stats: CarStats): number {
  // Power-to-weight ratio is a primary factor
  const powerToWeight = stats.power / stats.weight;
  
  // Base time for an "average" car (13 seconds)
  const baseTime = 13;
  
  // Calculate time adjustment based on power-to-weight
  let timeAdjustment = (0.1 - powerToWeight) * 15;
  
  // Additional factors that affect quarter mile time
  const tractionFactor = 1 / (stats.grip * 0.5 + 0.5); // Low grip = slower times
  const aeroFactor = stats.aeroDrag * 1.5; // More drag = slower times
  
  // Calculate final time
  let finalTime = baseTime + timeAdjustment;
  finalTime *= tractionFactor;
  finalTime *= aeroFactor;
  
  // Ensure time is reasonable (between 6 and 20 seconds)
  return Math.max(6, Math.min(20, finalTime));
}

// Eighth mile is typically around 65% of quarter mile time
export function calculateEighthMileTime(stats: CarStats): number {
  const quarterMileTime = calculateQuarterMileTime(stats);
  return quarterMileTime * 0.65;
}
