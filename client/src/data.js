import util from './util.js';

const yieldsForDurationCache = [];

export let allYields = null;
export const DURATIONS = [1, 3, 6, 12, 24, 36, 60, 84, 120, 240, 360];

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

export function getDurationLabel(durationInMonths) {
    return LONG_DURATION_LABELS.find(item => item[0] === durationInMonths)[1]
}

export function getShortDurationLabel(durationInMonths) {
    return SHORT_DURATION_LABELS.find(item => item[0] === durationInMonths)[1]
}

export function getAllYields(callback) {
    fetch('https://yield.io/api/allYields.json').then(response => {
        return response.json();
    }).then(json=>{
        allYields = json;
        callback(allYields);
    });
}

export function getDurationIndexFromMonths(durationInMonths) {
    return DURATIONS.indexOf(durationInMonths);
}

export function getYieldsForDuration(durationInMonths) {
    const durationIndex = getDurationIndexFromMonths(durationInMonths);
    if (!yieldsForDurationCache[durationIndex]) {
        yieldsForDurationCache[durationIndex] = allYields.filter(currentYield => isNumber(currentYield[durationIndex + 1][0]))
            .map(currentYield => ({t: currentYield[0], y: currentYield[durationIndex + 1][0]}))
    }
    return yieldsForDurationCache[durationIndex];
}

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

export function getYieldsForDate(date) {
    return allYields[util.binarySearch(allYields, date.getTime(), function (a, b) {
        if (a[0] > b) {
            return 1;
        }
        if (a[0] === b) {
            return 0;
        }
        return -1;
    })].slice(1);
}

export function isNumber(number) {
    return number !== null && !isNaN(number);
}



