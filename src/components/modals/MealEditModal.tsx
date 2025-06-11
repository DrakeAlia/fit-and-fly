'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { getRegionFromDestination, getRegionalMeals } from '@/lib/regionalCuisine'
import type { Meal } from '@/lib/schemas'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles, ChefHat, Zap, TrendingUp, TrendingDown, MapPin } from 'lucide-react'

const MealEditModal = () => {
  const {
    isMealModalOpen,
    selectedMealForEdit,
    tripData,
    userProfile,
    closeMealModal,
    updateMeal
  } = useAppStore()

  const [aiSuggestions, setAiSuggestions] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const currentMeal = selectedMealForEdit
    ? tripData
        .find(day => day.date === selectedMealForEdit.dayId)
        ?.meals.find(meal => meal.id === selectedMealForEdit.mealId)
    : null

  useEffect(() => {
    if (isMealModalOpen && currentMeal) {
      generateAISuggestions(currentMeal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMealModalOpen, currentMeal])

  const generateAISuggestions = async (meal: Meal) => {
    setIsLoading(true)
    
    // Simulate AI suggestions (in real app, this would call an AI service)
    const suggestions = generateMealSuggestions(meal)
    
    // Simulate loading delay
    setTimeout(() => {
      setAiSuggestions(suggestions)
      setIsLoading(false)
    }, 1500)
  }

  const generateMealSuggestions = (currentMeal: Meal): Meal[] => {
    // Get regional cuisine based on user's destination
    const destination = userProfile?.destination || ''
    const region = getRegionFromDestination(destination)
    const regionalCuisine = getRegionalMeals(region)
    
    // Use regional cuisine if available, fallback to international
    const suggestionsByType = regionalCuisine ? {
      breakfast: regionalCuisine.breakfast,
      lunch: regionalCuisine.lunch,
      dinner: regionalCuisine.dinner,
      snack: regionalCuisine.snacks
    } : {
      breakfast: [
        { name: 'Protein Smoothie Bowl', calories: 340, protein: 25 },
        { name: 'Egg White Scramble', calories: 180, protein: 20 },
        { name: 'Greek Yogurt with Granola', calories: 310, protein: 18 },
        { name: 'Oatmeal with Protein Powder', calories: 290, protein: 22 },
        { name: 'Avocado Toast with Egg', calories: 380, protein: 16 }
      ],
      lunch: [
        { name: 'Quinoa Power Bowl', calories: 480, protein: 20 },
        { name: 'Grilled Chicken Caesar', calories: 420, protein: 32 },
        { name: 'Salmon Poke Bowl', calories: 510, protein: 28 },
        { name: 'Turkey and Hummus Wrap', calories: 390, protein: 24 },
        { name: 'Lentil Buddha Bowl', calories: 450, protein: 18 }
      ],
      dinner: [
        { name: 'Herb-Crusted Salmon', calories: 460, protein: 38 },
        { name: 'Grilled Chicken with Quinoa', calories: 440, protein: 35 },
        { name: 'Lean Beef Stir-Fry', calories: 420, protein: 32 },
        { name: 'Baked Cod with Vegetables', calories: 350, protein: 30 },
        { name: 'Turkey Meatballs with Zoodles', calories: 380, protein: 28 }
      ],
      snack: [
        { name: 'Protein Bar', calories: 180, protein: 15 },
        { name: 'Greek Yogurt', calories: 120, protein: 12 },
        { name: 'Trail Mix', calories: 200, protein: 8 },
        { name: 'Apple with Almond Butter', calories: 190, protein: 6 }
      ]
    }

    const options = suggestionsByType[currentMeal.type] || suggestionsByType.snack
    const shuffled = [...options].sort(() => Math.random() - 0.5)
    
    return shuffled.slice(0, 3).map((option, index) => ({
      id: `suggestion-${Date.now()}-${index}`,
      type: currentMeal.type,
      ...option
    }))
  }

  const handleMealSwap = (newMeal: Meal) => {
    if (selectedMealForEdit) {
      updateMeal(selectedMealForEdit.dayId, {
        ...newMeal,
        id: selectedMealForEdit.mealId
      })
      closeMealModal()
    }
  }

  if (!isMealModalOpen || !currentMeal) return null

  return (
    <Dialog open={isMealModalOpen} onOpenChange={(open) => !open && closeMealModal()}>
      <DialogContent onClose={closeMealModal} className="max-w-2xl max-h-[85vh] overflow-y-auto w-[98vw] sm:w-[95vw] md:w-full p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-500" />
            Swap Your {currentMeal.type.charAt(0).toUpperCase() + currentMeal.type.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Current Meal */}
          <div>
            <h3 className="font-semibold mb-3">Current Selection</h3>
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{currentMeal.name}</h4>
                    <div className="text-sm text-gray-600 mt-1">
                      {currentMeal.calories} calories • {currentMeal.protein}g protein
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Current
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </motion.div>
                AI-Powered Suggestions
              </h3>
              {userProfile?.destination && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-1 text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  <MapPin className="h-3 w-3" />
                  {getRegionFromDestination(userProfile.destination)} Cuisine
                </motion.div>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <motion.div 
                    className="text-center text-sm text-gray-600 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="inline-flex items-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      Generating personalized suggestions...
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="hover:shadow-lg transition-all cursor-pointer hover:border-green-300 group"
                        onClick={() => handleMealSwap(suggestion)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 group-hover:text-green-700 transition-colors">
                                {suggestion.name}
                              </h4>
                              <div className="text-sm text-gray-600 mt-1">
                                {suggestion.calories} calories • {suggestion.protein}g protein
                              </div>
                              <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                                {suggestion.calories !== currentMeal.calories && (
                                  <Badge 
                                    variant="secondary"
                                    className={`text-xs flex items-center gap-1 ${
                                      suggestion.calories > currentMeal.calories 
                                        ? 'bg-orange-100 text-orange-800' 
                                        : 'bg-green-100 text-green-800'
                                    }`}
                                  >
                                    {suggestion.calories > currentMeal.calories ? (
                                      <TrendingUp className="h-3 w-3" />
                                    ) : (
                                      <TrendingDown className="h-3 w-3" />
                                    )}
                                    {Math.abs(suggestion.calories - currentMeal.calories)} cal
                                  </Badge>
                                )}
                                
                                {suggestion.protein !== currentMeal.protein && (
                                  <Badge 
                                    variant="secondary"
                                    className={`text-xs flex items-center gap-1 ${
                                      suggestion.protein > currentMeal.protein 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {suggestion.protein > currentMeal.protein ? (
                                      <TrendingUp className="h-3 w-3" />
                                    ) : (
                                      <TrendingDown className="h-3 w-3" />
                                    )}
                                    {Math.abs(suggestion.protein - currentMeal.protein)}g protein
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                              >
                                Select
                              </Button>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={closeMealModal} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => generateAISuggestions(currentMeal)}
              className="flex-1"
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isLoading ? 'Generating...' : 'Get New Suggestions'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MealEditModal