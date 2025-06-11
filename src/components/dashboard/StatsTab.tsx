'use client'

import React, { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Target, Zap } from 'lucide-react'

interface CircularProgressProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  label: string
  unit: string
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  size = 100,
  strokeWidth = 8,
  color = '#3b82f6',
  label,
  unit
}) => {
  const [animatedValue, setAnimatedValue] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = Math.min((value / max) * 100, 100)
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out'
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg sm:text-xl font-bold" style={{ color }}>
            {Math.round(value)}
          </span>
          <span className="text-xs text-gray-500">/ {max}{unit}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
    </div>
  )
}

const StatsTab = () => {
  const { tripData, selectedDay, userProfile } = useAppStore()

  if (!tripData.length || !userProfile) return <div>Loading...</div>

  const selectedDayData = tripData.find(day => day.date === selectedDay) || tripData[0]
  
  // Calculate trip averages
  const tripAverages = {
    calories: Math.round(tripData.reduce((sum, day) => sum + day.totalCalories, 0) / tripData.length),
    protein: Math.round(tripData.reduce((sum, day) => sum + day.totalProtein, 0) / tripData.length),
    workouts: tripData.length
  }

  // Calculate progress percentages
  const calorieProgress = (selectedDayData.totalCalories / userProfile.calorieGoal) * 100
  const proteinProgress = (selectedDayData.totalProtein / userProfile.proteinGoal) * 100

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Today&apos;s Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4">
            <CircularProgress
              value={selectedDayData.totalCalories}
              max={userProfile.calorieGoal}
              size={90}
              color="#f59e0b"
              label="Calories"
              unit=""
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Protein Intake</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4">
            <CircularProgress
              value={selectedDayData.totalProtein}
              max={userProfile.proteinGoal}
              size={90}
              color="#10b981"
              label="Protein"
              unit="g"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Workout Completion</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4">
            <CircularProgress
              value={100}
              max={100}
              size={90}
              color="#8b5cf6"
              label="Workout"
              unit="%"
            />
          </CardContent>
        </Card>
      </div>

      {/* Trip Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Trip Averages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Calories</span>
                <span className="font-semibold">{tripAverages.calories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Protein</span>
                <span className="font-semibold">{tripAverages.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Workouts Planned</span>
                <span className="font-semibold">{tripAverages.workouts}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Calorie Goal</span>
                  <span className="text-sm font-medium">
                    {Math.round(calorieProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Protein Goal</span>
                  <span className="text-sm font-medium">
                    {Math.round(proteinProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              Fitness Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userProfile.fitnessGoals.map((goal) => (
                <div
                  key={goal}
                  className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium capitalize"
                >
                  {goal.replace('-', ' ')}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {tripData.slice(0, 7).map((day) => {
              const dayCalorieProgress = (day.totalCalories / userProfile.calorieGoal) * 100
              const dayProteinProgress = (day.totalProtein / userProfile.proteinGoal) * 100
              
              return (
                <div key={day.date} className="text-center">
                  <div className="text-xs text-gray-600 mb-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(dayCalorieProgress, 100)}%` }}
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(dayProteinProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {day.totalCalories}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-amber-500 rounded"></div>
              <span>Calories</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-green-500 rounded"></div>
              <span>Protein</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsTab