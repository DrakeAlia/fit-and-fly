'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Play, Square, Timer, CheckCircle, Plus, Minus, Dumbbell } from 'lucide-react'
import type { Workout } from '@/lib/schemas'

interface WorkoutSessionProps {
  workout: Workout
  date: string
  onClose: () => void
}

const WorkoutSession: React.FC<WorkoutSessionProps> = ({ workout, date, onClose }) => {
  const { 
    currentWorkoutSession, 
    startWorkoutSession, 
    endWorkoutSession, 
    updateExerciseProgress 
  } = useAppStore()

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [repsCompleted, setRepsCompleted] = useState(0)
  const [weight, setWeight] = useState(0)
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [sessionTimer, setSessionTimer] = useState(0)

  const currentExercise = workout.exercises[currentExerciseIndex]
  const totalSets = currentExercise?.sets || 0
  const exerciseProgress = currentWorkoutSession?.exerciseProgress.filter(p => p.exerciseId === currentExercise?.id) || []
  const completedSets = exerciseProgress.length
  const progressPercentage = (completedSets / totalSets) * 100

  // Session timer effect
  useEffect(() => {
    if (currentWorkoutSession && !isResting) {
      const interval = setInterval(() => {
        setSessionTimer(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [currentWorkoutSession, isResting])

  // Rest timer effect
  useEffect(() => {
    if (isResting && restTimer > 0) {
      const interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isResting, restTimer])

  const handleStartWorkout = () => {
    startWorkoutSession(workout.id, date)
    setSessionTimer(0)
  }

  const handleEndWorkout = () => {
    endWorkoutSession()
    onClose()
  }

  const handleCompleteSet = () => {
    if (currentExercise && repsCompleted > 0) {
      updateExerciseProgress(
        currentExercise.id,
        currentSet,
        repsCompleted,
        weight > 0 ? weight : undefined
      )
      
      if (currentSet < totalSets) {
        setCurrentSet(prev => prev + 1)
        setIsResting(true)
        setRestTimer(60) // 60 second rest by default
      } else {
        // Move to next exercise
        if (currentExerciseIndex < workout.exercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1)
          setCurrentSet(1)
        }
      }
      
      setRepsCompleted(0)
      setWeight(0)
    }
  }

  const handleSkipRest = () => {
    setIsResting(false)
    setRestTimer(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const allExercisesCompleted = workout.exercises.every(exercise => {
    const exerciseProgress = currentWorkoutSession?.exerciseProgress.filter(p => p.exerciseId === exercise.id) || []
    return exerciseProgress.length >= exercise.sets
  })

  if (!currentWorkoutSession) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Dumbbell className="h-6 w-6 text-blue-600" />
            {workout.name}
          </CardTitle>
          <div className="text-sm text-gray-600">
            {workout.duration} minutes • {workout.exercises.length} exercises
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Exercises:</h3>
            {workout.exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium">{exercise.name}</div>
                <div className="text-sm text-gray-600">
                  {exercise.sets} sets × {exercise.reps} reps
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleStartWorkout} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Workout
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto w-full min-h-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-blue-600" />
            {workout.name}
          </CardTitle>
          <Badge variant="secondary">
            {formatTime(sessionTimer)}
          </Badge>
        </div>
        
        <div className="text-sm text-gray-600">
          Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        <AnimatePresence mode="wait">
          {isResting ? (
            <motion.div
              key="resting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-4"
            >
              <div className="text-4xl sm:text-6xl font-bold text-blue-600">
                {formatTime(restTimer)}
              </div>
              <div className="text-lg font-semibold">Rest Time</div>
              <Button onClick={handleSkipRest} variant="outline">
                Skip Rest
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="exercising"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Current Exercise */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold truncate">{currentExercise.name}</h3>
                  <Badge variant={completedSets >= totalSets ? "default" : "secondary"}>
                    Set {currentSet} of {totalSets}
                  </Badge>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-medium text-blue-900 mb-2">Instructions:</div>
                  <div className="text-blue-800 text-sm">{currentExercise.instructions}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{completedSets} / {totalSets} sets</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>

              {/* Rep Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reps Completed</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRepsCompleted(Math.max(0, repsCompleted - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={repsCompleted}
                      onChange={(e) => setRepsCompleted(parseInt(e.target.value) || 0)}
                      className="text-center"
                      placeholder={currentExercise.reps}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRepsCompleted(repsCompleted + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight (optional)</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWeight(Math.max(0, weight - 5))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                      className="text-center"
                      placeholder="lbs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWeight(weight + 5)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCompleteSet}
                  disabled={repsCompleted === 0}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Set
                </Button>
                
                {allExercisesCompleted && (
                  <Button
                    onClick={handleEndWorkout}
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Finish Workout
                  </Button>
                )}
              </div>

              {/* Previous Sets */}
              {exerciseProgress.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Completed Sets:</h4>
                  <div className="space-y-1">
                    {exerciseProgress.map((progress, index) => (
                      <div key={index} className="text-sm bg-green-50 p-2 rounded flex items-center justify-between">
                        <span>Set {progress.setNumber}: {progress.repsCompleted} reps</span>
                        {progress.weight && <span>{progress.weight} lbs</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emergency Exit */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleEndWorkout}
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            End Workout Early
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkoutSession