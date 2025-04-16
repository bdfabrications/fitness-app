import React from 'react';

function ResultsDisplay({ results }) {
  // Don't render anything if there are no results yet
  if (!results) {
    return null;
  }

  return (
    <div className="results-display card">
      <h2>Estimated Results</h2>
      <div className="results-grid">
        <p><strong>Basal Metabolic Rate (BMR):</strong> {results.bmr} Calories/day</p>
        <p><strong>Est. Daily Expenditure (TDEE):</strong> {results.tdee} Calories/day</p>
        <p><strong>Target Exercise Burn Per Day (to meet goal):</strong> {results.exerciseTargetPerDay} Calories/day</p>
      </div>
      <p className="disclaimer">
        <strong>Disclaimer:</strong> These numbers are estimates based on formulas (Mifflin-St Jeor for BMR) and your provided inputs. Actual energy needs can vary significantly. The exercise target indicates additional calories to burn through planned activity per day to bridge the gap towards your goal, considering your stated intake and activity level. It is not a complete workout plan. Always consult with a healthcare professional or certified trainer before making significant changes to your diet or starting an exercise program.
      </p>
      {/* Future Section: Suggest exercises based on results.exerciseTargetPerDay */}
      {/*
      <div className="exercise-suggestions">
          <h3>Example Exercise Durations (to burn ~{results.exerciseTargetPerDay} kcal):</h3>
          {/* Logic here to calculate and display exercise examples */}
      {/* </div>
      */}
    </div>
  );
}

export default ResultsDisplay;