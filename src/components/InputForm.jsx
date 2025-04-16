/*
 * TITLE: Input Form Component (Fully Unit Aware)
 * FILE PATH: src/components/InputForm.jsx
 * PURPOSE: Collects user details, handling both weight (lbs/kg) and
 * height (cm or ft/in) input/display based on the selected measurement system.
 */
import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
// Import all necessary conversion functions
import {
  convertWeightToKg,
  convertToUserWeight,
  cmToImperialHeight,
  imperialHeightToCm
} from '../utils/conversionUtils';

// Default structure for form data (internal storage remains metric)
const defaultFormState = {
  weightKg: '',
  heightCm: '',
  ageYears: '',
  sex: 'female',
  activityLevel: 'sedentary',
  intake: '',
  goal: 'maintain',
  desiredDeficit: 500
};

function InputForm({ onSubmit, loading, initialData }) {
  // Get settings context: system ('metric'/'imperial') and derived units
  const { system, weightUnit, heightUnit } = useSettings();

  // State for displayed weight (in user's unit)
  const [displayWeight, setDisplayWeight] = useState('');
  // State for displayed height (conditionally cm or ft/in)
  const [displayHeightCm, setDisplayHeightCm] = useState('');
  const [displayFeet, setDisplayFeet] = useState('');
  const [displayInches, setDisplayInches] = useState('');

  // State for the rest of the form data (excluding weight/height managed above)
  const [formData, setFormData] = useState(defaultFormState);

  // Effect to initialize form when initialData or system preference changes
  useEffect(() => {
    if (initialData) {
      // Populate non-unit-dependent fields
      const populatedInitialData = { ...defaultFormState, ...initialData };
      setFormData(populatedInitialData);

      // Handle Weight Initialization
      if (initialData.weightKg) {
        const weightInUserUnit = convertToUserWeight(initialData.weightKg, weightUnit);
        setDisplayWeight(String(Math.round(weightInUserUnit * 10) / 10));
      } else {
        setDisplayWeight('');
      }

      // Handle Height Initialization
      if (initialData.heightCm) {
        if (system === 'imperial') {
          const { feet, inches } = cmToImperialHeight(initialData.heightCm);
          setDisplayFeet(String(feet));
          setDisplayInches(String(inches));
          setDisplayHeightCm(''); // Clear cm display state
        } else { // system === 'metric'
          setDisplayHeightCm(String(Math.round(initialData.heightCm)));
          setDisplayFeet(''); // Clear imperial display state
          setDisplayInches(''); // Clear imperial display state
        }
      } else {
        // Clear all height display states if no initial height
        setDisplayHeightCm('');
        setDisplayFeet('');
        setDisplayInches('');
      }

    } else {
      // Reset form to defaults if no initial data
      setFormData(defaultFormState);
      setDisplayWeight('');
      setDisplayHeightCm('');
      setDisplayFeet('');
      setDisplayInches('');
    }
    // Depend on initialData and system (which includes derived units)
  }, [initialData, system, weightUnit]); // Added system/weightUnit dependency

  // Handles changes for non-unit-dependent inputs
  const handleOtherInputChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;
    setFormData(prevData => ({
      ...prevData,
      [name]: val
    }));
  };

  // Specific handler for weight input
  const handleWeightChange = (e) => {
    setDisplayWeight(e.target.value);
  };

  // Specific handlers for height inputs
  const handleHeightCmChange = (e) => {
    setDisplayHeightCm(e.target.value);
  };
  const handleFeetChange = (e) => {
    setDisplayFeet(e.target.value);
  };
  const handleInchesChange = (e) => {
    setDisplayInches(e.target.value);
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // --- Convert Weight back to KG ---
    const weightValue = parseFloat(displayWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
        alert(`Please enter a valid positive number for weight in ${weightUnit}.`);
        return;
    }
    const weightInKg = convertWeightToKg(weightValue, weightUnit);

    // --- Convert Height back to CM ---
    let heightInCm;
    if (system === 'imperial') {
      const feetValue = parseFloat(displayFeet);
      const inchesValue = parseFloat(displayInches);
       // Basic validation for ft/in
       if (isNaN(feetValue) || feetValue < 0 || isNaN(inchesValue) || inchesValue < 0 || inchesValue >= 12) {
         alert(`Please enter valid positive numbers for height (feet and inches, inches < 12).`);
         return;
       }
      heightInCm = imperialHeightToCm(feetValue, inchesValue);
    } else { // system === 'metric'
      const cmValue = parseFloat(displayHeightCm);
       if (isNaN(cmValue) || cmValue <= 0) {
         alert(`Please enter a valid positive number for height in cm.`);
         return;
       }
      heightInCm = cmValue;
    }
     // Additional check if conversion resulted in invalid height
     if (heightInCm <= 0) {
       alert(`Calculated height (${heightInCm}cm) is invalid. Please check inputs.`);
       return;
     }


    // --- Validate other fields ---
    if (formData.ageYears <= 0 || formData.intake < 0) {
      alert("Please enter valid positive numbers for age and intake.");
      return;
    }
     if (formData.goal === 'lose' && (!formData.desiredDeficit || formData.desiredDeficit <=0)) {
        alert("Please enter a valid positive number for desired deficit when goal is 'Lose Weight'.");
        return;
     }

    // Combine final metric values with the rest of the form data
    const finalFormData = {
        ...formData,
        weightKg: weightInKg,
        heightCm: heightInCm // Use the converted CM value
    };

    // Call the onSubmit prop with the complete data (weight in KG, height in CM)
    onSubmit(finalFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="input-form card">
      <h2>Enter Your Details {initialData ? '(Loaded Saved Data)' : ''}</h2>
      <div className="form-grid">

        {/* Weight Input */}
        <div className="form-group">
          <label htmlFor="displayWeight">Weight ({weightUnit}):</label>
          <input
            id="displayWeight" type="number" name="displayWeight"
            value={displayWeight} onChange={handleWeightChange}
            required min="1" step="any" placeholder={`Weight in ${weightUnit}`}
          />
        </div>

        {/* Height Input - Conditional Rendering */}
        {system === 'metric' ? (
          // Metric Height Input (cm)
          <div className="form-group">
            <label htmlFor="displayHeightCm">Height (cm):</label>
            <input
              id="displayHeightCm" type="number" name="displayHeightCm"
              value={displayHeightCm} onChange={handleHeightCmChange}
              required min="1" step="1" placeholder="Height in cm"
            />
          </div>
        ) : (
          // Imperial Height Input (ft / in) - Render as two separate fields
          <React.Fragment>
            <div className="form-group">
              <label htmlFor="displayFeet">Height (ft):</label>
              <input
                id="displayFeet" type="number" name="displayFeet"
                value={displayFeet} onChange={handleFeetChange}
                required min="0" step="1" placeholder="Feet"
              />
            </div>
            <div className="form-group">
              <label htmlFor="displayInches">Height (in):</label>
              <input
                id="displayInches" type="number" name="displayInches"
                value={displayInches} onChange={handleInchesChange}
                required min="0" max="11" step="1" placeholder="Inches" // Inches 0-11
              />
            </div>
          </React.Fragment>
        )}

        {/* Other form fields */}
        <div className="form-group">
          <label htmlFor="ageYears">Age (years):</label>
          <input id="ageYears" type="number" name="ageYears" value={formData.ageYears} onChange={handleOtherInputChange} required min="1"/>
        </div>
        <div className="form-group">
          <label htmlFor="sex">Biological Sex:</label>
          <select id="sex" name="sex" value={formData.sex} onChange={handleOtherInputChange}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="activityLevel">Activity Level:</label>
          <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleOtherInputChange}>
            <option value="sedentary">Sedentary (office job, little exercise)</option>
            <option value="lightly_active">Lightly Active (light exercise 1-3 days/wk)</option>
            <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/wk)</option>
            <option value="very_active">Very Active (hard exercise 6-7 days/wk)</option>
            <option value="extra_active">Extra Active (hard daily exercise/physical job)</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="intake">Avg. Daily Calorie Intake:</label>
          <input id="intake" type="number" name="intake" value={formData.intake} onChange={handleOtherInputChange} required min="0"/>
        </div>
        <div className="form-group">
          <label htmlFor="goal">Primary Goal:</label>
          <select id="goal" name="goal" value={formData.goal} onChange={handleOtherInputChange}>
            <option value="maintain">Maintain Weight</option>
            <option value="lose">Lose Weight</option>
          </select>
        </div>
        {formData.goal === 'lose' && (
          <div className="form-group">
            <label htmlFor="desiredDeficit">Target Daily Deficit (e.g., 500 ≈ 1lb/wk):</label>
            <input id="desiredDeficit" type="number" name="desiredDeficit" value={formData.desiredDeficit} onChange={handleOtherInputChange} required min="1"/>
          </div>
        )}
      </div>
      <button type="submit" disabled={loading} className="calculate-button">
        {loading ? 'Calculating...' : 'Calculate Targets'}
      </button>
    </form>
  );
}

export default InputForm;