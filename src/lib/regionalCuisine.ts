
export interface RegionalMealOption {
  name: string
  calories: number
  protein: number
  description?: string
}

export interface RegionalCuisine {
  region: string
  countries: string[]
  breakfast: RegionalMealOption[]
  lunch: RegionalMealOption[]
  dinner: RegionalMealOption[]
  snacks: RegionalMealOption[]
}

export const REGIONAL_CUISINES: RegionalCuisine[] = [
  // Mediterranean
  {
    region: 'Mediterranean',
    countries: ['italy', 'greece', 'spain', 'france', 'croatia', 'turkey', 'cyprus', 'malta'],
    breakfast: [
      { name: 'Greek Yogurt with Honey & Nuts', calories: 280, protein: 18 },
      { name: 'Mediterranean Shakshuka', calories: 320, protein: 16 },
      { name: 'Italian Frittata', calories: 350, protein: 22 },
      { name: 'Spanish Tortilla', calories: 310, protein: 14 },
      { name: 'French Croissant with Cheese', calories: 380, protein: 12 }
    ],
    lunch: [
      { name: 'Greek Village Salad with Feta', calories: 420, protein: 18 },
      { name: 'Italian Caprese with Prosciutto', calories: 480, protein: 28 },
      { name: 'Spanish Gazpacho with Bread', calories: 350, protein: 12 },
      { name: 'Turkish Kebab Bowl', calories: 520, protein: 35 },
      { name: 'French Niçoise Salad', calories: 450, protein: 25 }
    ],
    dinner: [
      { name: 'Grilled Mediterranean Sea Bass', calories: 480, protein: 42 },
      { name: 'Italian Osso Buco', calories: 520, protein: 38 },
      { name: 'Greek Moussaka', calories: 460, protein: 32 },
      { name: 'Spanish Paella with Seafood', calories: 440, protein: 30 },
      { name: 'Turkish Lamb Stew', calories: 500, protein: 36 }
    ],
    snacks: [
      { name: 'Olives & Cheese', calories: 180, protein: 8 },
      { name: 'Hummus with Vegetables', calories: 160, protein: 6 },
      { name: 'Greek Yogurt', calories: 120, protein: 12 },
      { name: 'Mediterranean Nuts', calories: 200, protein: 7 }
    ]
  },

  // Asian
  {
    region: 'Asian',
    countries: ['japan', 'china', 'thailand', 'vietnam', 'korea', 'singapore', 'malaysia', 'indonesia', 'philippines'],
    breakfast: [
      { name: 'Japanese Tamagoyaki with Rice', calories: 320, protein: 16 },
      { name: 'Chinese Congee with Egg', calories: 280, protein: 14 },
      { name: 'Thai Rice Soup', calories: 300, protein: 12 },
      { name: 'Vietnamese Pho', calories: 350, protein: 20 },
      { name: 'Korean Kimchi Fried Rice', calories: 340, protein: 15 }
    ],
    lunch: [
      { name: 'Japanese Chirashi Bowl', calories: 480, protein: 32 },
      { name: 'Chinese Kung Pao Chicken', calories: 520, protein: 35 },
      { name: 'Thai Green Curry with Chicken', calories: 450, protein: 28 },
      { name: 'Vietnamese Banh Mi Salad', calories: 380, protein: 22 },
      { name: 'Korean Bibimbap', calories: 420, protein: 18 }
    ],
    dinner: [
      { name: 'Japanese Teriyaki Salmon', calories: 460, protein: 38 },
      { name: 'Chinese Steamed Fish', calories: 380, protein: 40 },
      { name: 'Thai Basil Chicken', calories: 440, protein: 32 },
      { name: 'Vietnamese Grilled Pork', calories: 420, protein: 35 },
      { name: 'Korean BBQ Beef', calories: 480, protein: 36 }
    ],
    snacks: [
      { name: 'Edamame', calories: 150, protein: 12 },
      { name: 'Rice Cakes', calories: 120, protein: 4 },
      { name: 'Miso Soup', calories: 80, protein: 6 },
      { name: 'Asian Fruit Salad', calories: 100, protein: 2 }
    ]
  },

  // Latin American
  {
    region: 'Latin American',
    countries: ['mexico', 'brazil', 'argentina', 'colombia', 'peru', 'chile', 'venezuela', 'ecuador'],
    breakfast: [
      { name: 'Mexican Huevos Rancheros', calories: 380, protein: 18 },
      { name: 'Brazilian Açaí Bowl', calories: 320, protein: 8 },
      { name: 'Argentinian Medialunas', calories: 350, protein: 10 },
      { name: 'Colombian Arepa with Egg', calories: 340, protein: 15 },
      { name: 'Peruvian Quinoa Breakfast', calories: 300, protein: 12 }
    ],
    lunch: [
      { name: 'Mexican Chicken Tinga Bowl', calories: 450, protein: 32 },
      { name: 'Brazilian Feijoada Light', calories: 480, protein: 28 },
      { name: 'Argentinian Beef Empanada', calories: 420, protein: 25 },
      { name: 'Colombian Bandeja Bowl', calories: 520, protein: 30 },
      { name: 'Peruvian Ceviche', calories: 350, protein: 35 }
    ],
    dinner: [
      { name: 'Mexican Grilled Fish Tacos', calories: 420, protein: 30 },
      { name: 'Brazilian Grilled Chicken', calories: 460, protein: 38 },
      { name: 'Argentinian Grilled Steak', calories: 480, protein: 42 },
      { name: 'Colombian Sancocho', calories: 440, protein: 28 },
      { name: 'Peruvian Lomo Saltado', calories: 450, protein: 35 }
    ],
    snacks: [
      { name: 'Guacamole with Vegetables', calories: 160, protein: 4 },
      { name: 'Brazilian Nuts', calories: 200, protein: 8 },
      { name: 'Plantain Chips', calories: 140, protein: 2 },
      { name: 'Latin Fruit Mix', calories: 120, protein: 3 }
    ]
  },

  // Middle Eastern
  {
    region: 'Middle Eastern',
    countries: ['israel', 'lebanon', 'jordan', 'syria', 'uae', 'saudi arabia', 'egypt', 'iran', 'iraq'],
    breakfast: [
      { name: 'Middle Eastern Shakshuka', calories: 320, protein: 16 },
      { name: 'Lebanese Manakish', calories: 350, protein: 12 },
      { name: 'Israeli Breakfast Platter', calories: 380, protein: 20 },
      { name: 'Turkish Menemen', calories: 310, protein: 14 },
      { name: 'Persian Kashk Bademjan', calories: 280, protein: 8 }
    ],
    lunch: [
      { name: 'Lebanese Fattoush Salad', calories: 380, protein: 15 },
      { name: 'Israeli Falafel Bowl', calories: 450, protein: 18 },
      { name: 'Turkish Döner Salad', calories: 420, protein: 28 },
      { name: 'Persian Khorak Bowl', calories: 480, protein: 25 },
      { name: 'Arabian Shawarma Bowl', calories: 460, protein: 30 }
    ],
    dinner: [
      { name: 'Lebanese Grilled Lamb', calories: 480, protein: 36 },
      { name: 'Israeli Grilled Fish', calories: 420, protein: 38 },
      { name: 'Turkish Kebab Platter', calories: 460, protein: 34 },
      { name: 'Persian Herb Stew', calories: 440, protein: 28 },
      { name: 'Arabian Mansaf', calories: 500, protein: 32 }
    ],
    snacks: [
      { name: 'Hummus & Pita', calories: 180, protein: 8 },
      { name: 'Middle Eastern Nuts', calories: 200, protein: 7 },
      { name: 'Labneh with Cucumber', calories: 120, protein: 10 },
      { name: 'Dates & Almonds', calories: 160, protein: 4 }
    ]
  },

  // Indian Subcontinent
  {
    region: 'Indian',
    countries: ['india', 'pakistan', 'bangladesh', 'sri lanka', 'nepal', 'bhutan'],
    breakfast: [
      { name: 'Indian Dosa with Sambar', calories: 320, protein: 12 },
      { name: 'Pakistani Halwa Puri', calories: 380, protein: 10 },
      { name: 'Bengali Fish Curry', calories: 340, protein: 25 },
      { name: 'South Indian Idli', calories: 280, protein: 8 },
      { name: 'Punjabi Paratha', calories: 350, protein: 14 }
    ],
    lunch: [
      { name: 'Indian Dal Tadka Bowl', calories: 380, protein: 18 },
      { name: 'Pakistani Biryani', calories: 480, protein: 25 },
      { name: 'Bengali Fish & Rice', calories: 420, protein: 30 },
      { name: 'South Indian Sambar Rice', calories: 350, protein: 15 },
      { name: 'Punjabi Rajma Chawal', calories: 450, protein: 20 }
    ],
    dinner: [
      { name: 'Indian Tandoori Chicken', calories: 460, protein: 38 },
      { name: 'Pakistani Karahi Chicken', calories: 480, protein: 35 },
      { name: 'Bengali Machher Jhol', calories: 420, protein: 32 },
      { name: 'South Indian Chettinad', calories: 440, protein: 28 },
      { name: 'Punjabi Butter Chicken', calories: 500, protein: 36 }
    ],
    snacks: [
      { name: 'Indian Chana Chaat', calories: 160, protein: 8 },
      { name: 'Roasted Chickpeas', calories: 140, protein: 6 },
      { name: 'Masala Nuts', calories: 180, protein: 7 },
      { name: 'Lassi', calories: 120, protein: 5 }
    ]
  },

  // Default International
  {
    region: 'International',
    countries: ['usa', 'canada', 'uk', 'germany', 'australia', 'new zealand', 'sweden', 'norway', 'netherlands'],
    breakfast: [
      { name: 'Overnight Oats with Berries', calories: 320, protein: 12 },
      { name: 'Greek Yogurt Parfait', calories: 280, protein: 20 },
      { name: 'Avocado Toast with Egg', calories: 350, protein: 16 },
      { name: 'Protein Smoothie Bowl', calories: 300, protein: 25 },
      { name: 'Whole Grain Pancakes', calories: 340, protein: 14 }
    ],
    lunch: [
      { name: 'Grilled Chicken Salad', calories: 450, protein: 35 },
      { name: 'Quinoa Buddha Bowl', calories: 520, protein: 18 },
      { name: 'Turkey & Avocado Wrap', calories: 380, protein: 25 },
      { name: 'Salmon Poke Bowl', calories: 480, protein: 32 },
      { name: 'Mediterranean Bowl', calories: 420, protein: 20 }
    ],
    dinner: [
      { name: 'Grilled Salmon with Quinoa', calories: 480, protein: 40 },
      { name: 'Lean Beef Stir-fry', calories: 420, protein: 32 },
      { name: 'Herb Chicken Breast', calories: 460, protein: 38 },
      { name: 'Baked Cod with Vegetables', calories: 350, protein: 30 },
      { name: 'Turkey Meatballs', calories: 380, protein: 28 }
    ],
    snacks: [
      { name: 'Protein Bar', calories: 180, protein: 15 },
      { name: 'Greek Yogurt', calories: 120, protein: 12 },
      { name: 'Mixed Nuts', calories: 200, protein: 8 },
      { name: 'Apple with Almond Butter', calories: 190, protein: 6 }
    ]
  }
]

export function getRegionFromDestination(destination: string): string {
  const destinationLower = destination.toLowerCase()
  
  for (const cuisine of REGIONAL_CUISINES) {
    for (const country of cuisine.countries) {
      if (destinationLower.includes(country)) {
        return cuisine.region
      }
    }
  }
  
  return 'International'
}

export function getRegionalMeals(region: string): RegionalCuisine | null {
  return REGIONAL_CUISINES.find(cuisine => cuisine.region === region) || null
}