import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getRegionFromDestination, getRegionalMeals, type RegionalMealOption } from './regionalCuisine'
import type { 
  Meal, 
  Workout, 
  DayData, 
  UserProfile,
  Weather,
  WorkoutSession,
  DailyHabits,
  Habit
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
  workoutSessions: WorkoutSession[]
  currentWorkoutSession: WorkoutSession | null
  
  // Habits state
  dailyHabits: DailyHabits[]
  defaultHabits: Habit[]
  
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
  
  // Workout session actions
  startWorkoutSession: (workoutId: string, date: string) => void
  endWorkoutSession: () => void
  updateExerciseProgress: (exerciseId: string, setNumber: number, repsCompleted: number, weight?: number) => void
  
  // Habits actions
  toggleHabit: (date: string, habitId: string) => void
  initializeDefaultHabits: () => void
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
  workoutSessions: [],
  currentWorkoutSession: null,
  dailyHabits: [],
  defaultHabits: [],
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
    get().initializeDefaultHabits()
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
    const totalDays = days.length
    
    // Clear used meals and workouts for new trip generation
    usedMeals.clear()
    usedWorkouts.clear()
    
    const tripData: DayData[] = days.map((date, index) => ({
      date,
      weather: generateWeatherData(),
      workout: generateWorkoutData(totalDays, index),
      meals: generateMealsData(profile.destination, index, totalDays),
      totalCalories: 0,
      totalProtein: 0
    }))
    
    // Calculate totals
    tripData.forEach(day => {
      day.totalCalories = day.meals.reduce((sum, meal) => sum + meal.calories, 0)
      day.totalProtein = day.meals.reduce((sum, meal) => sum + meal.protein, 0)
    })
    
    // Set selected day to first available (non-past) date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const firstAvailableDay = days.find(date => {
      const dayDate = new Date(date)
      dayDate.setHours(0, 0, 0, 0)
      return dayDate >= today
    }) || days[0] // Fallback to first day if all are past
    
    set({ tripData, selectedDay: firstAvailableDay })
  },
  
  resetApp: () => set({
    onboardingStep: 0,
    isOnboardingComplete: false,
    userProfile: null,
    currentTab: 'itinerary',
    selectedDay: '',
    tripData: [],
    expandedWorkout: null,
    workoutSessions: [],
    currentWorkoutSession: null,
    dailyHabits: [],
    defaultHabits: [],
    isMealModalOpen: false,
    selectedMealForEdit: null,
  }),
  
  // Workout session actions
  startWorkoutSession: (workoutId, date) => {
    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      workoutId,
      date,
      startTime: new Date().toISOString(),
      exerciseProgress: [],
      completed: false
    }
    set({ currentWorkoutSession: session })
  },
  
  endWorkoutSession: () => {
    const { currentWorkoutSession } = get()
    if (currentWorkoutSession) {
      const completedSession = {
        ...currentWorkoutSession,
        endTime: new Date().toISOString(),
        totalDuration: currentWorkoutSession.startTime 
          ? Math.round((new Date().getTime() - new Date(currentWorkoutSession.startTime).getTime()) / 60000)
          : 0,
        completed: true
      }
      set(state => ({
        workoutSessions: [...state.workoutSessions, completedSession],
        currentWorkoutSession: null
      }))
    }
  },
  
  updateExerciseProgress: (exerciseId, setNumber, repsCompleted, weight) => {
    set(state => {
      if (!state.currentWorkoutSession) return state
      
      const existingProgressIndex = state.currentWorkoutSession.exerciseProgress.findIndex(
        p => p.exerciseId === exerciseId && p.setNumber === setNumber
      )
      
      const newProgress = {
        exerciseId,
        setNumber,
        repsCompleted,
        weight,
        completed: true,
        timestamp: new Date().toISOString()
      }
      
      const updatedProgress = [...state.currentWorkoutSession.exerciseProgress]
      if (existingProgressIndex >= 0) {
        updatedProgress[existingProgressIndex] = newProgress
      } else {
        updatedProgress.push(newProgress)
      }
      
      return {
        currentWorkoutSession: {
          ...state.currentWorkoutSession,
          exerciseProgress: updatedProgress
        }
      }
    })
  },
  
  // Habits actions
  toggleHabit: (date, habitId) => {
    set(state => {
      const existingDayIndex = state.dailyHabits.findIndex(d => d.date === date)
      
      if (existingDayIndex >= 0) {
        const updatedDailyHabits = [...state.dailyHabits]
        updatedDailyHabits[existingDayIndex] = {
          ...updatedDailyHabits[existingDayIndex],
          habits: {
            ...updatedDailyHabits[existingDayIndex].habits,
            [habitId]: !updatedDailyHabits[existingDayIndex].habits[habitId]
          }
        }
        return { dailyHabits: updatedDailyHabits }
      } else {
        const newDayHabits: DailyHabits = {
          date,
          habits: { [habitId]: true }
        }
        return { dailyHabits: [...state.dailyHabits, newDayHabits] }
      }
    })
  },
  
  initializeDefaultHabits: () => {
    const defaultHabits: Habit[] = [
      { id: 'water', name: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day', icon: '💧' },
      { id: 'sleep', name: 'Get 8 hours of sleep', description: 'Proper rest for recovery', icon: '😴' },
      { id: 'stretching', name: 'Do stretching/mobility', description: 'Keep your body flexible', icon: '🧘‍♀️' },
      { id: 'walk', name: 'Take a 10+ minute walk', description: 'Light movement for circulation', icon: '🚶‍♀️' },
      { id: 'meditation', name: 'Practice mindfulness', description: '5+ minutes of meditation', icon: '🧠' }
    ]
    set({ defaultHabits })
  }
}),
    {
      name: 'fit-and-fly-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isOnboardingComplete: state.isOnboardingComplete,
        userProfile: state.userProfile,
        tripData: state.tripData,
        selectedDay: state.selectedDay,
        workoutSessions: state.workoutSessions,
        dailyHabits: state.dailyHabits,
        defaultHabits: state.defaultHabits,
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

// Track used workouts to ensure variety
const usedWorkouts = new Set<string>()

function generateWorkoutData(totalDays?: number, dayIndex?: number): Workout {
  const workouts: Record<string, Workout> = {
    'bodyweight-strength-upper': {
      id: 'strength-upper',
      name: 'Upper Body Strength',
      duration: 30,
      type: 'Strength',
      equipment: ['bodyweight'],
      exercises: [
        { id: '1', name: 'Push-ups', sets: 3, reps: '10-15', instructions: 'Keep body straight, lower chest to floor' },
        { id: '2', name: 'Pike Push-ups', sets: 3, reps: '8-12', instructions: 'Form inverted V, lower head toward hands' },
        { id: '3', name: 'Tricep Dips', sets: 3, reps: '10-15', instructions: 'Use chair or edge, lower body down' },
        { id: '4', name: 'Superman', sets: 3, reps: '12-15', instructions: 'Lie prone, lift chest and legs simultaneously' }
      ]
    },
    'bodyweight-strength-lower': {
      id: 'strength-lower',
      name: 'Lower Body Strength',
      duration: 30,
      type: 'Strength',
      equipment: ['bodyweight'],
      exercises: [
        { id: '1', name: 'Squats', sets: 3, reps: '15-20', instructions: 'Feet shoulder-width apart, lower until thighs parallel' },
        { id: '2', name: 'Lunges', sets: 3, reps: '10 each leg', instructions: 'Step forward, lower back knee toward ground' },
        { id: '3', name: 'Single-leg Glute Bridges', sets: 3, reps: '10 each leg', instructions: 'Lie on back, lift one leg and bridge up' },
        { id: '4', name: 'Calf Raises', sets: 3, reps: '15-20', instructions: 'Rise up on toes, hold, then lower slowly' }
      ]
    },
    'bodyweight-strength-core': {
      id: 'strength-core',
      name: 'Core & Stability',
      duration: 25,
      type: 'Strength',
      equipment: ['bodyweight'],
      exercises: [
        { id: '1', name: 'Plank', sets: 3, reps: '30-60 sec', instructions: 'Hold straight line from head to heels' },
        { id: '2', name: 'Side Plank', sets: 3, reps: '20-30 sec each', instructions: 'Lie on side, prop up on elbow' },
        { id: '3', name: 'Dead Bug', sets: 3, reps: '10 each side', instructions: 'Lie on back, extend opposite arm and leg' },
        { id: '4', name: 'Bird Dog', sets: 3, reps: '10 each side', instructions: 'On hands and knees, extend opposite limbs' }
      ]
    },
    'cardio-hiit': {
      id: 'cardio-hiit',
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
    },
    'cardio-low-impact': {
      id: 'cardio-low',
      name: 'Low Impact Cardio',
      duration: 30,
      type: 'Cardio',
      equipment: ['bodyweight'],
      exercises: [
        { id: '1', name: 'Marching in Place', sets: 3, reps: '60 sec', instructions: 'Lift knees alternately, swing arms' },
        { id: '2', name: 'Step Touches', sets: 3, reps: '45 sec', instructions: 'Step side to side, tap opposite foot' },
        { id: '3', name: 'Arm Circles', sets: 3, reps: '30 sec each way', instructions: 'Large circles forward then backward' },
        { id: '4', name: 'Walking Lunges', sets: 3, reps: '10 each leg', instructions: 'Step forward into lunge, alternate legs' }
      ]
    },
    'yoga-mobility': {
      id: 'yoga-mobility',
      name: 'Yoga & Mobility',
      duration: 35,
      type: 'Flexibility',
      equipment: ['bodyweight'],
      exercises: [
        { id: '1', name: 'Sun Salutation', sets: 2, reps: '5 flows', instructions: 'Flow through yoga sequence smoothly' },
        { id: '2', name: 'Warrior III', sets: 2, reps: '30 sec each leg', instructions: 'Balance on one leg, extend other back' },
        { id: '3', name: 'Pigeon Pose', sets: 2, reps: '60 sec each leg', instructions: 'Hip opener, breathe deeply' },
        { id: '4', name: 'Child\'s Pose', sets: 1, reps: '90 sec', instructions: 'Rest position, focus on breathing' }
      ]
    },
    'full-body-circuit': {
      id: 'full-body-circuit',
      name: 'Full Body Circuit',
      duration: 35,
      type: 'Circuit',
      equipment: ['bodyweight'],
      exercises: [
        { id: '1', name: 'Squat to Press', sets: 3, reps: '12-15', instructions: 'Squat down, stand and press arms overhead' },
        { id: '2', name: 'Push-up to T', sets: 3, reps: '8-10', instructions: 'Push-up, rotate to side plank' },
        { id: '3', name: 'Reverse Lunge & Twist', sets: 3, reps: '10 each side', instructions: 'Lunge back, twist toward front leg' },
        { id: '4', name: 'Plank to Downward Dog', sets: 3, reps: '10-12', instructions: 'Flow between plank and downward dog' }
      ]
    }
  }
  
  // Create a structured workout plan based on trip duration
  const selectWorkoutByPattern = (totalDays: number, dayIndex: number): string => {
    // For longer trips (7+ days), create a structured pattern
    if (totalDays >= 7) {
      const dayInWeek = dayIndex % 7
      switch (dayInWeek) {
        case 0: return 'bodyweight-strength-upper'
        case 1: return 'cardio-low-impact'
        case 2: return 'bodyweight-strength-lower'
        case 3: return 'yoga-mobility'
        case 4: return 'bodyweight-strength-core'
        case 5: return 'cardio-hiit'
        case 6: return 'full-body-circuit'
        default: return 'bodyweight-strength-upper'
      }
    }
    
    // For medium trips (4-6 days), alternate between strength and cardio
    if (totalDays >= 4) {
      const workoutTypes = [
        'bodyweight-strength-upper',
        'cardio-hiit',
        'bodyweight-strength-lower',
        'yoga-mobility',
        'full-body-circuit',
        'cardio-low-impact'
      ]
      return workoutTypes[dayIndex % workoutTypes.length]
    }
    
    // For short trips (1-3 days), focus on variety
    const shortTripWorkouts = ['full-body-circuit', 'cardio-hiit', 'bodyweight-strength-upper']
    return shortTripWorkouts[dayIndex % shortTripWorkouts.length]
  }
  
  let selectedWorkoutKey: string
  
  if (totalDays && dayIndex !== undefined) {
    selectedWorkoutKey = selectWorkoutByPattern(totalDays, dayIndex)
  } else {
    // Fallback to random selection with uniqueness tracking
    const workoutKeys = Object.keys(workouts)
    let attempts = 0
    do {
      selectedWorkoutKey = workoutKeys[Math.floor(Math.random() * workoutKeys.length)]
      attempts++
    } while (usedWorkouts.has(selectedWorkoutKey) && attempts < 10)
    
    if (totalDays && totalDays > 3) {
      usedWorkouts.add(selectedWorkoutKey)
    }
  }
  
  const selectedWorkout = workouts[selectedWorkoutKey]
  
  return {
    ...selectedWorkout,
    id: `workout-${Date.now()}-${Math.random()}`
  }
}

// Track used meals to ensure variety across the trip
const usedMeals = new Set<string>()

function generateMealsData(destination?: string, dayIndex?: number, totalDays?: number): Meal[] {
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
    ]
  }
  
  // Helper function to select unique meal avoiding repetition
  const selectUniqueMeal = (options: RegionalMealOption[], mealType: string) => {
    let attempts = 0
    let selectedMeal
    let mealKey
    
    do {
      selectedMeal = options[Math.floor(Math.random() * options.length)]
      mealKey = `${mealType}-${selectedMeal.name}`
      attempts++
    } while (usedMeals.has(mealKey) && attempts < 10) // Prevent infinite loop
    
    // Only track if we have enough variety (more than 3 days)
    if (totalDays && totalDays > 3) {
      usedMeals.add(mealKey)
    }
    
    return selectedMeal
  }
  
  // For longer trips, prioritize variety and introduce local specialties
  // Additional logic for meal customization can be added here in the future
  
  return [
    {
      id: `breakfast-${Date.now()}-${Math.random()}`,
      type: 'breakfast' as const,
      ...selectUniqueMeal(mealOptions.breakfast, 'breakfast')
    },
    {
      id: `lunch-${Date.now()}-${Math.random()}`,
      type: 'lunch' as const,
      ...selectUniqueMeal(mealOptions.lunch, 'lunch')
    },
    {
      id: `dinner-${Date.now()}-${Math.random()}`,
      type: 'dinner' as const,
      ...selectUniqueMeal(mealOptions.dinner, 'dinner')
    }
  ]
}