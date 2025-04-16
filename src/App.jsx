/*
 * TITLE: Main Application Component (Integrated with Settings)
 * FILE PATH: src/App.jsx
 * PURPOSE: Main app component, now including the SettingsProvider for lbs/kg preference
 * and the SettingsPage component to change that preference.
 */
import React, { useState, useEffect } from 'react';

// --- ADDITIONS FOR SETTINGS ---
import { SettingsProvider } from './contexts/SettingsContext.jsx'; // Import the provider
import SettingsPage from './components/SettingsPage';       // Import the example settings page
// --- END ADDITIONS ---

// Your existing imports
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { calculateBMR, calculateTDEE, calculateExerciseTarget, estimateCaloriesBurned } from './utils/calculations';
import exercisesData from './data/exercises.json';

// Import CSS (make sure this path is correct)
import './App.css';
// If you created the App.css file I provided earlier for styling, use that:
// import './App.css'; // Or keep your original CSS import if preferred

// Key for localStorage for form data
const LOCAL_STORAGE_KEY = 'fitnessFormData';

function App() {
  // Your existing state variables
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exercises] = useState(exercisesData);
  const [initialFormData, setInitialFormData] = useState(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
      console.error("Failed to parse saved form data:", e);
      return null;
    }
  });

  // Your existing handleCalculate function (keep as is for now)
  // NOTE: This function DOES NOT YET use the lbs/kg setting.
  //       That will require modifying InputForm and this function later.
  const handleCalculate = (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);

    if (!formData.weightKg || !formData.heightCm || !formData.ageYears || !formData.sex || !formData.activityLevel || formData.intake === '' || !formData.goal) {
        setError('Please fill in all required fields with valid numbers.');
        setLoading(false);
        return;
     }

    try {
      const bmr = calculateBMR(formData.weightKg, formData.heightCm, formData.ageYears, formData.sex);
      const tdee = calculateTDEE(bmr, formData.activityLevel);
      const exerciseTarget = calculateExerciseTarget(tdee, formData.intake, formData.goal, formData.desiredDeficit);

      const calculatedResults = {
        bmr: bmr.toFixed(0),
        tdee: tdee.toFixed(0),
        exerciseTargetPerDay: exerciseTarget.toFixed(0),
        userWeightKg: formData.weightKg // Keep passing weight for now
      };

      setResults(calculatedResults);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      setInitialFormData(formData);

    } catch (err) {
      console.error("Calculation error:", err);
      setError(err.message || 'An error occurred during calculation.');
    } finally {
      setLoading(false);
    }
  };

  // Your existing clearSavedData function (keep as is)
  const clearSavedData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setInitialFormData(null);
    setResults(null);
    setError(null);
    // Optional: Add logic here if you want clearing data to also reset the unit preference
    // const { setUnit } = useSettings(); // Needs `useSettings` hook imported
    // setUnit('lbs'); // Example: reset to lbs
  };

  // Your JSX return statement
  return (
    // --- ADDITION: Wrap main content with SettingsProvider ---
    // This makes the 'unit' and 'setUnit' available to components inside
    <SettingsProvider>
      {/* Keep your existing main div structure */}
      <div className="App container">
        <header className="App-header">
          <h1>Fitness Calculator</h1>
          <p>Estimate your energy needs and daily exercise targets.</p>
        </header>

        {/* --- ADDITION: Place the SettingsPage component --- */}
        {/* You can place this wherever it makes sense in your layout */}
        <SettingsPage />
        {/* --- END ADDITION --- */}

        <main>
          {/* Your existing InputForm component */}
          {/* NOTE: InputForm itself will need modification later */}
          {/* to use the unit setting for displaying/handling weight input. */}
          <InputForm
            onSubmit={handleCalculate}
            loading={loading}
            initialData={initialFormData}
          />

          {/* Your existing clear button */}
          {initialFormData && (
            <button onClick={clearSavedData} className="clear-button">
              Clear Saved Inputs & Results
            </button>
          )}

          {/* Your existing error, loading, and results display */}
          {error && <p className="error-message card">Error: {error}</p>}
          {loading && <p className="loading-message">Calculating...</p>}
          {/* NOTE: ResultsDisplay will also need modification later */}
          {/* if it needs to show weight-related results in the user's unit. */}
          {results && !loading && <ResultsDisplay results={results} />}

          {/* Your commented-out exercise list */}
          {/* <section className="exercise-list card"> ... </section> */}
        </main>

        <footer className="App-footer">
          <p>Remember: Consistency is key! Use these estimates as a guide.</p>
          <p>&copy; {new Date().getFullYear()} Your Fitness App Name</p>
        </footer>
      </div>
    {/* --- ADDITION: Closing tag for SettingsProvider --- */}
    </SettingsProvider>
  );
}

export default App;