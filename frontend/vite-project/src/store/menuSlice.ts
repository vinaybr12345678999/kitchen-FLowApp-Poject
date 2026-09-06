import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMenuItems, type MenuItem } from "../services/menuItemService";

interface MenuItemState {
    menuItems: MenuItem[];
    loading: boolean;
    error: string | null;
}

const initialState: MenuItemState = {
    menuItems: [],
    loading: false,
    error: null,
};

// Fetch menu items
export const fetchMenuItems = createAsyncThunk(
    "menuItems/fetchMenuItems",
    async () => {
        const menuItems = await getMenuItems();
        return menuItems;
    }
);

const menuItemSlice = createSlice({
    name: "menuItems",
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchMenuItems.fulfilled, (state, action) => {
                state.loading = false;
                state.menuItems = action.payload;
            })

            .addCase(fetchMenuItems.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to fetch menu items";
            });
    },
});

export const { clearError } = menuItemSlice.actions;

export default menuItemSlice.reducer;