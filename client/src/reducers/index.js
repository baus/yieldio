import {combineReducers} from 'redux';
import distributionReducer from './distributionReducer';
import spreadReducer from './spreadReducer';

export default combineReducers({
    distribution: distributionReducer,
    spread: spreadReducer
});