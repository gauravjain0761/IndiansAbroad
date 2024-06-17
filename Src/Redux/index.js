import {combineReducers, createStore, applyMiddleware} from 'redux';
import common from './Common';
import thunk from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';
// const reducers = combineReducers({common});
// const store = createStore(reducers, applyMiddleware(thunk));
// const store = configureStore({common}, applyMiddleware(thunk));
const reducers = combineReducers({common});
const middleware = [thunk];
const store = configureStore({reducer: reducers, middleware});

export default store;

// const rootReducer = combineReducers(
//     { common: common }
//     );
//     const configureStore = () => {
//     return createStore(rootReducer, applyMiddleware(thunk));
//     }
