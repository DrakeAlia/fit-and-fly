'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Cloud, Sun, CloudRain, Zap, Edit3, Clock, Utensils } from 'lucide-react'
import HabitsTracker from '@/components/habits/HabitsTracker'

const ItineraryTab = () => {
  const { tripData, selectedDay, setSelectedDay, openMealModal } = useAppStore()

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />
      case 'cloudy': return <Cloud className="h-5 w-5 text-gray-500" />
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-500" />
      default: return <Sun className="h-5 w-5 text-yellow-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const isPastDate = (dateString: string) => {
    const today = new Date()
    const date = new Date(dateString)
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    return date < today
  }

  if (!tripData.length) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-10 w-12 flex-shrink-0 rounded-md" />
          ))}
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-6" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Day selector */}
      <motion.div 
        className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide px-1 swipe-hint"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {tripData.map((day, index) => {
          const isPast = isPastDate(day.date)
          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={!isPast ? { scale: 1.05 } : undefined}
              whileTap={!isPast ? { scale: 0.95 } : undefined}
            >
              <Button
                variant={selectedDay === day.date ? "default" : "outline"}
                onClick={() => !isPast && setSelectedDay(day.date)}
                disabled={isPast}
                className={`flex-shrink-0 min-w-[2.5rem] sm:min-w-[3rem] h-8 sm:h-10 text-sm sm:text-base transition-all ${
                  isPast
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                    : selectedDay === day.date 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg" 
                      : "hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {new Date(day.date).getDate()}
              </Button>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Selected day details */}
      <AnimatePresence mode="wait">
        {tripData.filter(day => day.date === selectedDay).map((day) => (
          <motion.div 
            key={day.date} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Date header */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.h2 
                className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {formatDate(day.date)}
              </motion.h2>
              <motion.div 
                className="flex items-center justify-center gap-3 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {getWeatherIcon(day.weather.condition)}
                </motion.div>
                <span className="text-lg font-medium">{day.weather.temperature}°C</span>
                <Badge variant="secondary" className="capitalize">
                  {day.weather.condition}
                </Badge>
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, staggerChildren: 0.1 }}
            >
              {/* Workout card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Zap className="h-5 w-5 text-orange-500" />
                      </motion.div>
                      Today&apos;s Workout
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">{day.workout.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {day.workout.duration} min
                          </Badge>
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {day.workout.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {day.workout.exercises.slice(0, 3).map((exercise, index) => (
                          <motion.div 
                            key={exercise.id} 
                            className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <span className="text-sm font-medium">{index + 1}. {exercise.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {exercise.sets} × {exercise.reps}
                            </Badge>
                          </motion.div>
                        ))}
                        {day.workout.exercises.length > 3 && (
                          <motion.div 
                            className="text-sm text-gray-500 text-center py-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                          >
                            +{day.workout.exercises.length - 3} more exercises
                          </motion.div>
                        )}
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                          <Zap className="h-4 w-4 mr-2" />
                          Start Workout
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Meals card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Utensils className="h-5 w-5 text-green-500" />
                        </motion.div>
                        Today&apos;s Meals
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {day.totalCalories} cal
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {day.totalProtein}g protein
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {day.meals.map((meal, index) => (
                        <motion.div
                          key={meal.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="group flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200 cursor-pointer"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs capitalize ${
                                  meal.type === 'breakfast' ? 'bg-yellow-100 text-yellow-800' :
                                  meal.type === 'lunch' ? 'bg-green-100 text-green-800' :
                                  meal.type === 'dinner' ? 'bg-blue-100 text-blue-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {meal.type}
                              </Badge>
                              <h4 className="font-medium text-gray-800">{meal.name}</h4>
                            </div>
                            <div className="text-sm text-gray-600">
                              {meal.calories} cal • {meal.protein}g protein
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100"
                              onClick={() => openMealModal(day.date, meal.id)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Habits Tracker */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ y: -5 }}
                className="xl:col-span-1 md:col-span-2"
              >
                <HabitsTracker date={selectedDay} className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow" />
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default ItineraryTab