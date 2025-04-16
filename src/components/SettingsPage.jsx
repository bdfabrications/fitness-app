/*
 * TITLE: Settings Page Component (Updated for Metric/Imperial)
 * FILE PATH: src/components/SettingsPage.jsx
 * PURPOSE: Shows a dropdown for the user to select their preferred measurement system.
 */
import React from 'react';
// Import the custom hook from the updated context
import { useSettings } from '../contexts/SettingsContext';

function SettingsPage() {
  // Get the current 'system' ('metric' or 'imperial') and
  // the 'setSystem' function from our context
  const { system, setSystem } = useSettings();

  // This function runs when the user selects a different option in the dropdown
  const handleSystemChange = (event) => {
    const newSystem = event.target.value; // Get the selected value ('metric' or 'imperial')
    setSystem(newSystem); // Update the setting using the function from the context
  };

  return (
    // Basic HTML structure for the settings option
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', backgroundColor: '#f9f9f9' }}>
      <h2>Application Settings</h2>
      <div>
        <label htmlFor="systemSelect">Measurement System: </label>
        {/* The dropdown menu now controls the 'system' state */}
        <select id="systemSelect" value={system} onChange={handleSystemChange}>
          {/* Update options to reflect the system choice */}
          <option value="imperial">Imperial (lbs, ft/in)</option>
          <option value="metric">Metric (kg, cm)</option>
        </select>
      </div>
      <p style={{ fontSize: '0.8em', color: '#555' }}>
        <i>Your preference is saved automatically.</i>
      </p>
    </div>
  );
}

// Make this component available for other files to import
export default SettingsPage;