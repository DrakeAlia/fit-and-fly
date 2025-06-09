import { z } from 'zod'

// Enums for better type safety
export const EquipmentSchema = z.enum(['bodyweight', 'dumbbells', 'resistance-bands', 'hotel-gym'])
export const FitnessGoalSchema = z.enum(['maintain', 'lose-weight', 'build-muscle', 'endurance'])
export const MealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'snack'])
export const WeatherConditionSchema = z.enum(['sunny', 'cloudy', 'partly-cloudy', 'rainy'])

// Base schemas
export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().min(1, 'Must have at least 1 set'),
  reps: z.string().min(1, 'Reps information is required'),
  instructions: z.string().min(1, 'Instructions are required'),
})

export const MealSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Meal name is required'),
  calories: z.number().min(0, 'Calories cannot be negative'),
  protein: z.number().min(0, 'Protein cannot be negative'),
  type: MealTypeSchema,
})

export const WorkoutSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Workout name is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  type: z.string().min(1, 'Workout type is required'),
  exercises: z.array(ExerciseSchema).min(1, 'Must have at least one exercise'),
  equipment: z.array(EquipmentSchema),
})

export const WeatherSchema = z.object({
  temperature: z.number(),
  condition: WeatherConditionSchema,
  icon: z.string(),
})

export const DayDataSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  weather: WeatherSchema,
  workout: WorkoutSchema,
  meals: z.array(MealSchema),
  totalCalories: z.number().min(0),
  totalProtein: z.number().min(0),
})

// Onboarding form schema
export const OnboardingFormSchema = z.object({
  destination: z.string()
    .min(1, 'Please select a destination'),
  startDate: z.string().refine((date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate >= today
  }, 'Start date cannot be in the past'),
  endDate: z.string(),
  fitnessGoals: z.array(FitnessGoalSchema).min(1, 'Please select at least one fitness goal'),
  availableEquipment: z.array(EquipmentSchema).min(1, 'Please select at least one equipment option'),
}).refine((data) => {
  const startDate = new Date(data.startDate)
  const endDate = new Date(data.endDate)
  return endDate >= startDate
}, {
  message: 'End date must be after start date',
  path: ['endDate']
})

export const UserProfileSchema = z.object({
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  fitnessGoals: z.array(FitnessGoalSchema),
  availableEquipment: z.array(EquipmentSchema),
  calorieGoal: z.number().min(1000).max(5000),
  proteinGoal: z.number().min(50).max(300),
})

// API response schemas
export const MealSuggestionSchema = z.object({
  suggestions: z.array(MealSchema),
  reasoning: z.string().optional(),
})

export const WorkoutPlanSchema = z.object({
  workouts: z.array(WorkoutSchema),
  schedule: z.record(z.string(), z.string()), // date -> workout id mapping
})

// Exercise progress tracking
export const ExerciseProgressSchema = z.object({
  exerciseId: z.string(),
  setNumber: z.number(),
  repsCompleted: z.number(),
  weight: z.number().optional(),
  restTime: z.number().optional(), // seconds
  completed: z.boolean(),
  timestamp: z.string().optional(),
})

// Workout session tracking
export const WorkoutSessionSchema = z.object({
  id: z.string(),
  workoutId: z.string(),
  date: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  totalDuration: z.number().optional(), // minutes
  exerciseProgress: z.array(ExerciseProgressSchema),
  completed: z.boolean(),
  notes: z.string().optional(),
})

// Daily habits tracking
export const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
})

export const DailyHabitsSchema = z.object({
  date: z.string(),
  habits: z.record(z.string(), z.boolean()), // habitId -> completed
})

// Export types from schemas
export type Equipment = z.infer<typeof EquipmentSchema>
export type FitnessGoal = z.infer<typeof FitnessGoalSchema>
export type MealType = z.infer<typeof MealTypeSchema>
export type WeatherCondition = z.infer<typeof WeatherConditionSchema>
export type Exercise = z.infer<typeof ExerciseSchema>
export type Meal = z.infer<typeof MealSchema>
export type Workout = z.infer<typeof WorkoutSchema>
export type Weather = z.infer<typeof WeatherSchema>
export type DayData = z.infer<typeof DayDataSchema>
export type OnboardingFormData = z.infer<typeof OnboardingFormSchema>
export type UserProfile = z.infer<typeof UserProfileSchema>
export type MealSuggestionResponse = z.infer<typeof MealSuggestionSchema>
export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>
export type ExerciseProgress = z.infer<typeof ExerciseProgressSchema>
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>
export type Habit = z.infer<typeof HabitSchema>
export type DailyHabits = z.infer<typeof DailyHabitsSchema>