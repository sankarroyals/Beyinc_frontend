import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from './AuthReducers/AuthReducer';


const store = configureStore({
  reducer: {
    auth: AuthReducer
  },
});

export default store;
