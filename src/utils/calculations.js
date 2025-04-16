// Basic Mifflin-St Jeor Equation for BMR
export function calculateBMR(weightKg, heightCm, ageYears, sex) {
    // Ensure inputs are numbers
    weightKg = Number(weightKg);
    heightCm = Number(heightCm);
    ageYears = Number(ageYears);

    if (isNaN(weightKg) || isNaN(heightCm) || isNaN(ageYears) || weightKg <= 0 || heightCm <= 0 || ageYears <= 0) {
        throw new Error("Invalid weight, height, or age input.");
    }

    if (sex && sex.toLowerCase() === 'male') {
        // BMR = (10 * weight in kg) + (6.25 * height in cm) - (5 * age in years) + 5
        return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + 5;
    } else if (sex && sex.toLowerCase() === 'female') {
        // BMR = (10 * weight in kg) + (6.25 * height in cm) - (5 * age in years) - 161
        return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) - 161;
    } else {
        // Handle cases where sex is not specified or is 'other'.
        // Using an average calculation (midpoint between male and female offset) as a fallback.
        // This is a simplification and might not be accurate for everyone.
        console.warn("Sex not specified as 'male' or 'female', using an average BMR calculation.");
        return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) - 78;
    }
}

// Calculate TDEE based on BMR and activity level multiplier
export function calculateTDEE(bmr, activityLevel) {
    const activityMultipliers = {
        sedentary: 1.2,        // Little or no exercise
        lightly_active: 1.375, // Light exercise/sports 1-3 days/week
        moderately_active: 1.55, // Moderate exercise/sports 3-5 days/week
        very_active: 1.725,    // Hard exercise/sports 6-7 days a week
        extra_active: 1.9      // Very hard exercise/sports & physical job
    };
    const multiplier = activityMultipliers[activityLevel?.toLowerCase()] || 1.2; // Default to sedentary if level is invalid
    return bmr * multiplier;
}

// Calculate target exercise calories based on goal
export function calculateExerciseTarget(tdee, intake, goal, desiredDeficit = 500) {
    intake = Number(intake);
    desiredDeficit = Number(desiredDeficit);

    if (isNaN(tdee) || isNaN(intake) || isNaN(desiredDeficit) || tdee <= 0) {
         throw new Error("Invalid TDEE, intake, or desired deficit for calculation.");
    }

    const currentBalance = tdee - intake; // Positive = TDEE > Intake, Negative = TDEE < Intake

    if (goal === 'maintain') {
        // If intake is already at or below TDEE, no *extra* exercise needed for maintenance caloric balance
        // If intake is above TDEE, need to burn the difference
        return currentBalance < 0 ? Math.abs(currentBalance) : 0;
    } else if (goal === 'lose') {
        // Target Caloric Level = TDEE - desiredDeficit
        // Exercise Needed = Target Caloric Level - Intake  (This is wrong)
        // Think: We need a total daily deficit of 'desiredDeficit'.
        // Deficit achieved through diet = TDEE - Intake = currentBalance
        // Additional deficit needed from exercise = desiredDeficit - currentBalance
        const exerciseNeeded = desiredDeficit - currentBalance;
        return Math.max(0, exerciseNeeded); // Return exercise needed, ensuring it's not negative
    }
    // Add 'gain' logic here later if needed
    return 0; // Default case if goal is unclear
}

// Estimate calories burned for a specific exercise
export function estimateCaloriesBurned(exerciseMET, userWeightKg, durationMinutes) {
     userWeightKg = Number(userWeightKg);
     durationMinutes = Number(durationMinutes);
     exerciseMET = Number(exerciseMET);

     if (isNaN(exerciseMET) || isNaN(userWeightKg) || isNaN(durationMinutes) || userWeightKg <= 0 || durationMinutes <= 0 || exerciseMET <=0) {
        console.warn("Invalid input for calorie estimation.");
        return 0;
     }
    // Formula: Calories/min = MET * 3.5 * weight(kg) / 200
    // Calories = (MET * 3.5 * userWeightKg / 200) * durationMinutes
    // Simplified Formula: Calories = MET * userWeightKg * (durationMinutes / 60) (using 1 MET = 1 kcal/kg/hour)
    return exerciseMET * userWeightKg * (durationMinutes / 60);
}