import {CHANGE_LEFT_SPREAD_DURATION, CHANGE_RIGHT_SPREAD_DURATION} from "./types";

export function changeLeftSpreadDuration(duration) {
    return {
        type: CHANGE_LEFT_SPREAD_DURATION, duration
    };
}

export function changeRightSpreadDuration(duration) {
    return {
        type: CHANGE_RIGHT_SPREAD_DURATION, duration
    };
}

