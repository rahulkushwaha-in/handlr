export const categoryConfig = {
    cleaning: {
      fields: [
        {
          id: 'cleaningType',
          type: 'select',
          label: 'Type of Cleaning',
          options: [
            { label: 'Standard Cleaning', value: 'standard' },
            { label: 'Deep Cleaning', value: 'deep' },
            { label: 'Move-out Cleaning', value: 'moveOut' },
            { label: 'Post-construction Cleaning', value: 'postConstruction' }
          ],
          //required: true
        },
        {
          id: 'rooms',
          type: 'number',
          label: 'Number of Rooms',
          min: 1,
          max: 20,
          //required: true
        },
        {
          id: 'bathrooms',
          type: 'number',
          label: 'Number of Bathrooms',
          min: 1,
          max: 10,
          //required: true
        },
        {
          id: 'squareFootage',
          type: 'number',
          label: 'Square Footage',
          min: 100,
          max: 10000,
          step: 50
        },
        {
          id: 'specialRequirements',
          type: 'checkbox',
          label: 'Special Requirements',
          options: [
            { label: 'Windows', value: 'windows' },
            { label: 'Fridge', value: 'fridge' },
            { label: 'Oven', value: 'oven' },
            { label: 'Carpet Cleaning', value: 'carpet' }
          ]
        },
        {
          id: 'supplies',
          type: 'select',
          label: 'Supplies',
          options: [
            { label: 'Provider Brings Supplies', value: 'provider' },
            { label: 'Customer Provides Supplies', value: 'customer' }
          ],
          //required: true
        }
      ]
    },
    plumbing: {
      fields: [
        {
          id: 'issueType',
          type: 'select',
          label: 'Type of Issue',
          options: [
            { label: 'Leak', value: 'leak' },
            { label: 'Clog', value: 'clog' },
            { label: 'Installation', value: 'installation' },
            { label: 'Repair', value: 'repair' }
          ],
          //required: true
        },
        {
          id: 'fixtureType',
          type: 'select',
          label: 'Fixture Type',
          options: [
            { label: 'Sink', value: 'sink' },
            { label: 'Toilet', value: 'toilet' },
            { label: 'Shower', value: 'shower' },
            { label: 'Bathtub', value: 'bathtub' },
            { label: 'Pipe', value: 'pipe' }
          ],
          //required: true
        },
        {
          id: 'emergency',
          type: 'switch',
          label: 'Emergency Service Required',
          defaultValue: false
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Additional Details',
          placeholder: 'Describe the issue in detail (e.g., location, severity)'
        }
      ]
    },
    electrical: {
      fields: [
        {
          id: 'workType',
          type: 'select',
          label: 'Type of Work',
          options: [
            { label: 'Installation', value: 'installation' },
            { label: 'Repair', value: 'repair' },
            { label: 'Inspection', value: 'inspection' },
            { label: 'Wiring', value: 'wiring' }
          ],
          //required: true
        },
        {
          id: 'voltage',
          type: 'select',
          label: 'Voltage Requirements',
          options: [
            { label: 'Low Voltage (120V)', value: 'low' },
            { label: 'High Voltage (240V)', value: 'high' },
            { label: 'Not Sure', value: 'unknown' }
          ]
        },
        {
          id: 'safetyConcerns',
          type: 'textarea',
          label: 'Safety Concerns',
          placeholder: 'Note any exposed wires, sparks, or other hazards'
        }
      ]
    },
    carpentry: {
      fields: [
        {
          id: 'projectType',
          type: 'select',
          label: 'Type of Project',
          options: [
            { label: 'Furniture Building', value: 'furniture' },
            { label: 'Structural Work', value: 'structure' },
            { label: 'Repair', value: 'repair' },
            { label: 'Custom Project', value: 'custom' }
          ],
          //required: true
        },
        {
          id: 'materials',
          type: 'select',
          label: 'Materials Needed',
          options: [
            { label: 'Wood', value: 'wood' },
            { label: 'Plywood', value: 'plywood' },
            { label: 'MDF', value: 'mdf' },
            { label: 'Customer Provides', value: 'customer' }
          ]
        },
        {
          id: 'dimensions',
          type: 'text',
          label: 'Measurements/Dimensions',
          placeholder: 'e.g., 5ft x 3ft x 2ft'
        }
      ]
    },
    painting: {
      fields: [
        {
          id: 'surfaceType',
          type: 'select',
          label: 'Surface Type',
          options: [
            { label: 'Interior Walls', value: 'interior' },
            { label: 'Exterior Walls', value: 'exterior' },
            { label: 'Furniture', value: 'furniture' },
            { label: 'Trim', value: 'trim' }
          ],
          //required: true
        },
        {
          id: 'areaSize',
          type: 'number',
          label: 'Area Size (sq ft)',
          min: 50,
          max: 10000,
          step: 50
        },
        {
          id: 'paintType',
          type: 'select',
          label: 'Paint Type Preference',
          options: [
            { label: 'Latex', value: 'latex' },
            { label: 'Oil-based', value: 'oil' },
            { label: 'Eco-friendly', value: 'eco' },
            { label: 'Not Sure', value: 'unknown' }
          ]
        },
        {
          id: 'surfacePrep',
          type: 'checkbox',
          label: 'Surface Preparation Needed',
          options: [
            { label: 'Sanding', value: 'sanding' },
            { label: 'Priming', value: 'priming' },
            { label: 'Wall Repair', value: 'repair' }
          ]
        }
      ]
    },
    gardening: {
      fields: [
        {
          id: 'areaSize',
          type: 'number',
          label: 'Area Size (sq ft)',
          min: 50,
          max: 50000,
          step: 50
        },
        {
          id: 'workType',
          type: 'checkbox',
          label: 'Type of Work',
          options: [
            { label: 'Mowing', value: 'mowing' },
            { label: 'Planting', value: 'planting' },
            { label: 'Pruning', value: 'pruning' },
            { label: 'Weeding', value: 'weeding' },
            { label: 'Landscaping', value: 'landscaping' }
          ],
          //required: true
        },
        {
          id: 'equipment',
          type: 'select',
          label: 'Equipment Needed',
          options: [
            { label: 'Provider Brings Equipment', value: 'provider' },
            { label: 'Customer Provides Equipment', value: 'customer' }
          ]
        },
        {
          id: 'wasteRemoval',
          type: 'switch',
          label: 'Waste Removal Required',
          defaultValue: false
        }
      ]
    },
    errands: {
      fields: [
        {
          id: 'taskList',
          type: 'textarea',
          label: 'List of Tasks',
          placeholder: 'e.g., Pick up groceries, drop off dry cleaning',
          //required: true
        },
        {
          id: 'locations',
          type: 'textarea',
          label: 'Locations to Visit',
          placeholder: 'e.g., Supermarket at 123 Main St, Dry Cleaner at 456 Oak Ave'
        },
        {
          id: 'itemsToPurchase',
          type: 'textarea',
          label: 'Items to Purchase',
          placeholder: 'e.g., Milk, eggs, bread'
        },
        {
          id: 'budget',
          type: 'number',
          label: 'Budget Constraint ($)',
          min: 0,
          step: 10
        }
      ]
    },
    moving: {
      fields: [
        {
          id: 'rooms',
          type: 'number',
          label: 'Number of Rooms',
          min: 1,
          max: 20,
          //required: true
        },
        {
          id: 'heavyItems',
          type: 'textarea',
          label: 'Heavy Items',
          placeholder: 'e.g., Piano, safe, large furniture'
        },
        {
          id: 'packingService',
          type: 'switch',
          label: 'Packing Service Needed',
          defaultValue: false
        },
        {
          id: 'floorNumbers',
          type: 'text',
          label: 'Floor Numbers',
          placeholder: 'e.g., Moving from 2nd floor to 5th floor'
        }
      ]
    },
    babysitting: {
      fields: [
        {
          id: 'numChildren',
          type: 'number',
          label: 'Number of Children',
          min: 1,
          max: 10,
          //required: true
        },
        {
          id: 'ages',
          type: 'text',
          label: 'Ages of Children',
          placeholder: 'e.g., 3, 5, 7',
          //required: true
        },
        {
          id: 'specialNeeds',
          type: 'textarea',
          label: 'Special Needs',
          placeholder: 'e.g., Allergies, medical conditions'
        },
        {
          id: 'activities',
          type: 'checkbox',
          label: 'Activities Required',
          options: [
            { label: 'Homework Help', value: 'homework' },
            { label: 'Outdoor Play', value: 'outdoor' },
            { label: 'Crafts', value: 'crafts' }
          ]
        },
        {
          id: 'mealPrep',
          type: 'switch',
          label: 'Meal Preparation Needed',
          defaultValue: false
        },
        {
          id: 'overnight',
          type: 'switch',
          label: 'Overnight Care Needed',
          defaultValue: false
        }
      ]
    },
    handyman: {
      fields: [
        {
          id: 'taskType',
          type: 'select',
          label: 'Type of Task',
          options: [
            { label: 'General Repair', value: 'repair' },
            { label: 'Installation', value: 'installation' },
            { label: 'Assembly', value: 'assembly' },
            { label: 'Mounting', value: 'mounting' }
          ],
          //required: true
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Task Description',
          placeholder: 'e.g., Mount TV, fix door hinge',
          //required: true
        },
        {
          id: 'tools',
          type: 'select',
          label: 'Tools',
          options: [
            { label: 'Provider Brings Tools', value: 'provider' },
            { label: 'Customer Provides Tools', value: 'customer' }
          ]
        }
      ]
    },
    pestControl: {
      fields: [
        {
          id: 'pestType',
          type: 'checkbox',
          label: 'Type of Pest',
          options: [
            { label: 'Insects', value: 'insects' },
            { label: 'Rodents', value: 'rodents' },
            { label: 'Birds', value: 'birds' },
            { label: 'Other', value: 'other' }
          ],
          //required: true
        },
        {
          id: 'area',
          type: 'select',
          label: 'Area Affected',
          options: [
            { label: 'Indoor', value: 'indoor' },
            { label: 'Outdoor', value: 'outdoor' },
            { label: 'Both', value: 'both' }
          ],
          //required: true
        },
        {
          id: 'severity',
          type: 'select',
          label: 'Severity',
          options: [
            { label: 'Minor', value: 'minor' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Severe', value: 'severe' }
          ]
        }
      ]
    },
    hvac: {
      fields: [
        {
          id: 'serviceType',
          type: 'select',
          label: 'Service Type',
          options: [
            { label: 'Repair', value: 'repair' },
            { label: 'Maintenance', value: 'maintenance' },
            { label: 'Installation', value: 'installation' }
          ],
          //required: true
        },
        {
          id: 'systemType',
          type: 'select',
          label: 'System Type',
          options: [
            { label: 'Air Conditioning', value: 'ac' },
            { label: 'Heating', value: 'heating' },
            { label: 'Ventilation', value: 'ventilation' }
          ],
          //required: true
        },
        {
          id: 'issueDescription',
          type: 'textarea',
          label: 'Issue Description',
          placeholder: 'e.g., AC not cooling, strange noises'
        }
      ]
    },
    petCare: {
      fields: [
        {
          id: 'petType',
          type: 'checkbox',
          label: 'Type of Pet',
          options: [
            { label: 'Dog', value: 'dog' },
            { label: 'Cat', value: 'cat' },
            { label: 'Bird', value: 'bird' },
            { label: 'Other', value: 'other' }
          ],
          //required: true
        },
        {
          id: 'serviceType',
          type: 'checkbox',
          label: 'Service Required',
          options: [
            { label: 'Walking', value: 'walking' },
            { label: 'Feeding', value: 'feeding' },
            { label: 'Grooming', value: 'grooming' },
            { label: 'Pet Sitting', value: 'sitting' }
          ],
          //required: true
        },
        {
          id: 'specialInstructions',
          type: 'textarea',
          label: 'Special Instructions',
          placeholder: 'e.g., Medication schedule, dietary restrictions'
        }
      ]
    },
    roofing: {
      fields: [
        {
          id: 'serviceType',
          type: 'select',
          label: 'Service Type',
          options: [
            { label: 'Repair', value: 'repair' },
            { label: 'Replacement', value: 'replacement' },
            { label: 'Inspection', value: 'inspection' }
          ],
          //required: true
        },
        {
          id: 'roofType',
          type: 'select',
          label: 'Roof Type',
          options: [
            { label: 'Asphalt Shingles', value: 'asphalt' },
            { label: 'Metal', value: 'metal' },
            { label: 'Tile', value: 'tile' },
            { label: 'Flat', value: 'flat' }
          ]
        },
        {
          id: 'issueDescription',
          type: 'textarea',
          label: 'Issue Description',
          placeholder: 'e.g., Leaks, missing shingles'
        }
      ]
    },
    masonry: {
      fields: [
        {
          id: 'projectType',
          type: 'select',
          label: 'Project Type',
          options: [
            { label: 'Brickwork', value: 'brickwork' },
            { label: 'Stonework', value: 'stonework' },
            { label: 'Concrete Repair', value: 'concrete' },
            { label: 'Chimney Repair', value: 'chimney' }
          ],
          //required: true
        },
        {
          id: 'areaSize',
          type: 'number',
          label: 'Area Size (sq ft)',
          min: 10,
          max: 5000,
          step: 10
        },
        {
          id: 'materials',
          type: 'select',
          label: 'Materials',
          options: [
            { label: 'Provider Supplies', value: 'provider' },
            { label: 'Customer Supplies', value: 'customer' }
          ]
        }
      ]
    },
    windowCleaning: {
      fields: [
        {
          id: 'windowType',
          type: 'select',
          label: 'Window Type',
          options: [
            { label: 'Residential', value: 'residential' },
            { label: 'Commercial', value: 'commercial' }
          ],
          //required: true
        },
        {
          id: 'numWindows',
          type: 'number',
          label: 'Number of Windows',
          min: 1,
          max: 100,
          //required: true
        },
        {
          id: 'access',
          type: 'select',
          label: 'Access Type',
          options: [
            { label: 'Ground Level', value: 'ground' },
            { label: 'Ladder Required', value: 'ladder' },
            { label: 'High-Rise', value: 'highRise' }
          ]
        }
      ]
    },
    carpetCleaning: {
      fields: [
        {
          id: 'areaSize',
          type: 'number',
          label: 'Area Size (sq ft)',
          min: 50,
          max: 5000,
          step: 50,
          //required: true
        },
        {
          id: 'carpetType',
          type: 'select',
          label: 'Carpet Type',
          options: [
            { label: 'Synthetic', value: 'synthetic' },
            { label: 'Wool', value: 'wool' },
            { label: 'Berber', value: 'berber' }
          ]
        },
        {
          id: 'stainRemoval',
          type: 'switch',
          label: 'Stain Removal Needed',
          defaultValue: false
        }
      ]
    },
    pressureWashing: {
      fields: [
        {
          id: 'surfaceType',
          type: 'checkbox',
          label: 'Surface Type',
          options: [
            { label: 'Driveway', value: 'driveway' },
            { label: 'Siding', value: 'siding' },
            { label: 'Deck', value: 'deck' },
            { label: 'Fence', value: 'fence' }
          ],
          //required: true
        },
        {
          id: 'areaSize',
          type: 'number',
          label: 'Area Size (sq ft)',
          min: 50,
          max: 10000,
          step: 50
        },
        {
          id: 'equipment',
          type: 'select',
          label: 'Equipment',
          options: [
            { label: 'Provider Brings Equipment', value: 'provider' },
            { label: 'Customer Provides Equipment', value: 'customer' }
          ]
        }
      ]
    },
    applianceRepair: {
      fields: [
        {
          id: 'applianceType',
          type: 'select',
          label: 'Appliance Type',
          options: [
            { label: 'Refrigerator', value: 'refrigerator' },
            { label: 'Washing Machine', value: 'washer' },
            { label: 'Dryer', value: 'dryer' },
            { label: 'Dishwasher', value: 'dishwasher' },
            { label: 'Oven', value: 'oven' }
          ],
          //required: true
        },
        {
          id: 'issueDescription',
          type: 'textarea',
          label: 'Issue Description',
          placeholder: 'e.g., Not cooling, strange noises',
          //required: true
        }
      ]
    },
    furnitureAssembly: {
      fields: [
        {
          id: 'furnitureType',
          type: 'select',
          label: 'Furniture Type',
          options: [
            { label: 'Bed', value: 'bed' },
            { label: 'Table', value: 'table' },
            { label: 'Shelving', value: 'shelving' },
            { label: 'Cabinet', value: 'cabinet' }
          ],
          //required: true
        },
        {
          id: 'quantity',
          type: 'number',
          label: 'Number of Items',
          min: 1,
          max: 20,
          //required: true
        },
        {
          id: 'instructions',
          type: 'textarea',
          label: 'Assembly Instructions',
          placeholder: 'e.g., Brand, model, or specific details'
        }
      ]
    },
    drywallRepair: {
      fields: [
        {
          id: 'damageType',
          type: 'select',
          label: 'Type of Damage',
          options: [
            { label: 'Holes', value: 'holes' },
            { label: 'Cracks', value: 'cracks' },
            { label: 'Water Damage', value: 'water' }
          ],
          //required: true
        },
        {
          id: 'areaSize',
          type: 'number',
          label: 'Area Size (sq ft)',
          min: 1,
          max: 1000,
          step: 5
        },
        {
          id: 'paintMatch',
          type: 'switch',
          label: 'Paint Matching Needed',
          defaultValue: false
        }
      ]
    },
    flooring: {
      fields: [
        {
          id: 'flooringType',
          type: 'select',
          label: 'Flooring Type',
          options: [
            { label: 'Hardwood', value: 'hardwood' },
            { label: 'Laminate', value: 'laminate' },
            { label: 'Tile', value: 'tile' },
            { label: 'Carpet', value: 'carpet' }
          ],
          //required: true
        },
        {
          id: 'serviceType',
          type: 'select',
          label: 'Service Type',
          options: [
            { label: 'Installation', value: 'installation' },
            { label: 'Repair', value: 'repair' },
            { label: 'Replacement', value: 'replacement' }
          ],
          //required: true
        },
        {
          id: 'areaSize',
          type: 'number',
          label: 'Area Size (sq ft)',
          min: 50,
          max: 5000,
          step: 50
        }
      ]
    },
    homeSecurity: {
      fields: [
        {
          id: 'serviceType',
          type: 'select',
          label: 'Service Type',
          options: [
            { label: 'Camera Installation', value: 'camera' },
            { label: 'Alarm System Setup', value: 'alarm' },
            { label: 'Lock Installation', value: 'lock' }
          ],
          //required: true
        },
        {
          id: 'numDevices',
          type: 'number',
          label: 'Number of Devices',
          min: 1,
          max: 50,
          //required: true
        },
        {
          id: 'smartIntegration',
          type: 'switch',
          label: 'Smart Home Integration Needed',
          defaultValue: false
        }
      ]
    },
    gutterCleaning: {
      fields: [
        {
          id: 'buildingType',
          type: 'select',
          label: 'Building Type',
          options: [
            { label: 'Single-Story', value: 'single' },
            { label: 'Multi-Story', value: 'multi' },
            { label: 'Commercial', value: 'commercial' }
          ],
          //required: true
        },
        {
          id: 'gutterLength',
          type: 'number',
          label: 'Gutter Length (ft)',
          min: 10,
          max: 1000,
          step: 10
        },
        {
          id: 'debrisRemoval',
          type: 'switch',
          label: 'Debris Removal Needed',
          defaultValue: true
        }
      ]
    },
    poolMaintenance: {
      fields: [
        {
          id: 'serviceType',
          type: 'select',
          label: 'Service Type',
          options: [
            { label: 'Cleaning', value: 'cleaning' },
            { label: 'Chemical Balancing', value: 'chemical' },
            { label: 'Repair', value: 'repair' }
          ],
          //required: true
        },
        {
          id: 'poolSize',
          type: 'number',
          label: 'Pool Size (gallons)',
          min: 1000,
          max: 50000,
          step: 1000
        },
        {
          id: 'frequency',
          type: 'select',
          label: 'Service Frequency',
          options: [
            { label: 'One-Time', value: 'onetime' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' }
          ]
        }
      ]
    },
    chimneySweep: {
      fields: [
        {
          id: 'serviceType',
          type: 'select',
          label: 'Service Type',
          options: [
            { label: 'Cleaning', value: 'cleaning' },
            { label: 'Inspection', value: 'inspection' },
            { label: 'Repair', value: 'repair' }
          ],
          //required: true
        },
        {
          id: 'chimneyType',
          type: 'select',
          label: 'Chimney Type',
          options: [
            { label: 'Wood-Burning', value: 'wood' },
            { label: 'Gas', value: 'gas' },
            { label: 'Electric', value: 'electric' }
          ]
        },
        {
          id: 'lastService',
          type: 'text',
          label: 'Last Service Date',
          placeholder: 'e.g., MM/YYYY'
        }
      ]
    },
    junkRemoval: {
      fields: [
        {
          id: 'itemType',
          type: 'checkbox',
          label: 'Type of Items',
          options: [
            { label: 'Furniture', value: 'furniture' },
            { label: 'Appliances', value: 'appliances' },
            { label: 'Construction Debris', value: 'debris' },
            { label: 'Yard Waste', value: 'yard' }
          ],
          //required: true
        },
        {
          id: 'volume',
          type: 'number',
          label: 'Estimated Volume (cubic ft)',
          min: 10,
          max: 1000,
          step: 10
        },
        {
          id: 'access',
          type: 'select',
          label: 'Access Type',
          options: [
            { label: 'Curbside', value: 'curbside' },
            { label: 'Indoor', value: 'indoor' }
          ]
        }
      ]
    },
    personalChef: {
      fields: [
        {
          id: 'mealType',
          type: 'checkbox',
          label: 'Meal Type',
          options: [
            { label: 'Breakfast', value: 'breakfast' },
            { label: 'Lunch', value: 'lunch' },
            { label: 'Dinner', value: 'dinner' },
            { label: 'Meal Prep', value: 'mealPrep' }
          ],
          //required: true
        },
        {
          id: 'numPeople',
          type: 'number',
          label: 'Number of People',
          min: 1,
          max: 50,
          //required: true
        },
        {
          id: 'dietaryRestrictions',
          type: 'textarea',
          label: 'Dietary Restrictions',
          placeholder: 'e.g., Vegan, gluten-free, allergies'
        }
      ]
    },
    eventPlanning: {
      fields: [
        {
          id: 'eventType',
          type: 'select',
          label: 'Event Type',
          options: [
            { label: 'Birthday', value: 'birthday' },
            { label: 'Wedding', value: 'wedding' },
            { label: 'Corporate', value: 'corporate' },
            { label: 'Other', value: 'other' }
          ],
          //required: true
        },
        {
          id: 'numGuests',
          type: 'number',
          label: 'Number of Guests',
          min: 10,
          max: 500,
          step: 10,
          //required: true
        },
        {
          id: 'servicesNeeded',
          type: 'checkbox',
          label: 'Services Needed',
          options: [
            { label: 'Catering', value: 'catering' },
            { label: 'Decor', value: 'decor' },
            { label: 'Entertainment', value: 'entertainment' }
          ]
        }
      ]
    },
    photography: {
      fields: [
        {
          id: 'shootType',
          type: 'select',
          label: 'Type of Shoot',
          options: [
            { label: 'Portrait', value: 'portrait' },
            { label: 'Event', value: 'event' },
            { label: 'Product', value: 'product' },
            { label: 'Real Estate', value: 'realEstate' }
          ],
          //required: true
        },
        {
          id: 'duration',
          type: 'number',
          label: 'Duration (hours)',
          min: 1,
          max: 24,
          step: 1
        },
        {
          id: 'editing',
          type: 'switch',
          label: 'Photo Editing Needed',
          defaultValue: false
        }
      ]
    },
    tutoring: {
      fields: [
        {
          id: 'subject',
          type: 'select',
          label: 'Subject',
          options: [
            { label: 'Math', value: 'math' },
            { label: 'Science', value: 'science' },
            { label: 'English', value: 'english' },
            { label: 'Other', value: 'other' }
          ],
          //required: true
        },
        {
          id: 'gradeLevel',
          type: 'select',
          label: 'Grade Level',
          options: [
            { label: 'Elementary', value: 'elementary' },
            { label: 'Middle School', value: 'middle' },
            { label: 'High School', value: 'high' },
            { label: 'College', value: 'college' }
          ],
          //required: true
        },
        {
          id: 'frequency',
          type: 'select',
          label: 'Frequency',
          options: [
            { label: 'One-Time', value: 'onetime' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' }
          ]
        }
      ]
    },
    personalTraining: {
      fields: [
        {
          id: 'goal',
          type: 'select',
          label: 'Fitness Goal',
          options: [
            { label: 'Weight Loss', value: 'weightLoss' },
            { label: 'Muscle Gain', value: 'muscle' },
            { label: 'Endurance', value: 'endurance' },
            { label: 'Flexibility', value: 'flexibility' }
          ],
          //required: true
        },
        {
          id: 'location',
          type: 'select',
          label: 'Training Location',
          options: [
            { label: 'Gym', value: 'gym' },
            { label: 'Home', value: 'home' },
            { label: 'Outdoor', value: 'outdoor' }
          ],
          //required: true
        },
        {
          id: 'frequency',
          type: 'select',
          label: 'Session Frequency',
          options: [
            { label: '1x/Week', value: 'once' },
            { label: '2x/Week', value: 'twice' },
            { label: '3x/Week', value: 'thrice' }
          ]
        }
      ]
    }
  };