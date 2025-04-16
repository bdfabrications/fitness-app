/*
 * TITLE: Conversion Utilities
 * FILE PATH: src/utils/conversionUtils.js
 * PURPOSE: Contains functions for converting between metric (kg, cm)
 * and imperial units (lbs, ft/in), and formatting for display.
 */

// --- Weight Conversions ---
const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 0.453592;

export function convertToUserWeight(valueInKg, targetUnit) {
  if (targetUnit === 'lbs') {
    return valueInKg * KG_TO_LBS;
  }
  return valueInKg; // it's already kg
}

export function convertWeightToKg(value, unitOfValue) {
  if (unitOfValue === 'lbs') {
    return value * LBS_TO_KG;
  }
  return value; // it's already kg
}

export function formatWeight(valueInKg, preferredUnit, decimalPlaces = 1) {
  const displayValue = convertToUserWeight(valueInKg, preferredUnit);
  const factor = Math.pow(10, decimalPlaces);
  const roundedValue = Math.round(displayValue * factor) / factor;
  return `${roundedValue} ${preferredUnit}`;
}


// --- Height Conversions ---
const CM_TO_INCHES = 0.393701;
const INCHES_TO_CM = 2.54;

/**
 * Converts centimeters to feet and inches.
 * @param {number} valueInCm - Height in centimeters.
 * @returns {object} An object { feet: number, inches: number }
 */
export function cmToImperialHeight(valueInCm) {
  if (isNaN(valueInCm) || valueInCm <= 0) {
    return { feet: 0, inches: 0 }; // Return zero if input is invalid
  }
  const totalInches = valueInCm * CM_TO_INCHES;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12); // Round remaining inches

  // Handle edge case where rounding inches results in 12 inches
  if (inches === 12) {
    return { feet: feet + 1, inches: 0 };
  }

  return { feet, inches };
}

/**
 * Converts feet and inches to centimeters.
 * @param {number|string} feet - Height in feet.
 * @param {number|string} inches - Height in inches.
 * @returns {number} Height in centimeters.
 */
export function imperialHeightToCm(feet, inches) {
  const ft = parseFloat(feet) || 0; // Default to 0 if input is invalid/empty
  const inch = parseFloat(inches) || 0; // Default to 0 if input is invalid/empty

  if (ft < 0 || inch < 0) {
    console.warn("Feet and inches should be non-negative.");
    return 0; // Or handle error appropriately
  }

  const totalInches = (ft * 12) + inch;
  return totalInches * INCHES_TO_CM;
}

/**
 * Formats a height value (stored in cm) for display.
 * @param {number} valueInCm - Height in centimeters.
 * @param {'metric' | 'imperial'} system - The measurement system.
 * @param {number} [decimalPlacesCm=0] - Decimal places for cm display.
 * @returns {string} Formatted height string (e.g., "178 cm" or "5 ft 10 in").
 */
export function formatHeight(valueInCm, system, decimalPlacesCm = 0) {
  if (system === 'imperial') {
    const { feet, inches } = cmToImperialHeight(valueInCm);
    return `${feet} ft ${inches} in`;
  } else {
    // Metric system
    const factor = Math.pow(10, decimalPlacesCm);
    const roundedValue = Math.round(valueInCm * factor) / factor;
    return `${roundedValue} cm`;
  }
}