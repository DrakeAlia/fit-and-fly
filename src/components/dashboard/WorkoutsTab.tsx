'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import WorkoutSession from '@/components/workout/WorkoutSession'
import type { Exercise, Equipment, Workout } from '@/lib/schemas'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Clock, Zap, Play, Dumbbell, Calendar } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface WorkoutWithDates extends Workout {
  dates: string[]
}

const WorkoutsTab = () => {
  const { tripData, expandedWorkout, setExpandedWorkout, selectedDay, workoutSessions } = useAppStore()
  const [workoutSessionOpen, setWorkoutSessionOpen] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)

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
  }, [] as WorkoutWithDates[])

  const toggleWorkout = (workoutId: string) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId)
  }

  const formatDates = (dates: string[]) => {
    return dates.map(date => 
      new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ).join(', ')
  }

  const handleStartWorkout = (workout: Workout, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedWorkout(workout)
    setWorkoutSessionOpen(true)
  }

  const handleCloseWorkoutSession = () => {
    setWorkoutSessionOpen(false)
    setSelectedWorkout(null)
  }

  const getWorkoutHistory = (workoutId: string) => {
    return workoutSessions.filter(session => session.workoutId === workoutId)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-4 sm:mb-6 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your Workout Plan</h2>
        <p className="text-gray-600 text-sm sm:text-base">
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
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                    <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">{workout.name}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {workout.duration} min
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {workout.type}
                      </span>
                      <span className="text-xs hidden sm:inline">
                        Scheduled: {formatDates(workout.dates)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Button 
                    size="sm" 
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                    onClick={(e) => handleStartWorkout(workout, e)}
                  >
                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Start Workout</span>
                    <span className="sm:hidden">Start</span>
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
                      {workout.exercises.map((exercise: Exercise, index: number) => (
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
                      {workout.equipment.map((eq: Equipment) => (
                        <span
                          key={eq}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize"
                        >
                          {eq.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Workout History */}
                  {getWorkoutHistory(workout.id).length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Recent Sessions
                      </h4>
                      <div className="space-y-2">
                        {getWorkoutHistory(workout.id).slice(-3).map((session) => (
                          <div key={session.id} className="text-sm text-green-800 bg-green-100 p-2 rounded">
                            <div className="flex items-center justify-between">
                              <span>{new Date(session.date).toLocaleDateString()}</span>
                              <span>{session.totalDuration} minutes</span>
                            </div>
                            {session.completed && (
                              <span className="text-xs text-green-600">✓ Completed</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3 mt-4">
                    <Button 
                      className="flex-1" 
                      size="lg"
                      onClick={(e) => handleStartWorkout(workout, e)}
                    >
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

      {/* Workout Session Dialog */}
      <Dialog open={workoutSessionOpen} onOpenChange={setWorkoutSessionOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          {selectedWorkout && (
            <WorkoutSession
              workout={selectedWorkout}
              date={selectedDay}
              onClose={handleCloseWorkoutSession}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WorkoutsTab