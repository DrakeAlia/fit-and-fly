'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, Target, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HabitsTrackerProps {
  date: string
  className?: string
}

const HabitsTracker: React.FC<HabitsTrackerProps> = ({ date, className }) => {
  const { defaultHabits, dailyHabits, toggleHabit } = useAppStore()
  
  const dayHabits = dailyHabits.find(d => d.date === date)
  const completedCount = defaultHabits.filter(habit => 
    dayHabits?.habits[habit.id] === true
  ).length
  const completionPercentage = defaultHabits.length > 0 ? (completedCount / defaultHabits.length) * 100 : 0

  const handleToggleHabit = (habitId: string) => {
    toggleHabit(date, habitId)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Daily Habits
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
              {completedCount}/{defaultHabits.length}
            </Badge>
            {completionPercentage === 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Complete!
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
        
        {defaultHabits.length > 0 && (
          <div className="text-sm text-gray-600">
            {Math.round(completionPercentage)}% completed today
          </div>
        )}
      </CardHeader>

      <CardContent>
        {defaultHabits.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No habits set up yet.</p>
            <p className="text-sm">Habits will be available after onboarding.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {defaultHabits.map((habit) => {
              const isCompleted = dayHabits?.habits[habit.id] === true
              
              return (
                <motion.div
                  key={habit.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => handleToggleHabit(habit.id)}
                    className={cn(
                      "w-full h-auto p-3 sm:p-4 justify-start text-left transition-all duration-200",
                      isCompleted 
                        ? "bg-green-50 border-green-200 border" 
                        : "bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                          {habit.icon && (
                            <span className="text-base sm:text-lg">{habit.icon}</span>
                          )}
                          <span className={cn(
                            "font-medium text-sm sm:text-base",
                            isCompleted ? "text-green-900" : "text-gray-900"
                          )}>
                            {habit.name}
                          </span>
                        </div>
                        
                        {habit.description && (
                          <div className={cn(
                            "text-xs sm:text-sm",
                            isCompleted ? "text-green-700" : "text-gray-600"
                          )}>
                            {habit.description}
                          </div>
                        )}
                      </div>
                      
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                          className="flex-shrink-0"
                        >
                          <Badge variant="default" className="bg-green-600">
                            ✓
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </Button>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Progress visualization */}
        {defaultHabits.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Today&apos;s Progress</span>
              <span className="text-sm text-gray-500">
                {completedCount} of {defaultHabits.length} habits
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default HabitsTracker