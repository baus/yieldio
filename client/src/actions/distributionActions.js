import {TOGGLE_TRIM_DISTRIBUTION} from "./types";

export function toggleTrimDistribution(trimState) {
    return {
        type: TOGGLE_TRIM_DISTRIBUTION, trimState
    };
}