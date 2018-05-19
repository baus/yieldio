import {CHANGE_LEFT_SPREAD_DURATION, CHANGE_RIGHT_SPREAD_DURATION} from "../actions/types";

const initialState = {
    leftDuration: 360,
    rightDuration: 120
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CHANGE_LEFT_SPREAD_DURATION:
            return {
                ...state,
                leftDuration: action.duration
            };
        case CHANGE_RIGHT_SPREAD_DURATION:
            return {
                ...state,
                rightDuration: action.duration
            };
        default:
            return state;
    }
}