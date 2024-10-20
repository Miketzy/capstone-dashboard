// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import {apiSlice} from "././api/Slice"
import authReducer from "../features/auth/authSlice"; // Adjust this path if needed

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});
