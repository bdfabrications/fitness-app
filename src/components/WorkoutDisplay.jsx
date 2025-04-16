/*
 * TITLE: Example Weight Display Component
 * FILE PATH: src/components/WorkoutDisplay.jsx
 * PURPOSE: Displays a stored weight value (assumed to be in KG),
 * automatically formatting it to the user's preferred unit (lbs/kg).
 */
import React from 'react';
// Import the settings hook and the formatting utility
import { useSettings } from '../contexts/SettingsContext.jsx';
import { formatWeight } from '../utils/conversionUtils';

// This component expects the exercise name and the weight *in Kilograms*
function WorkoutDisplay({ exerciseName, weightInKg }) {
  const { unit } = useSettings(); // Get the current unit ('lbs' or 'kg')

  return (
    // Basic HTML structure to display the workout info
    <div style={{ padding: '10px', border: '1px solid green', margin: '10px', backgroundColor: '#f0fff0' }}>
      <p>
        <strong>{exerciseName}:</strong> {/* Show the exercise name */}
        {' '} {/* Add a space */}
        {/* Use the formatting function to display the weight correctly */}
        {/* It takes the KG value and the user's preferred unit */}
        {formatWeight(weightInKg, unit)}
      </p>
    </div>
  );
}

export default WorkoutDisplay;