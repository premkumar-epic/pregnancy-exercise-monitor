/**
 * Exercise Type Definitions
 * Defines all supported exercises and their configurations
 */

/** Supported exercise types */
export type ExerciseType =
  | 'squat'
  | 'arm_raise'
  | 'pelvic_tilt'
  | 'wall_pushup'
  | 'side_leg_raise'
  | 'cat_cow'
  | 'seated_march'
  | 'calf_raise'
  | 'modified_lunge'
  | 'shoulder_roll'

/** Difficulty levels */
export type DifficultyLevel = 'low' | 'medium' | 'high'

/** Exercise configuration interface */
export interface ExerciseConfig {
  /** Unique identifier for the exercise */
  id: ExerciseType
  /** Display name of the exercise */
  name: string
  /** Emoji icon for visual representation */
  icon: string
  /** Difficulty level */
  difficulty: DifficultyLevel
  /** Benefits of the exercise */
  benefits: string[]
  /** How to position yourself before starting */
  howToStand: string[]
  /** Step-by-step instructions for proper form */
  instructions: string[]
  /** Safety tips and warnings */
  safetyTips: string[]
  /** MediaPipe landmark indices [joint1, joint2, joint3] for angle calculation */
  joints: [number, number, number]
  /** Angle thresholds for rep counting (in degrees) */
  thresholds: {
    /** Minimum angle for "down" position */
    down: number
    /** Maximum angle for "up" position */
    up: number
  }
  /** Which trimesters this exercise is safe for (1, 2, 3) */
  trimesterSafe: number[]
  /** Optional image URL for animated demonstration */
  imageUrl?: string
}

/**
 * Exercise Configurations
 * Complete definitions for all supported pregnancy-safe exercises
 */
