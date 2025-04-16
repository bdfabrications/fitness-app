/*
 * TITLE: Example Weight Input Component
 * FILE PATH: src/components/WeightInput.jsx
 * PURPOSE: Provides an input field for users to enter weight, automatically
 * showing the correct unit (lbs/kg) based on settings. Converts input to KG on save.
 */
import React, { useState } from 'react';
// Import the settings hook and the conversion utility
import { useSettings } from '../contexts/SettingsContext.jsx';
import { convertToKg } from '../utils/conversionUtils';

// This component expects a function called 'onSave' to be passed to it.
// This function will receive the weight *after* it's converted to KG.
function WeightInput({ onSave }) {
  const { unit } = useSettings(); // Get the current unit ('lbs' or 'kg') from context
  const [inputValue, setInputValue] = useState(''); // State to hold what the user types in the box
  const [error, setError] = useState(''); // State to show error messages if input is bad

  // Update the inputValue state whenever the user types in the box
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setError(''); // Clear any previous error message
  };

  // This function runs when the user clicks the 'Save' button
  const handleSave = () => {
    const value = parseFloat(inputValue); // Try to convert the typed text into a number

    // Check if the input is a valid, positive number
    if (isNaN(value) || value <= 0) {
      setError(`Please enter a valid positive weight in ${unit}.`); // Show error message
      return; // Stop the function here if input is bad
    }

    setError(''); // Clear error message if input is okay

    // Convert the number the user typed (which is in their chosen 'unit')
    // into Kilograms using our utility function.
    const valueInKg = convertToKg(value, unit);

    // Call the 'onSave' function that was passed into this component,
    // giving it the final weight value *in Kilograms*.
    onSave(valueInKg);

    // Clear the input box after saving successfully
    setInputValue('');
  };

  return (
    // Basic HTML structure for the input area
    <div style={{ padding: '15px', border: '1px dashed blue', margin: '10px', backgroundColor: '#f0f8ff' }}>
      <h4>Enter Workout Weight</h4>
      {/* Label clearly shows which unit is expected */}
      <label htmlFor="weightInput">Weight ({unit}): </label>
      <input
        id="weightInput"
        type="number" // Use 'number' type for better mobile experience potentially
        value={inputValue} // Bind input value to our state
        onChange={handleInputChange} // Call function when user types
        placeholder={`Enter weight in ${unit}`}
        min="0" // Prevent negative numbers in the input field
        step="any" // Allow decimal numbers (like 10.5)
      />
      <button onClick={handleSave} style={{ marginLeft: '10px' }}>
        Save Weight
      </button>
      {/* Show error message below input if 'error' state is not empty */}
      {error && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>{error}</p>}
    </div>
  );
}

export default WeightInput;