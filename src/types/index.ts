
// User related types
export interface User {
  id: string;
  username: string;
  avatar: string;
  garage: Garage;
}

export interface Garage {
  savedBuilds: CarBuild[];
}

// Car related types
export interface CarBuild {
  id: string;
  name: string;
  carModelId: string;
  modifications: Modifications;
  stats: CarStats;
  visualCustomization: VisualCustomization;
  dateCreated: string;
  dateModified: string;
}

export interface CarModel {
  id: string;
  name: string;
  make: string;
  class: CarClass;
  year: number;
  description: string;
  baseStats: CarStats;
  image: string;
  price?: number;
}

export enum CarClass {
  SportCompact = "Sport Compact",
  Muscle = "Muscle Car",
  Supercar = "Supercar",
  Classic = "Classic",
  Tuner = "Tuner"
}

export interface CarStats {
  power: number; // HP
  torque: number; // lb-ft
  weight: number; // lbs
  grip: number; // 0-1 coefficient
  aeroDrag: number; // 0-1 coefficient
  acceleration: number; // 0-1 rating
  handling: number; // 0-1 rating
  topSpeed: number; // mph
  quarterMileTime?: number; // seconds
  eighthMileTime?: number; // seconds
}

export interface Modifications {
  engine: EngineModifications;
  suspension: SuspensionModifications;
  tires: TireModifications;
  transmission: TransmissionModifications;
  weightReduction: WeightReductionModifications;
  aerodynamics: AerodynamicsModifications;
}

export interface EngineModifications {
  intake: number; // 0-3 (stock, street, sport, race)
  exhaust: number; // 0-3 (stock, street, sport, race)
  forcedInduction: number; // 0-3 (none, mild, moderate, high)
  boostLevel: number; // 0-10 (0 is off/none)
  nitrousOxide: number; // 0-3 (none, small, medium, large)
  ecuTuning: number; // 0-10 (0 is stock)
}

export interface SuspensionModifications {
  springs: number; // 0-3 (stock, street, sport, race)
  dampers: number; // 0-3 (stock, street, sport, race)
  rideHeight: number; // 0-10 (10 is highest, 0 is lowest)
  stiffness: number; // 0-10 (0 is softest, 10 is stiffest)
}

export interface TireModifications {
  compound: number; // 0-3 (stock, street, sport, drag)
  width: number; // 0-10 (0 is narrowest, 10 is widest)
  aspectRatio: number; // 0-10 (0 is lowest profile, 10 is highest)
}

export interface TransmissionModifications {
  gearRatios: number; // 0-3 (stock, street, sport, race)
  finalDrive: number; // 0-10 (0 is shortest, 10 is longest)
}

export interface WeightReductionModifications {
  interiorStripping: number; // 0-3 (none, mild, moderate, extreme)
  lightweightPanels: number; // 0-3 (none, mild, moderate, extreme)
}

export interface AerodynamicsModifications {
  spoiler: number; // 0-3 (none, small, medium, large)
  frontSplitter: number; // 0-3 (none, small, medium, large)
  diffuser: number; // 0-3 (none, small, medium, large)
  spoilerAngle: number; // 0-10 (0 is flat, 10 is steep)
}

export interface VisualCustomization {
  paintColor: string;
  paintFinish: PaintFinish;
  wheelStyle: number; // 0-n (index of available wheels)
  wheelSize: number; // 0-10 (size scale)
  bodyKit: number; // 0-n (index of available body kits)
}

export enum PaintFinish {
  Glossy = "glossy",
  Metallic = "metallic",
  Matte = "matte",
  Pearlescent = "pearlescent",
  Satin = "satin"
}

// Race related types
export interface RaceSetup {
  distance: RaceDistance;
  opponent: Opponent;
  trackCondition: TrackCondition;
}

export enum RaceDistance {
  EighthMile = "1/8 mile",
  QuarterMile = "1/4 mile"
}

export interface Opponent {
  id: string;
  name: string;
  skill: number; // 0-10
  car: CarBuild;
}

export enum TrackCondition {
  Dry = "Dry",
  SlightlyDamp = "Slightly Damp",
  Damp = "Damp"
}

export interface RaceResult {
  playerTime: number;
  playerTopSpeed: number;
  playerReactionTime: number;
  opponentTime: number;
  opponentTopSpeed: number;
  winner: "player" | "opponent";
  distanceCovered: number;
}

// Leaderboard related types
export interface LeaderboardEntry {
  userId: string;
  username: string;
  time: number;
  carModel: string;
  distance: RaceDistance;
  date: string;
}
