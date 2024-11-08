import { configureStore } from '@reduxjs/toolkit';
import authAdminReducer from "../fitur/AuthSlice";

export const store = configureStore({
    reducer: {
      authAdmin: authAdminReducer
    },
  });
  