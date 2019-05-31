import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import Main from './pages/main/main'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import reducers from './reducers/index'

const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={store}>
        <Main/>
    </Provider>
    , document.getElementById('root'))