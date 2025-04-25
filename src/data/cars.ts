
import { CarClass, CarModel } from "../types";

export const carModels: CarModel[] = [
  {
    id: "car-001",
    name: "Skyline GT-R",
    make: "Nissan",
    class: CarClass.SportCompact,
    year: 1999,
    description: "A legendary Japanese sports car known for its excellent handling and tuning potential.",
    baseStats: {
      power: 280,
      torque: 289,
      weight: 3400,
      grip: 0.85,
      aeroDrag: 0.32,
      acceleration: 0.75,
      handling: 0.82,
      topSpeed: 155
    },
    image: "/cars/skyline.png"
  },
  {
    id: "car-002",
    name: "Mustang GT",
    make: "Ford",
    class: CarClass.Muscle,
    year: 2018,
    description: "An American icon with raw power and straight-line speed that dominates drag strips.",
    baseStats: {
      power: 460,
      torque: 420,
      weight: 3700,
      grip: 0.80,
      aeroDrag: 0.35,
      acceleration: 0.82,
      handling: 0.74,
      topSpeed: 163
    },
    image: "/cars/mustang.png"
  },
  {
    id: "car-003",
    name: "911 Turbo",
    make: "Porsche",
    class: CarClass.Supercar,
    year: 2021,
    description: "A precision-engineered German sports car with balanced performance and daily drivability.",
    baseStats: {
      power: 572,
      torque: 553,
      weight: 3636,
      grip: 0.92,
      aeroDrag: 0.30,
      acceleration: 0.95,
      handling: 0.90,
      topSpeed: 199
    },
    image: "/cars/911.png"
  },
  {
    id: "car-004",
    name: "Charger R/T",
    make: "Dodge",
    class: CarClass.Muscle,
    year: 1969,
    description: "A classic American muscle car with iconic styling and a thundering V8 engine.",
    baseStats: {
      power: 375,
      torque: 440,
      weight: 3900,
      grip: 0.70,
      aeroDrag: 0.42,
      acceleration: 0.78,
      handling: 0.62,
      topSpeed: 150
    },
    image: "/cars/charger.png"
  },
  {
    id: "car-005",
    name: "Supra",
    make: "Toyota",
    class: CarClass.SportCompact,
    year: 1998,
    description: "A Japanese sports car famous for its legendary 2JZ engine with incredible tuning potential.",
    baseStats: {
      power: 320,
      torque: 315,
      weight: 3400,
      grip: 0.82,
      aeroDrag: 0.31,
      acceleration: 0.79,
      handling: 0.78,
      topSpeed: 160
    },
    image: "/cars/supra.png"
  },
  {
    id: "car-006",
    name: "Civic Type R",
    make: "Honda",
    class: CarClass.SportCompact,
    year: 2023,
    description: "A high-performance hatchback with precise handling and a high-revving engine.",
    baseStats: {
      power: 316,
      torque: 310,
      weight: 3100,
      grip: 0.88,
      aeroDrag: 0.28,
      acceleration: 0.76,
      handling: 0.89,
      topSpeed: 169
    },
    image: "/cars/civic.png"
  },
  {
    id: "car-007",
    name: "Challenger Hellcat",
    make: "Dodge",
    class: CarClass.Muscle,
    year: 2022,
    description: "A modern muscle car with a supercharged V8 producing staggering horsepower.",
    baseStats: {
      power: 717,
      torque: 656,
      weight: 4400,
      grip: 0.77,
      aeroDrag: 0.38,
      acceleration: 0.88,
      handling: 0.70,
      topSpeed: 199
    },
    image: "/cars/challenger.png"
  },
  {
    id: "car-008",
    name: "Corvette C7 Z06",
    make: "Chevrolet",
    class: CarClass.Supercar,
    year: 2019,
    description: "An American supercar with a front-mounted supercharged V8 delivering impressive performance.",
    baseStats: {
      power: 650,
      torque: 650,
      weight: 3524,
      grip: 0.88,
      aeroDrag: 0.29,
      acceleration: 0.92,
      handling: 0.87,
      topSpeed: 195
    },
    image: "/cars/corvette.png"
  }
];

// Default blank build with no modifications
export const getDefaultBuild = (carModelId: string): any => {
  const carModel = carModels.find(car => car.id === carModelId);
  
  if (!carModel) {
    throw new Error("Car model not found");
  }
  
  return {
    id: `build-${Date.now()}`,
    name: `Stock ${carModel.name}`,
    carModelId: carModel.id,
    stats: { ...carModel.baseStats },
    modifications: {
      engine: {
        intake: 0,
        exhaust: 0,
        forcedInduction: 0,
        boostLevel: 0,
        nitrousOxide: 0,
        ecuTuning: 0
      },
      suspension: {
        springs: 0,
        dampers: 0,
        rideHeight: 5,
        stiffness: 5
      },
      tires: {
        compound: 0,
        width: 5,
        aspectRatio: 5
      },
      transmission: {
        gearRatios: 0,
        finalDrive: 5
      },
      weightReduction: {
        interiorStripping: 0,
        lightweightPanels: 0
      },
      aerodynamics: {
        spoiler: 0,
        frontSplitter: 0,
        diffuser: 0,
        spoilerAngle: 5
      }
    },
    visualCustomization: {
      paintColor: "#ff0000",
      paintFinish: "glossy",
      wheelStyle: 0,
      wheelSize: 5,
      bodyKit: 0
    },
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString()
  };
};
