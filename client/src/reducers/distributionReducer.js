import {TOGGLE_TRIM_DISTRIBUTION} from "../actions/types";

const initialState = {
    trim: true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_TRIM_DISTRIBUTION:
            return {
                ...state,
                trim: !state.trim
            }
        default:
            return state;
    }
}