export const EXERCISES: Record<ExerciseType, ExerciseConfig> = {
  // HIGH DIFFICULTY
  squat: {
    id: 'squat',
    name: 'Bodyweight Squats',
    icon: '🦵',
    difficulty: 'high',
    imageUrl: '/exercises/squats.png',
    benefits: [
      'Strengthens legs, glutes, and core muscles',
      'Improves balance and stability',
      'Prepares body for labor and delivery',
      'Reduces lower back pain'
    ],
    howToStand: [
      'Stand with feet shoulder-width apart',
      'Toes pointing slightly outward (10-15 degrees)',
      'Arms extended forward for balance',
      'Keep chest up and shoulders back'
    ],
    instructions: [
      'Engage your core muscles',
      'Lower down as if sitting in a chair',
      'Keep knees tracking over toes',
      'Go down until thighs are parallel to floor',
      'Push through heels to stand back up',
      'Exhale as you rise'
    ],
    safetyTips: [
      'Don\'t let knees go past toes',
      'Keep back straight, avoid rounding',
      'Stop if you feel dizzy or short of breath',
      'Use a chair for support if needed'
    ],
    joints: [23, 25, 27], // hip, knee, ankle
    thresholds: { down: 130, up: 150 }, // More lenient: easier to trigger reps
    trimesterSafe: [1, 2, 3]
  },

  modified_lunge: {
    id: 'modified_lunge',
    name: 'Standing Leg Lifts',
    icon: '🏃‍♀️',
    difficulty: 'high',
    imageUrl: '/exercises/leg-lifts.png',
    benefits: [
      'Strengthens legs and improves balance',
      'Builds hip and glute strength',
      'Enhances coordination',
      'Prepares for daily activities'
    ],
    howToStand: [
      'Stand tall with feet hip-width apart',
      'Keep hands on hips or use wall for support',
      'Engage core muscles',
      'Look straight ahead'
    ],
    instructions: [
      'Step forward with one leg',
      'Lower back knee toward ground',
      'Keep front knee over ankle',
      'Push through front heel to return',
      'Alternate legs',
      'Move slowly and controlled'
    ],
    safetyTips: [
      'Use wall or chair for balance',
      'Don\'t let front knee go past toes',
      'Keep torso upright',
      'Stop if you feel unstable'
    ],
    joints: [23, 25, 27],
    thresholds: { down: 110, up: 160 }, // More lenient
    trimesterSafe: [1, 2]
  },

  // MEDIUM DIFFICULTY
  wall_pushup: {
    id: 'wall_pushup',
    name: 'Wall Push-Ups',
    icon: '🧱',
    difficulty: 'medium',
    imageUrl: '/exercises/wall-pushups.png',
    benefits: [
      'Strengthens chest, shoulders, and arms',
      'Safer alternative to floor push-ups',
      'Improves upper body endurance',
      'Maintains arm strength for carrying baby'
    ],
    howToStand: [
      'Stand arm\'s length from a wall',
      'Place hands on wall at shoulder height',
      'Hands shoulder-width apart',
      'Feet hip-width apart for stability'
    ],
    instructions: [
      'Keep body in straight line',
      'Bend elbows to lower chest toward wall',
      'Keep core engaged',
      'Push back to starting position',
      'Breathe in as you lower, out as you push',
      'Maintain steady pace'
    ],
    safetyTips: [
      'Don\'t let belly sag',
      'Keep elbows at 45-degree angle',
      'Stop if you feel strain in back',
      'Adjust distance from wall for easier/harder'
    ],
    joints: [11, 13, 15], // shoulder, elbow, wrist
    thresholds: { down: 100, up: 160 }, // More lenient
    trimesterSafe: [1, 2]
  },

  side_leg_raise: {
    id: 'side_leg_raise',
    name: 'Side Leg Raises',
    icon: '🦵',
    difficulty: 'medium',
    imageUrl: '/exercises/side-leg-raises.png',
    benefits: [
      'Strengthens hip abductors',
      'Improves balance and stability',
      'Reduces hip and lower back pain',
      'Prepares hips for delivery'
    ],
    howToStand: [
      'Stand next to wall or chair for support',
      'Keep supporting leg slightly bent',
      'Stand tall with good posture',
      'Engage core muscles'
    ],
    instructions: [
      'Lift leg out to the side',
      'Keep leg straight but not locked',
      'Raise to about 45 degrees',
      'Lower with control',
      'Keep body upright, don\'t lean',
      'Repeat on both sides'
    ],
    safetyTips: [
      'Use support for balance',
      'Don\'t swing leg',
      'Keep hips level',
      'Stop if you feel hip pain'
    ],
    joints: [23, 25, 27],
    thresholds: { down: 5, up: 40 }, // More lenient
    trimesterSafe: [1, 2, 3]
  },

  arm_raise: {
    id: 'arm_raise',
    name: 'Arm Circles',
    icon: '✋',
    difficulty: 'medium',
    imageUrl: '/exercises/arm-circles.png',
    benefits: [
      'Improves shoulder mobility',
      'Reduces upper back tension',
      'Increases blood circulation',
      'Relieves shoulder stiffness'
    ],
    howToStand: [
      'Stand with feet shoulder-width apart',
      'Arms extended out to sides',
      'Keep shoulders relaxed',
      'Maintain good posture'
    ],
    instructions: [
      'Make small circles with arms',
      'Gradually increase circle size',
      'Keep arms straight but not locked',
      'Reverse direction after 10 circles',
      'Move slowly and controlled',
      'Breathe naturally'
    ],
    safetyTips: [
      'Don\'t raise shoulders',
      'Stop if you feel dizzy',
      'Keep movements smooth',
      'Avoid jerky motions'
    ],
    joints: [11, 13, 15],
    thresholds: { down: 90, up: 140 }, // More lenient
    trimesterSafe: [1, 2, 3]
  },

  pelvic_tilt: {
    id: 'pelvic_tilt',
    name: 'Pelvic Tilts',
    icon: '🎯',
    difficulty: 'medium',
    imageUrl: '/exercises/pelvic-tilts.png',
    benefits: [
      'Strengthens pelvic floor muscles',
      'Reduces lower back pain',
      'Improves posture',
      'Prepares for labor'
    ],
    howToStand: [
      'Lie on back with knees bent (T1-T2 only)',
      'Feet flat on floor, hip-width apart',
      'Arms at sides, palms down',
      'Relax shoulders and neck'
    ],
    instructions: [
      'Tighten abdominal muscles',
      'Tilt pelvis toward ceiling',
      'Press lower back into floor',
      'Hold for 5 seconds',
      'Release slowly',
      'Repeat 10-15 times'
    ],
    safetyTips: [
      'Only in trimester 1-2 (avoid lying flat in T3)',
      'Don\'t hold breath',
      'Move gently',
      'Stop if uncomfortable'
    ],
    joints: [23, 25, 27],
    thresholds: { down: 100, up: 160 }, // More lenient
    trimesterSafe: [1, 2]
  },

  // LOW DIFFICULTY
  shoulder_roll: {
    id: 'shoulder_roll',
    name: 'Shoulder Rolls',
    icon: '💪',
    difficulty: 'low',
    imageUrl: '/exercises/shoulder-rolls.png',
    benefits: [
      'Relieves shoulder and neck tension',
      'Improves posture',
      'Reduces upper back stiffness',
      'Easy to do anywhere'
    ],
    howToStand: [
      'Stand or sit with good posture',
      'Feet flat on floor',
      'Arms relaxed at sides',
      'Look straight ahead'
    ],
    instructions: [
      'Roll shoulders backward in circular motion',
      'Lift shoulders up toward ears',
      'Pull shoulders back',
      'Lower shoulders down',
      'Complete 10 circles',
      'Reverse direction'
    ],
    safetyTips: [
      'Keep movements smooth',
      'Don\'t force range of motion',
      'Relax neck',
      'Breathe naturally'
    ],
    joints: [11, 13, 23],
    thresholds: { down: 30, up: 150 }, // More lenient
    trimesterSafe: [1, 2, 3]
  },

  calf_raise: {
    id: 'calf_raise',
    name: 'Standing Calf Raises',
    icon: '🦶',
    difficulty: 'low',
    imageUrl: '/exercises/calf-raises.png',
    benefits: [
      'Strengthens calf muscles',
      'Improves circulation in legs',
      'Reduces swelling and cramping',
      'Enhances balance'
    ],
    howToStand: [
      'Stand near wall or chair for support',
      'Feet hip-width apart',
      'Weight evenly distributed',
      'Stand tall with good posture'
    ],
    instructions: [
      'Rise up onto toes',
      'Lift heels as high as comfortable',
      'Hold for 2 seconds at top',
      'Lower heels slowly',
      'Keep movements controlled',
      'Repeat 15-20 times'
    ],
    safetyTips: [
      'Use support for balance',
      'Don\'t bounce',
      'Keep ankles stable',
      'Stop if you feel calf cramps'
    ],
    joints: [25, 27, 31],
    thresholds: { down: 95, up: 115 }, // More lenient
    trimesterSafe: [1, 2, 3]
  },

  cat_cow: {
    id: 'cat_cow',
    name: 'Cat-Cow Stretch',
    icon: '🐱',
    difficulty: 'low',
    imageUrl: '/exercises/cat-cow.png',
    benefits: [
      'Relieves back pain and tension',
      'Improves spine flexibility',
      'Reduces stress',
      'Helps position baby optimally'
    ],
    howToStand: [
      'Get on hands and knees',
      'Hands under shoulders',
      'Knees under hips',
      'Spine in neutral position'
    ],
    instructions: [
      'Inhale: Arch back, lift head (cow)',
      'Exhale: Round back, tuck chin (cat)',
      'Move slowly between positions',
      'Keep movements smooth',
      'Repeat 10-15 times',
      'Follow your breath'
    ],
    safetyTips: [
      'Don\'t force the arch',
      'Keep movements gentle',
      'Stop if you feel dizzy',
      'Use padding under knees'
    ],
    joints: [11, 23, 25],
    thresholds: { down: 155, up: 145 }, // More lenient
    trimesterSafe: [1, 2, 3]
  },

  seated_march: {
    id: 'seated_march',
    name: 'Seated Marches',
    icon: '🪑',
    difficulty: 'low',
    imageUrl: '/exercises/seated-marches.png',
    benefits: [
      'Activates core muscles safely',
      'Improves hip flexor strength',
      'Low-impact cardio option',
      'Can be done anywhere'
    ],
    howToStand: [
      'Sit on sturdy chair',
      'Feet flat on floor',
      'Sit up tall, shoulders back',
      'Hands on thighs or armrests'
    ],
    instructions: [
      'Lift one knee toward chest',
      'Lower foot back to floor',
      'Alternate legs',
      'Keep back straight',
      'March at comfortable pace',
      'Continue for 1-2 minutes'
    ],
    safetyTips: [
      'Don\'t lean back',
      'Keep movements controlled',
      'Stop if you feel breathless',
      'Use chair with armrests for support'
    ],
    joints: [23, 25, 27],
    thresholds: { down: 100, up: 50 }, // More lenient
    trimesterSafe: [1, 2, 3]
  }
}

/** Activity data from CSV uploads */
export interface ActivityDay {
  date: string
  steps: number
  avg_heart_rate?: number
  calories: number
  sleep_minutes?: number
  active_minutes?: number
}

/** Pregnancy profile data */
export interface PregnancyProfile {
  id: number
  lmp_date: string
  current_week: number
  trimester: number
  due_date: string
  weeks_remaining: number
  created_at: string
  updated_at: string
}

/** Pregnancy content/guidance */
export interface PregnancyContent {
  id: number
  trimester: number
  week_min: number
  week_max: number
  content_type: 'nutrition' | 'exercise' | 'emotional' | 'warnings'
  title: string
  body: string
  is_safe: boolean
}
