'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Clock, Zap, Play, Dumbbell } from 'lucide-react'

const WorkoutsTab = () => {
  const { tripData, expandedWorkout, setExpandedWorkout } = useAppStore()

  if (!tripData.length) return <div>Loading...</div>

  const uniqueWorkouts = tripData.reduce((acc, day) => {
    const existingWorkout = acc.find(w => w.name === day.workout.name)
    if (!existingWorkout) {
      acc.push({
        ...day.workout,
        dates: [day.date]
      })
    } else {
      existingWorkout.dates.push(day.date)
    }
    return acc
  }, [] as any[])

  const toggleWorkout = (workoutId: string) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId)
  }

  const formatDates = (dates: string[]) => {
    return dates.map(date => 
      new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ).join(', ')
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Workout Plan</h2>
        <p className="text-gray-600">
          Customized workouts based on your goals and available equipment
        </p>
      </div>

      <div className="grid gap-4">
        {uniqueWorkouts.map((workout) => (
          <Card key={workout.id} className="hover:shadow-md transition-shadow">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleWorkout(workout.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Dumbbell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {workout.duration} min
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {workout.type}
                      </span>
                      <span className="text-xs">
                        Scheduled: {formatDates(workout.dates)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Workout
                  </Button>
                  {expandedWorkout === workout.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            {expandedWorkout === workout.id && (
              <CardContent className="pt-0">
                <div className="border-t pt-4">
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      Exercises ({workout.exercises.length})
                    </h4>
                    <div className="space-y-3">
                      {workout.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{exercise.name}</h5>
                                <div className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                                  {exercise.sets} sets × {exercise.reps}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{exercise.instructions}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Equipment Needed</h4>
                    <div className="flex flex-wrap gap-2">
                      {workout.equipment.map((eq) => (
                        <span
                          key={eq}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize"
                        >
                          {eq.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <Button className="flex-1" size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      Start This Workout
                    </Button>
                    <Button variant="outline" size="lg">
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Workout Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Workout Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Before You Start:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Warm up for 5-10 minutes</li>
                <li>• Stay hydrated throughout</li>
                <li>• Listen to your body</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Form Tips:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Focus on proper form over speed</li>
                <li>• Rest 30-60 seconds between sets</li>
                <li>• Cool down and stretch after</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkoutsTab