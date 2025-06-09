'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { OnboardingFormData, OnboardingFormSchema, EquipmentSchema, FitnessGoalSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import CitySelector from '@/components/ui/city-selector'
import { MapPin, Calendar, Target, Dumbbell, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'

const OnboardingForm = () => {
  const { onboardingStep, setOnboardingStep, completeOnboarding } = useAppStore()
  
  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: {
      destination: '',
      startDate: '',
      endDate: '',
      fitnessGoals: [],
      availableEquipment: [],
    },
    mode: 'onChange'
  })

  const { watch, setValue, getValues, trigger } = form
  const currentValues = watch()

  const handleNext = async () => {
    let fieldsToValidate: (keyof OnboardingFormData)[] = []
    
    // Validate fields based on current step
    switch (onboardingStep) {
      case 0:
        fieldsToValidate = ['destination']
        break
      case 1:
        fieldsToValidate = ['startDate', 'endDate']
        break
      case 2:
        fieldsToValidate = ['fitnessGoals']
        break
      case 3:
        fieldsToValidate = ['availableEquipment']
        break
    }
    
    const isValid = await trigger(fieldsToValidate)
    if (!isValid) return
    
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1)
    }
  }

  const handleSubmit = () => {
    const formData = getValues()
    
    // Calculate basic nutrition goals (simple formula)
    const calorieGoal = 2000 // Default daily calories
    const proteinGoal = Math.round(calorieGoal * 0.25 / 4) // 25% of calories from protein
    
    const profile = {
      ...formData,
      calorieGoal,
      proteinGoal,
    }
    
    completeOnboarding(profile)
  }

  const toggleArrayValue = (
    fieldName: 'fitnessGoals' | 'availableEquipment',
    value: string
  ) => {
    const currentArray = currentValues[fieldName] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    setValue(fieldName, newArray as any, { shouldValidate: true }) // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  const renderStep = () => {
    switch (onboardingStep) {
      case 0:
        return (
          <motion.div 
            key="step-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 sm:space-y-10"
          >
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <MapPin className="mx-auto h-12 w-12 text-blue-500" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold">Where are you traveling?</h2>
              <p className="text-gray-600">Search and select your destination city for personalized recommendations</p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <CitySelector
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Search for your destination city..."
                          className="w-full"
                          error={fieldState.error?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-sm text-gray-500 text-center">
                Type to search or browse popular destinations in the dropdown
              </p>
            </motion.div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div 
            key="step-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 sm:space-y-10"
          >
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Calendar className="mx-auto h-12 w-12 text-green-500" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold">When is your trip?</h2>
              <p className="text-gray-600">Choose your travel dates to plan your fitness routine</p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Form {...form}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="text-base p-3 h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="text-base p-3 h-12"
                            min={currentValues.startDate}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </motion.div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div 
            key="step-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 sm:space-y-10"
          >
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Target className="mx-auto h-12 w-12 text-purple-500" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold">What are your fitness goals?</h2>
              <p className="text-gray-600">Select all that apply to personalize your workouts</p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 gap-3">
                {FitnessGoalSchema.options.map((goal) => (
                  <motion.div
                    key={goal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Badge
                      variant={currentValues.fitnessGoals.includes(goal) ? "default" : "outline"}
                      className={`w-full p-3 h-auto text-center cursor-pointer justify-center capitalize transition-all duration-200 ${
                        currentValues.fitnessGoals.includes(goal)
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleArrayValue('fitnessGoals', goal)}
                    >
                      {goal.replace('-', ' ')}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div 
            key="step-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 sm:space-y-10"
          >
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Dumbbell className="mx-auto h-12 w-12 text-orange-500" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold">What equipment do you have?</h2>
              <p className="text-gray-600">Select available equipment to customize your workouts</p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 gap-3">
                {EquipmentSchema.options.map((equipment) => (
                  <motion.div
                    key={equipment}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Badge
                      variant={currentValues.availableEquipment.includes(equipment) ? "default" : "outline"}
                      className={`w-full p-3 h-auto text-center cursor-pointer justify-center capitalize transition-all duration-200 ${
                        currentValues.availableEquipment.includes(equipment)
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleArrayValue('availableEquipment', equipment)}
                    >
                      {equipment === 'bodyweight' ? 'Bodyweight Only' : equipment.replace('-', ' ')}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl"
      >
        <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0 overflow-hidden w-full max-w-2xl sm:max-w-4xl lg:max-w-5xl">
          <CardHeader className="text-center pb-4 px-6 sm:px-8 lg:px-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <Sparkles className="h-8 w-8 text-purple-600" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fit & Fly
              </h1>
            </motion.div>
            
            {/* Progress indicator */}
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex space-x-2">
                {[0, 1, 2, 3].map((step) => (
                  <motion.div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step <= onboardingStep
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                        : 'bg-gray-200'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + step * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          </CardHeader>
          
          <CardContent className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
            
            <motion.div 
              className="flex justify-between pt-6 mt-6 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={onboardingStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {onboardingStep === 3 ? 'Complete Setup' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default OnboardingForm