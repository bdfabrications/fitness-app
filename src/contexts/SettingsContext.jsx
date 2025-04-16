/*
 * TITLE: Application Settings Context
 * FILE PATH: src/contexts/SettingsContext.jsx (Previously SettingsContext.js)
 * PURPOSE: Manages user settings (measurement system preference: metric/imperial)
 * using React Context and remembers the setting using localStorage.
 */
import React, { useState, createContext, useEffect, useContext, useMemo } from 'react';

// 1. Create the Context
export const SettingsContext = createContext();

// 2. Create the Provider component
export const SettingsProvider = ({ children }) => {
  // 3. State variable is now 'system', defaulting to 'imperial' for US users
  const [system, setSystem] = useState(() => {
    try {
      // Use a new localStorage key for the system preference
      const storedPreference = localStorage.getItem('measurementSystem');
      // Default to 'imperial' if not 'metric' or invalid
      return storedPreference === 'metric' ? 'metric' : 'imperial';
    } catch (error) {
      console.error("Could not read system preference from localStorage", error);
      return 'imperial'; // Fallback default
    }
  });

  // 4. Effect to save the 'system' preference to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('measurementSystem', system);
    } catch (error) {
      console.error("Could not save system preference to localStorage", error);
    }
  }, [system]); // Runs only when 'system' changes

  // 5. Provide the current 'system' and the 'setSystem' function
  const contextValue = useMemo(() => ({
    system,   // 'metric' or 'imperial'
    setSystem, // Function to change the system
    // Add convenient helpers based on the system
    weightUnit: system === 'metric' ? 'kg' : 'lbs',
    heightUnit: system === 'metric' ? 'cm' : 'ft/in', // Indicate combined unit for imperial height
  }), [system]);

  // 6. Return the Provider
  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

// 7. Custom hook for easy access
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};