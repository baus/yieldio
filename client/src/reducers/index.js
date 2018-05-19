import {combineReducers} from 'redux';
import distributionReducer from './distributionReducer';

export default combineReducers({
   distribution: distributionReducer
});