import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers';

const initialState = {};
const middlewear = [];
const store = createStore(rootReducer, initialState, applyMiddleware(...middlewear));

export default store;


