import { combineReducers } from 'redux'

import structReducer from './structReducer'
import pageReducer from './pageReducer';

export default combineReducers({
    structProps: structReducer,
    pageProps: pageReducer
});