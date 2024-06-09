import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import channelReducer from '../features/channelSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        channel: channelReducer,
    },
});