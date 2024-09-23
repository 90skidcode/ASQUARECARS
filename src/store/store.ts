import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import userSlice from './userSlice';


// Define the persistConfig
const persistConfig = {
  key: 'root', // key used to persist the root reducer
  storage, // storage mechanism to use (e.g., localStorage)
};

// Create the persisted reducer
const rootReducer = combineReducers({
  user: userSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
