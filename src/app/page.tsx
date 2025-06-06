'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import OnboardingForm from '@/components/onboarding/OnboardingForm'
import Dashboard from '@/components/dashboard/Dashboard'
import MealEditModal from '@/components/modals/MealEditModal'

export default function Home() {
  const { isOnboardingComplete } = useAppStore()

  return (
    <div className="min-h-screen">
      {!isOnboardingComplete ? (
        <OnboardingForm />
      ) : (
        <>
          <Dashboard />
          <MealEditModal />
        </>
      )}
    </div>
  )
}
