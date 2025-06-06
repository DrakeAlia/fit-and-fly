'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { OnboardingFormData, OnboardingFormSchema, Equipment, FitnessGoal } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
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
    
    if (isValid) {
      if (onboardingStep < 3) {
        setOnboardingStep(onboardingStep + 1)
      } else {
        // Complete onboarding
        const formData = getValues()
        completeOnboarding({
          ...formData,
          calorieGoal: 2000,
          proteinGoal: 150
        })
      }
    }
  }

  const handleBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1)
    }
  }

  const toggleGoal = (goal: FitnessGoal) => {
    const currentGoals = currentValues.fitnessGoals || []
    const newGoals = currentGoals.includes(goal) 
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal]
    setValue('fitnessGoals', newGoals, { shouldValidate: true })
  }

  const toggleEquipment = (eq: Equipment) => {
    const currentEquipment = currentValues.availableEquipment || []
    const newEquipment = currentEquipment.includes(eq) 
      ? currentEquipment.filter(e => e !== eq)
      : [...currentEquipment, eq]
    setValue('availableEquipment', newEquipment, { shouldValidate: true })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
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
            className="space-y-6"
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
              <p className="text-gray-600">Enter your destination as &quot;City, Country&quot; for personalized recommendations</p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Paris, France"
                          className="text-base sm:text-lg p-3 h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
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
            className="space-y-6"
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
              <p className="text-gray-600">Set your travel dates to plan your fitness routine</p>
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
                          <Input type="date" {...field} />
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
            className="space-y-6"
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
              <p className="text-gray-600">Select all that apply to customize your workouts</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'maintain', label: 'Maintain Fitness', desc: 'Stay in shape', color: 'blue' },
                { id: 'lose-weight', label: 'Lose Weight', desc: 'Burn calories', color: 'red' },
                { id: 'build-muscle', label: 'Build Muscle', desc: 'Gain strength', color: 'green' },
                { id: 'endurance', label: 'Improve Endurance', desc: 'Boost stamina', color: 'purple' }
              ].map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: currentValues.fitnessGoals?.includes(goal.id as FitnessGoal) ? 1.02 : 1,
                    borderColor: currentValues.fitnessGoals?.includes(goal.id as FitnessGoal) ? "rgb(147, 51, 234)" : "rgb(229, 231, 235)"
                  }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className={`p-4 sm:p-4 min-h-[80px] sm:min-h-[auto] border-2 rounded-lg cursor-pointer transition-all ${
                    currentValues.fitnessGoals?.includes(goal.id as FitnessGoal)
                      ? `border-purple-500 bg-purple-50`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => toggleGoal(goal.id as FitnessGoal)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold">{goal.label}</div>
                  <div className="text-sm text-gray-600">{goal.desc}</div>
                  {currentValues.fitnessGoals?.includes(goal.id as FitnessGoal) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <Badge variant="default" className="text-xs">Selected</Badge>
                    </motion.div>
                  )}
                </motion.div>
              ))}
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
            className="space-y-6"
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
              <p className="text-gray-600">Select available equipment for personalized workouts</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'bodyweight', label: 'Bodyweight Only', desc: 'No equipment needed', icon: '🏃' },
                { id: 'dumbbells', label: 'Dumbbells', desc: 'Free weights', icon: '🏋️' },
                { id: 'resistance-bands', label: 'Resistance Bands', desc: 'Portable bands', icon: '🎗️' },
                { id: 'hotel-gym', label: 'Hotel Gym', desc: 'Full gym access', icon: '🏨' }
              ].map((eq, index) => (
                <motion.div
                  key={eq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: currentValues.availableEquipment?.includes(eq.id as Equipment) ? 1.02 : 1,
                    borderColor: currentValues.availableEquipment?.includes(eq.id as Equipment) ? "rgb(249, 115, 22)" : "rgb(229, 231, 235)"
                  }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className={`p-4 sm:p-4 min-h-[80px] sm:min-h-[auto] border-2 rounded-lg cursor-pointer transition-all ${
                    currentValues.availableEquipment?.includes(eq.id as Equipment)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => toggleEquipment(eq.id as Equipment)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{eq.icon}</span>
                    <div className="font-semibold">{eq.label}</div>
                  </div>
                  <div className="text-sm text-gray-600">{eq.desc}</div>
                  {currentValues.availableEquipment?.includes(eq.id as Equipment) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <Badge variant="default" className="text-xs">Selected</Badge>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md sm:max-w-lg"
      >
        <Card className="w-full shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <motion.div 
              className="flex justify-between items-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-gradient" />
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Fit & Fly
                </div>
              </motion.div>
              <div className="text-xs sm:text-sm text-gray-500">
                Step {onboardingStep + 1} of 4
              </div>
            </motion.div>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
            >
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((onboardingStep + 1) / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="order-2 sm:order-1">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={onboardingStep === 0}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto h-12"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="order-1 sm:order-2">
                <Button
                  onClick={handleNext}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto h-12"
                >
                  {onboardingStep === 3 ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default OnboardingForm