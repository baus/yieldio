/**
 * This module is used to download and manage Treasury bond yields. It uses the following endpoint to retrieve
 * the data: https://yield.io/api/allYields.json.
 *
 * TODO: Add description of allYields.json
 */
import binarySearch from 'binary-search';


/**
 * This is used to cache the values for a specific yield duration. This eliminates two linear passes
 * on the yield data when switching durations.
 */
const yieldsForDurationCache = [];


/**
 * Array of valid yield DURATIONS
 */
export const DURATIONS = [1, 3, 6, 12, 24, 36, 60, 84, 120, 240, 360];

/**
 * Lookup table which maps duration in months to a long string label
 */
export const LONG_DURATION_LABELS = [
    [1, '1 month'],
    [3, '3 month'],
    [6, '6 month'],
    [12, '1 year'],
    [24, '2 year'],
    [36, '3 year'],
    [60, '5 year'],
    [84, '7 year'],
    [120, '10 year'],
    [240, '20 year'],
    [360, '30 year']
];

/**
 * Lookup table which maps duration in months to an abbreviated string label
 */
export const SHORT_DURATION_LABELS = [
    [1, '1m'],
    [3, '3m'],
    [6, '6m'],
    [12, '1y'],
    [24, '2y'],
    [36, '3y'],
    [60, '5y'],
    [84, '7y'],
    [120, '10y'],
    [240, '20y'],
    [360, '30y']
];

/**
 * This is values returned from the allYields API. It holds all the yields for all Tresury bond durations
 */
export let allYields = null;


/**
 * Tests if the given value is a number.
 *
 * @param number
 * @returns {boolean} True iff the value is a number
 */
export function isNumber(number) {
    return number !== null && !isNaN(number);
}

/**
 * Returns a string representing the duration provided in months
 *
 * @param number Duration in months
 * @returns the duration string or undefined if invalid duration
 */
export function getDurationLabel(durationInMonths) {
    return LONG_DURATION_LABELS.find(item => item[0] === durationInMonths)[1];
}

/**
 * Returns an abbreviated string representing the duration provided in months
 *
 * @param number Durations in months
 * @returns the abbreviate duration string or undefined if invalid duration
 */
export function getShortDurationLabel(durationInMonths) {
    return SHORT_DURATION_LABELS.find(item => item[0] === durationInMonths)[1];
}

/**
 * Loads all the yield data from https://yield.io/api/allYields.json
 * @param callback when transfer is complete, callback is called containing all yields
 */
export function getAllYields(callback) {
    fetch('https://yield.io/api/allYields.json').then(response => {
        return response.json();
    }).then(json=>{
        allYields = json;
        callback(allYields);
    });
}

/**
 * Returns the index in the DURATIONS array for a specific number of
 *
 * @param durationInMonths
 * @returns {number} the index in the DURATIONS array or -1 if not found
 */
export function getDurationIndexFromMonths(durationInMonths) {
    return DURATIONS.indexOf(durationInMonths);
}

/**
 * Iterate over allYields and produce an array of values for a specific duration which can be used
 * with Chart.js
 *
 * @param durationInMonths
 * @returns Array of objects with {t: value, y: value} where t is the date and y is the yield
 */
export function getYieldsForDuration(durationInMonths) {
    const durationIndex = getDurationIndexFromMonths(durationInMonths);
    if (!yieldsForDurationCache[durationIndex]) {
        yieldsForDurationCache[durationIndex] = allYields.filter(currentYield => isNumber(currentYield[durationIndex + 1][0]))
            .map(currentYield => ({t: currentYield[0], y: currentYield[durationIndex + 1][0]}));
    }
    return yieldsForDurationCache[durationIndex];
}

/**
 * Given two durations calculate the difference (or spread) between the two yields over all dates which have valid
 * yields for the given date.
 *
 * @param duration1InMonths
 * @param duration2InMonths
 * @returns Array of objects with {t: value, y: vaule } where t is the current time and y is the current spread
 */
export function getYieldSpreads(duration1InMonths, duration2InMonths) {
    const duration1Index = getDurationIndexFromMonths(duration1InMonths) + 1;
    const duration2Index = getDurationIndexFromMonths(duration2InMonths) + 1;
    const spreads = [];
    allYields.forEach(currentYield => {
        if (isNumber(currentYield[duration1Index][0]) && isNumber(currentYield[duration2Index][0])) {
            spreads.push({t: currentYield[0], y: currentYield[duration1Index][0] - currentYield[duration2Index][0]});
        }
    });
    return spreads;
}

/**
 * Perform binary search to find the yields for a given date
 *
 * @param date object
 * @returns Array of 3 values for each duration [yield, change from previous yield, % change from previous yield]
 */
export function getYieldsForDate(date) {
    return allYields[binarySearch(allYields, date.getTime(), (a, b) => {
        if (a[0] > b) {
            return 1;
        }
        if (a[0] === b) {
            return 0;
        }
        return -1;
    })].slice(1);
}



