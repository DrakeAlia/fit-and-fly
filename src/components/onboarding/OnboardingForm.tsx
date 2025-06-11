"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  OnboardingFormData,
  OnboardingFormSchema,
  EquipmentSchema,
  FitnessGoalSchema,
} from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import CitySelector from "@/components/ui/city-selector";
import {
  MapPin,
  Calendar,
  Target,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const OnboardingForm = () => {
  const { onboardingStep, setOnboardingStep, completeOnboarding } =
    useAppStore();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: {
      destination: "",
      startDate: "",
      endDate: "",
      fitnessGoals: [],
      availableEquipment: [],
    },
    mode: "onChange",
  });

  const { watch, setValue, getValues, trigger } = form;
  const currentValues = watch();

  const handleNext = async () => {
    let fieldsToValidate: (keyof OnboardingFormData)[] = [];

    // Validate fields based on current step
    switch (onboardingStep) {
      case 0:
        fieldsToValidate = ["destination"];
        break;
      case 1:
        fieldsToValidate = ["startDate", "endDate"];
        break;
      case 2:
        fieldsToValidate = ["fitnessGoals"];
        break;
      case 3:
        fieldsToValidate = ["availableEquipment"];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const handleSubmit = () => {
    const formData = getValues();

    // Calculate basic nutrition goals (simple formula)
    const calorieGoal = 2000; // Default daily calories
    const proteinGoal = Math.round((calorieGoal * 0.25) / 4); // 25% of calories from protein

    const profile = {
      ...formData,
      calorieGoal,
      proteinGoal,
    };

    completeOnboarding(profile);
  };

  const toggleArrayValue = (
    fieldName: "fitnessGoals" | "availableEquipment",
    value: string
  ) => {
    const currentArray = currentValues[fieldName] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    setValue(fieldName, newArray as any, { shouldValidate: true }); // eslint-disable-line @typescript-eslint/no-explicit-any
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

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
            className="space-y-16"
          >
            <motion.div
              variants={itemVariants}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <MapPin className="mx-auto h-20 w-20 text-blue-500" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Where are you traveling?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Search and select your destination city for personalized
                recommendations
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Destination
                      </FormLabel>
                      <FormControl>
                        <CitySelector
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Search for your destination city..."
                          className="w-full text-lg"
                          error={fieldState.error?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-base text-gray-500 text-center">
                Type to search or browse popular destinations in the dropdown
              </p>
            </motion.div>
          </motion.div>
        );

      case 1:
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        return (
          <motion.div
            key="step-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-16"
          >
            <motion.div
              variants={itemVariants}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Calendar className="mx-auto h-20 w-20 text-green-500" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                When is your trip?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Choose your travel dates to plan your fitness routine
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form {...form}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Start Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="text-lg p-4 h-16 text-center"
                            min={today}
                            {...field}
                          />
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
                        <FormLabel className="text-lg font-semibold">
                          End Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="text-lg p-4 h-16 text-center"
                            min={currentValues.startDate || today}
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

            <motion.div variants={itemVariants}>
              <p className="text-base text-gray-500 text-center">
                Note: Past dates are not available for selection
              </p>
            </motion.div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-16"
          >
            <motion.div
              variants={itemVariants}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Target className="mx-auto h-20 w-20 text-purple-500" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                What are your fitness goals?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Select all that apply to personalize your workouts
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 gap-3">
                {FitnessGoalSchema.options.map((goal) => (
                  <motion.div
                    key={goal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Badge
                      variant={
                        currentValues.fitnessGoals.includes(goal)
                          ? "default"
                          : "outline"
                      }
                      className={`w-full p-6 h-auto text-center cursor-pointer justify-center capitalize transition-all duration-200 text-lg ${
                        currentValues.fitnessGoals.includes(goal)
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleArrayValue("fitnessGoals", goal)}
                    >
                      {goal.replace("-", " ")}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-16"
          >
            <motion.div
              variants={itemVariants}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Dumbbell className="mx-auto h-20 w-20 text-orange-500" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                What equipment do you have?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Select available equipment to customize your workouts
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 gap-3">
                {EquipmentSchema.options.map((equipment) => (
                  <motion.div
                    key={equipment}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Badge
                      variant={
                        currentValues.availableEquipment.includes(equipment)
                          ? "default"
                          : "outline"
                      }
                      className={`w-full p-6 h-auto text-center cursor-pointer justify-center capitalize transition-all duration-200 text-lg ${
                        currentValues.availableEquipment.includes(equipment)
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        toggleArrayValue("availableEquipment", equipment)
                      }
                    >
                      {equipment === "bodyweight"
                        ? "Bodyweight Only"
                        : equipment.replace("-", " ")}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[95vw]"
      >
        <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0 overflow-hidden w-full max-w-5xl sm:max-w-6xl lg:max-w-7xl xl:max-w-[90vw] min-h-[750px] mx-auto">
          <CardHeader className="text-center pb-8 px-8 sm:px-16 lg:px-24 pt-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <Sparkles className="h-12 w-12 text-purple-600" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fit & Fly
              </h1>
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex space-x-3">
                {[0, 1, 2, 3].map((step) => (
                  <motion.div
                    key={step}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      step <= onboardingStep
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gray-200"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + step * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="px-8 sm:px-16 lg:px-24 pb-12">
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

            <motion.div
              className="flex justify-between pt-12 mt-12 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={onboardingStep === 0}
                className="flex items-center gap-2 text-lg px-8 py-4 h-auto"
                size="lg"
              >
                <ArrowLeft className="h-5 w-5" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4 h-auto"
                size="lg"
              >
                {onboardingStep === 3 ? "Complete Setup" : "Next"}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingForm;
