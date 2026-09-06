import { configureStore } from "@reduxjs/toolkit";

import tableReducer from "./tableSlice";
import menuItemReducer from "./menuSlice";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        tables: tableReducer,
        menuItems: menuItemReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;