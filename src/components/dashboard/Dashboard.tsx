'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MapPin, Calendar, Sparkles, RotateCcw } from 'lucide-react'
import ItineraryTab from './ItineraryTab'
import StatsTab from './StatsTab'
import WorkoutsTab from './WorkoutsTab'

const Dashboard = () => {
  const { userProfile, currentTab, setCurrentTab, resetApp } = useAppStore()
  const [showResetDialog, setShowResetDialog] = React.useState(false)

  if (!userProfile) return null

  const tripDays = Math.ceil((new Date(userProfile.endDate).getTime() - new Date(userProfile.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1

  const handleTitleClick = () => {
    setShowResetDialog(true)
  }

  const handleResetConfirm = () => {
    resetApp()
    setShowResetDialog(false)
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
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-6"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-0 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTitleClick}
              title="Click to start over"
            >
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fit & Fly
              </h1>
            </motion.div>
            
            <motion.div 
              className="text-left sm:text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="flex items-center gap-2 text-gray-600 mb-2"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{userProfile.destination}</span>
                <Badge variant="secondary" className="ml-2">
                  {tripDays} days
                </Badge>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-gray-600"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(userProfile.startDate).toLocaleDateString()} - {new Date(userProfile.endDate).toLocaleDateString()}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border-0"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <motion.div variants={statsVariants}>
                <motion.div 
                  className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  {tripDays}
                </motion.div>
                <div className="text-sm text-gray-600 font-medium">Trip Days</div>
              </motion.div>
              
              <motion.div variants={statsVariants}>
                <motion.div 
                  className="text-2xl sm:text-3xl font-bold text-green-600 mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  {userProfile.calorieGoal}
                </motion.div>
                <div className="text-sm text-gray-600 font-medium">Daily Calories</div>
              </motion.div>
              
              <motion.div variants={statsVariants}>
                <motion.div 
                  className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  {userProfile.proteinGoal}g
                </motion.div>
                <div className="text-sm text-gray-600 font-medium">Daily Protein</div>
              </motion.div>
            </div>
            
            {/* Goals badges */}
            <motion.div 
              className="flex flex-wrap gap-2 justify-center mt-4 pt-4 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {userProfile.fitnessGoals.map((goal, index) => (
                <motion.div
                  key={goal}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge variant="outline" className="capitalize">
                    {goal.replace('-', ' ')}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'itinerary' | 'stats' | 'workouts')}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
                <TabsTrigger 
                  value="itinerary" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger 
                  value="stats"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  Stats
                </TabsTrigger>
                <TabsTrigger 
                  value="workouts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  Workouts
                </TabsTrigger>
              </TabsList>
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <TabsContent value="itinerary">
                  <ItineraryTab />
                </TabsContent>
                
                <TabsContent value="stats">
                  <StatsTab />
                </TabsContent>
                
                <TabsContent value="workouts">
                  <WorkoutsTab />
                </TabsContent>
                
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent onClose={() => setShowResetDialog(false)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-orange-500" />
              Start Over?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to start over? This will reset your trip planning and take you back to the beginning.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleResetConfirm}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Start Over
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Dashboard