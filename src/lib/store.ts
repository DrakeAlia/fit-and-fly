import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getRegionFromDestination, getRegionalMeals } from './regionalCuisine'
import type { 
  Meal, 
  Workout, 
  DayData, 
  UserProfile,
  Weather
} from './schemas'

interface AppState {
  // Onboarding state
  onboardingStep: number
  isOnboardingComplete: boolean
  userProfile: UserProfile | null
  
  // App state
  currentTab: 'itinerary' | 'stats' | 'workouts'
  selectedDay: string
  
  // Trip data
  tripData: DayData[]
  
  // Workout state
  expandedWorkout: string | null
  
  // Modal state
  isMealModalOpen: boolean
  selectedMealForEdit: { dayId: string; mealId: string } | null
  
  // Actions
  setOnboardingStep: (step: number) => void
  completeOnboarding: (profile: UserProfile) => void
  setCurrentTab: (tab: 'itinerary' | 'stats' | 'workouts') => void
  setSelectedDay: (date: string) => void
  setExpandedWorkout: (workoutId: string | null) => void
  updateMeal: (dayId: string, meal: Meal) => void
  openMealModal: (dayId: string, mealId: string) => void
  closeMealModal: () => void
  generateTripData: (profile: UserProfile) => void
  resetApp: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
  // Initial state
  onboardingStep: 0,
  isOnboardingComplete: false,
  userProfile: null,
  currentTab: 'itinerary',
  selectedDay: '',
  tripData: [],
  expandedWorkout: null,
  isMealModalOpen: false,
  selectedMealForEdit: null,
  
  // Actions
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  
  completeOnboarding: (profile) => {
    set({ 
      isOnboardingComplete: true, 
      userProfile: profile,
      selectedDay: profile.startDate
    })
    get().generateTripData(profile)
  },
  
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setSelectedDay: (date) => set({ selectedDay: date }),
  setExpandedWorkout: (workoutId) => set({ expandedWorkout: workoutId }),
  
  updateMeal: (dayId, meal) => set((state) => ({
    tripData: state.tripData.map(day => 
      day.date === dayId 
        ? { 
            ...day, 
            meals: day.meals.map(m => m.id === meal.id ? meal : m),
            totalCalories: day.meals.reduce((sum, m) => sum + (m.id === meal.id ? meal.calories : m.calories), 0),
            totalProtein: day.meals.reduce((sum, m) => sum + (m.id === meal.id ? meal.protein : m.protein), 0)
          }
        : day
    )
  })),
  
  openMealModal: (dayId, mealId) => set({ 
    isMealModalOpen: true, 
    selectedMealForEdit: { dayId, mealId } 
  }),
  
  closeMealModal: () => set({ 
    isMealModalOpen: false, 
    selectedMealForEdit: null 
  }),
  
  generateTripData: (profile) => {
    const days = getDaysBetween(profile.startDate, profile.endDate)
    const tripData: DayData[] = days.map((date) => ({
      date,
      weather: generateWeatherData(),
      workout: generateWorkoutData(),
      meals: generateMealsData(profile.destination),
      totalCalories: 0,
      totalProtein: 0
    }))
    
    // Calculate totals
    tripData.forEach(day => {
      day.totalCalories = day.meals.reduce((sum, meal) => sum + meal.calories, 0)
      day.totalProtein = day.meals.reduce((sum, meal) => sum + meal.protein, 0)
    })
    
    set({ tripData })
  },
  
  resetApp: () => set({
    onboardingStep: 0,
    isOnboardingComplete: false,
    userProfile: null,
    currentTab: 'itinerary',
    selectedDay: '',
    tripData: [],
    expandedWorkout: null,
    isMealModalOpen: false,
    selectedMealForEdit: null,
  })
}),
    {
      name: 'fit-and-fly-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isOnboardingComplete: state.isOnboardingComplete,
        userProfile: state.userProfile,
        tripData: state.tripData,
        selectedDay: state.selectedDay,
      }),
    }
  )
)

// Helper functions
function getDaysBetween(startDate: string, endDate: string): string[] {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days: string[] = []
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    days.push(date.toISOString().split('T')[0])
  }
  
  return days
}

function generateWeatherData(): Weather {
  const conditions: Weather['condition'][] = ['sunny', 'cloudy', 'partly-cloudy', 'rainy']
  const condition = conditions[Math.floor(Math.random() * conditions.length)]
  
  return {
    temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
    condition,
    icon: condition
  }
}

function generateWorkoutData(): Workout {
  const workouts: Record<string, Workout> = {
    'bodyweight-strength': {
      id: 'bodyweight-1',
      name: 'Bodyweight Strength',
      duration: 30,
      type: 'Strength',
      equipment: ['bodyweight'],
      exercises: [
        { id: '1', name: 'Push-ups', sets: 3, reps: '10-15', instructions: 'Keep body straight, lower chest to floor' },
        { id: '2', name: 'Squats', sets: 3, reps: '15-20', instructions: 'Feet shoulder-width apart, lower until thighs parallel' },
        { id: '3', name: 'Lunges', sets: 3, reps: '10 each leg', instructions: 'Step forward, lower back knee toward ground' },
        { id: '4', name: 'Plank', sets: 3, reps: '30-60 sec', instructions: 'Hold straight line from head to heels' }
      ]
    },
    'cardio-hiit': {
      id: 'cardio-1',
      name: 'HIIT Cardio',
      duration: 25,
      type: 'Cardio',
      equipment: ['bodyweight'],
      exercises: [
        { id: '1', name: 'Jumping Jacks', sets: 4, reps: '30 sec', instructions: 'Jump feet apart while raising arms overhead' },
        { id: '2', name: 'Mountain Climbers', sets: 4, reps: '30 sec', instructions: 'Plank position, alternate bringing knees to chest' },
        { id: '3', name: 'Burpees', sets: 4, reps: '10', instructions: 'Squat, jump back to plank, jump feet forward, jump up' },
        { id: '4', name: 'High Knees', sets: 4, reps: '30 sec', instructions: 'Run in place, bring knees up to waist level' }
      ]
    }
  }
  
  const workoutKeys = Object.keys(workouts)
  const randomWorkout = workouts[workoutKeys[Math.floor(Math.random() * workoutKeys.length)]]
  
  return {
    ...randomWorkout,
    id: `workout-${Date.now()}-${Math.random()}`
  }
}

function generateMealsData(destination?: string): Meal[] {
  // Determine region from destination
  const region = destination ? getRegionFromDestination(destination) : 'International'
  const regionalCuisine = getRegionalMeals(region)
  
  // If no regional cuisine found, use default international
  const mealOptions = regionalCuisine ? {
    breakfast: regionalCuisine.breakfast,
    lunch: regionalCuisine.lunch,
    dinner: regionalCuisine.dinner
  } : {
    breakfast: [
      { name: 'Overnight Oats with Berries', calories: 320, protein: 12 },
      { name: 'Greek Yogurt Parfait', calories: 280, protein: 20 },
      { name: 'Avocado Toast', calories: 350, protein: 8 }
    ],
    lunch: [
      { name: 'Grilled Chicken Salad', calories: 450, protein: 35 },
      { name: 'Quinoa Buddha Bowl', calories: 520, protein: 18 },
      { name: 'Turkey Wrap', calories: 380, protein: 25 }
    ],
    dinner: [
      { name: 'Salmon with Vegetables', calories: 480, protein: 40 },
      { name: 'Lean Beef Stir-fry', calories: 420, protein: 32 },
      { name: 'Chicken Breast with Sweet Potato', calories: 460, protein: 38 }
    ]
  }
  
  return [
    {
      id: `breakfast-${Date.now()}`,
      type: 'breakfast' as const,
      ...mealOptions.breakfast[Math.floor(Math.random() * mealOptions.breakfast.length)]
    },
    {
      id: `lunch-${Date.now()}`,
      type: 'lunch' as const,
      ...mealOptions.lunch[Math.floor(Math.random() * mealOptions.lunch.length)]
    },
    {
      id: `dinner-${Date.now()}`,
      type: 'dinner' as const,
      ...mealOptions.dinner[Math.floor(Math.random() * mealOptions.dinner.length)]
    }
  ]
}