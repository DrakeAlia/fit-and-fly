# Fit & Fly - Travel Workout & Meal Planner

## Project Setup Instructions

### Technology Stack

- **Frontend Framework**: Next.js 14 with App Router and TypeScript
- **Build Tool**: Next.js built-in build system
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: Zustand with persistence
- **AI Integration**: Claude API (Anthropic)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Development Setup

### Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main app entry point
│   ├── globals.css             # Global styles and animations
│   └── api/
│       └── generate-plan/
│           └── route.ts        # API endpoint for AI plan generation
├── components/
│   ├── trip-wizard/            # Multi-step trip setup form
│   │   ├── TripWizard.tsx
│   │   ├── StepOne.tsx
│   │   ├── StepTwo.tsx
│   │   └── StepThree.tsx
│   ├── dashboard/              # Main app dashboard
│   │   ├── Dashboard.tsx
│   │   ├── DayCard.tsx
│   │   ├── NutritionRing.tsx
│   │   └── MobileMenu.tsx
│   ├── modals/                 # Modal components
│   │   ├── MealSwapModal.tsx
│   │   └── WorkoutModal.tsx
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   ├── utils.ts                # Utility functions (cn, formatters)
│   ├── store.ts                # Zustand state management
│   ├── api.ts                  # API helper functions
│   └── constants.ts            # App constants
├── hooks/
│   ├── useTripData.ts          # Trip data management
│   ├── useLocalStorage.ts      # Local storage utilities
│   └── useMediaQuery.ts        # Responsive design hooks
└── styles/                     # Additional styling if needed
```

## Development Guidelines

### Next.js App Router

- Use Server Components by default for better performance
- Add 'use client' directive only when needed for interactivity
- Leverage file-based routing with app directory
- Implement proper metadata and SEO optimization
- Use Next.js Image component for optimized images

### TypeScript

- Use strict mode for maximum type safety
- Define interfaces for all data models and API responses
- Avoid using `any` type - prefer `unknown` for flexible types
- Use proper type guards for runtime type checking
- Implement discriminated unions for complex state types

### React Best Practices

- Use functional components with hooks exclusively
- Implement proper error boundaries for graceful error handling
- Keep components small, focused, and single-responsibility
- Use React.memo strategically for performance optimization
- Leverage useCallback and useMemo when appropriate
- Follow the component composition pattern over inheritance

### Tailwind CSS with shadcn/ui

- Use utility classes for styling over custom CSS
- Leverage shadcn/ui components as base building blocks
- Extend shadcn/ui components with additional Tailwind classes
- Configure custom theme values in `tailwind.config.js`
- Use responsive prefixes (sm:, md:, lg:) for mobile-first design
- Create reusable component variants using class-variance-authority

### Framer Motion

- Use motion components for smooth animations and transitions
- Implement layout animations for dynamic content changes
- Add entrance animations for better user experience
- Use AnimatePresence for mount/unmount animations
- Keep animations subtle and purposeful, not distracting
- Optimize performance with transform-based animations

### State Management with Zustand

- Keep global state minimal and focused
- Use Zustand stores for complex state that needs persistence
- Implement proper state persistence with localStorage
- Keep component-level state local when possible
- Use derived state patterns to avoid unnecessary re-renders
- Implement proper state reset functionality

### Claude API Integration

- Implement proper error handling for API calls
- Use environment variables for API keys and configuration
- Add request/response validation with Zod schemas
- Implement retry logic for failed requests
- Cache API responses when appropriate
- Handle rate limiting gracefully

### Mobile-First Development

- Design for mobile screens first, then enhance for larger screens
- Use touch-friendly sizing (minimum 44px tap targets)
- Implement proper responsive breakpoints
- Test on actual mobile devices regularly
- Optimize for various screen densities and orientations
- Consider PWA features for mobile app-like experience

### Performance Guidelines

- Implement code splitting with dynamic imports
- Use Next.js Image optimization for all images
- Minimize client-side JavaScript bundle size
- Implement proper loading states and skeleton screens
- Use React.lazy for component-level code splitting
- Monitor Core Web Vitals and optimize accordingly

### Accessibility Standards

- Follow WCAG 2.1 AA guidelines
- Implement proper semantic HTML structure
- Use ARIA labels and roles where necessary
- Ensure keyboard navigation works throughout the app
- Maintain sufficient color contrast ratios
- Test with screen readers regularly

### Development Workflow

- Use TypeScript strict mode for development
- Implement proper ESLint and Prettier configuration
- Follow conventional commit message format
- Write unit tests for utility functions and hooks
- Implement integration tests for critical user flows
- Use React Testing Library for component testing