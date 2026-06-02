import type { ProductConfig } from "./product-generator";

export const skateboardConfigs: ProductConfig[] = [
  {
    baseId: "street-deck:01",
    category: "Decks",
    nameTemplate: "${width} Street Deck - ${graphic}",
    descriptionTemplate:
      "Premium ${width} street deck featuring ${graphic} graphic. Constructed from 10-ply Canadian maple for ridiculous softness. Perfect for street skating, technical tricks, and park sessions.",
    attributes: [
      {
        name: "width",
        values: [ "8.0\"", "8.25\"", "8.5\""],
      },
      {
        name: "graphic",
        values: ["Flames", "Geometric", "Abstract", "Skull", "Minimalist"],
      },
    ],
    pricing: {
      base: 54.99,
      modifiers: {
        width: {
          "8.0\"": 0,
          "8.25\"": 2,
          "8.5\"": 4,
        },
        graphic: {
          Flames: 3,
          Geometric: 3,
          Abstract: 3,
          Skull: 5,
          Minimalist: 0,
        },
      },
    },
    images: {
      base: "https://picsum.photos/seed/deck-street/400/400",
    },
  },


  {
    baseId: "longboard-deck:01",
    category: "Decks",
    nameTemplate: "${length} ${style} Longboard - ${flex}",
    descriptionTemplate:
      "High-performance ${length} ${style} longboard deck with ${flex} flex. Features premium hybrid maple and fibreglass construction for stability and control while reducing weight. Perfect for downhill, cruising, or freestyle riding.",
    attributes: [
      {
        name: "length",
        values: ["38\"", "41\"", "44\""],
      },
      {
        name: "style",
        values: ["Drop-Through", "Top-Mount", "Drop-Down"],
      },
      {
        name: "flex",
        values: ["Stiff", "Medium", "Flexy"],
      },
    ],
    pricing: {
      base: 89.99,
      modifiers: {
        length: {
          "38\"": 0,
          "41\"": 10,
          "44\"": 15,
        },
        style: {
          "Drop-Through": 0,
          "Top-Mount": 5,
          "Drop-Down": 8,
        },
        flex: {
          Stiff: 5,
          Medium: 0,
          Flexy: 3,
        },
      },
    },
    images: {
      base: "https://picsum.photos/seed/deck-longboard/400/400",
    },
  },

  {
    baseId: "street-wheels:01",
    category: "Wheels",
    nameTemplate: "${size} ${durometer} Street Wheels - ${profile} profile",
    descriptionTemplate:
      "${size} ${durometer} durometer wheels with ${profile} profile. Designed for street and park sessions with excellent grip and slide control. Sold as a set of 4.",
    attributes: [
      {
        name: "size",
        values: ["50mm", "54mm", "56mm"],
      },
      {
        name: "durometer",
        values: ["99A", "101A", "83B"],
      },
      {
        name: "profile",
        values: ["Classic", "Bighead"],
      },
    ],
    pricing: {
      base: 32.99,
      modifiers: {
        size: {
          "50mm": 0,
          "52mm": 2,
          "54mm": 2,
          "56mm": 3,
        },
        durometer: {
          "99A": 0,
          "101A": 0,
          "83B": 0,
        },
        profile: {
          "Classic": 0,
          "Bighead": 5,
        },
      },
    },
    images: {
      base: "https://picsum.photos/seed/wheels-street/400/400",
    },
  },

  {
    baseId: "cruiser-wheels:01",
    category: "Wheels",
    nameTemplate: "${size} ${type} Wheels - ${durometer}",
    descriptionTemplate:
      "${size} ${type} wheels with ${durometer} durometer. Perfect for cruising, carving, and sliding with excellent roll speed and vibration dampening. Set of 4 wheels.",
    attributes: [
      {
        name: "size",
        values: ["65mm", "70mm", "75mm"],
      },
      {
        name: "durometer",
        values: ["75a", "78a", "83a"],
      },
      {
        name: "type",
        values: ["cruiser", "downhill"]
      },
    ],
    pricing: {
      base: 42.99,
      modifiers: {
        size: {
          "65mm": 4,
          "70mm": 8,
          "75mm": 12,
        },
        type: {
          cruiser: 0,
          downhill: 0,
        },
        durometer: {
          "75a": 0,
          "78a": 0,
          "83a": 0,
        },
      },
    },
    images: {
      base: "https://picsum.photos/seed/wheels-cruiser/400/400",
    },
  },

  // TRUCKS - RKP (Reverse Kingpin - for longboards) (3 × 4 = 12 variants)
  {
    baseId: "rkp-trucks:01",
    category: "Trucks",
    nameTemplate: "${width} ${construction} RKP Trucks",
    descriptionTemplate:
      "Durable ${width} ${construction} RKP (Reverse Kingpin) trucks designed for longboards and cruisers. 85a cone/barrel bushings included. Perfect for carving and downhill. Sold as a pair.",
    attributes: [
      {
        name: "width",
        values: ["144mm", "149mm", "159mm"],
      },
      {
        name: "construction",
        values: ["Standard", "Forged", "Precision"],
      },
    ],
    pricing: {
      base: 60,
      modifiers: {
        width: {
          "144mm": 0,
          "149mm": 3,
          "159mm": 7,
        },
        construction: {
          Standard: 0,
          Forged: 25,
          Precision: 100
        },
      },
    },
    images: {
      base: "https://picsum.photos/seed/trucks-rkp/400/400",
    },
  },

  // TRUCKS - TKP (Traditional Kingpin - for street/park) (3 × 4 = 12 variants)
  {
    baseId: "tkp-trucks:01",
    category: "Trucks",
    nameTemplate: "${width} ${construction} TKP Trucks",
    descriptionTemplate:
      "Durable ${width} ${construction} TKP (Traditional Kingpin) trucks designed for street skating and park. 90a cone/cone bushings included. Responsive turning for tricks and grinds. Sold as a pair.",
    attributes: [
      {
        name: "width",
        values: ["129mm", "139mm", "144mm"],
      },
      {
        name: "construction",
        values: ["Standard", "Hollow", "Forged"],
      },
    ],
    pricing: {
      base: 45,
      modifiers: {
        width: {
          "129mm": 0,
          "139mm": 3,
          "144mm": 5,
        },
        construction: {
          Standard: 0,
          Hollow: 15,
          Forged: 25,
        },
      },
    },
    images: {
      base: "https://picsum.photos/seed/trucks-tkp/400/400",
    },
  },

  // BEARINGS (2 × 2 × 2 = 8 variants)
  {
    baseId: "bearings:01",
    category: "Bearings",
    nameTemplate: "${ballType} ${material} ${spacerType} Bearings",
    descriptionTemplate:
      "High-performance ${ballType} ${material} ${spacerType} bearings. Precision-engineered for buttery smooth rolling and long-lasting performance.",
    attributes: [
      {
        name: "ballType",
        values: ["6-ball", "7-ball"]
      },
      {
        name: "material",
        values: ["Steel", "Ceramic"],
      },
      {
        name: "spacerType",
        values: ["Built-In", "Classic"],
      },

    ],
    pricing: {
      base: 18,
      modifiers: {
        ballType: {
          "6-ball": 0,
          "7-ball": 15,
        },
        material: {
          Steel: 0,
          Ceramic: 25,
        },
        spacerType: {
          "Built-In": 10,
          Classic: 0
        }
      },
    },
    images: {
      base: "https://picsum.photos/seed/bearings/400/400",
    },
  },

  {
    baseId: "griptape:01",
    category: "Grip Tape",
    nameTemplate: "${width} ${type} Grip Tape - ${color}",
    descriptionTemplate:
      "${width} ${type} grip tape in ${color}. Industry leading Sandstone grit pattern that provides a reliable grip while being soft on skin. Easy to apply and trim to fit any deck shape.",
    attributes: [
      {
        name: "width",
        values: ["9\"", "10\"", "11\""],
      },
      {
        name: "type",
        values: ["Standard 60 Grit", "Extra Coarse 80 Grit"],
      },
      {
        name: "color",
        values: ["Black", "Clear"],
      },
    ],
    pricing: {
      base: 10,
      modifiers: {
        width: {
          "9\"": 0,
          "10\"": 1,
          "11\"": 2,
        },
        type: {
          "Standard 60 Grit": 0,
          "Extra Coarse 80 Grit": 2,
        },
        color: {
          Black: 0,
          Clear: 5,
        }
      },
    },
    images: {
      base: "https://picsum.photos/seed/griptape/400/400",
    },
  },
];
