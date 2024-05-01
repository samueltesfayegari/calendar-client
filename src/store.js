import { configureStore } from '@reduxjs/toolkit'; // Import configureStore from Redux Toolkit
import reducers from './reducers'; // Import your combined reducers

const store = configureStore({
  reducer: reducers, // Pass the combined reducers to the store
});

export default store;

// import { createStore, applyMiddleware } from 'redux';
// import { thunk } from 'redux-thunk'; // Import thunk from redux-thunk

// import reducers from './reducers'; // Import your combined reducers

// const store = createStore(reducers, applyMiddleware(thunk));

// export default store;
