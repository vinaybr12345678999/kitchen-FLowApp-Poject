import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getTables, type Table } from "../services/tableService";
//

interface TableState {
    tables: Table[];
    loading: boolean;
    error: string | null;
}

const initialState: TableState = {
    tables: [],
    loading: false,
    error: null,
};

// Fetch tables from backend
export const fetchTables = createAsyncThunk(
    "tables/fetchTables",
    async () => {
        return await getTables();
    }
);

const tableSlice = createSlice({
    name: "tables",
    initialState,

    reducers: {
        setTables: (state, action: PayloadAction<Table[]>) => {
            state.tables = action.payload;
        },

        setTableLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setTableError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        clearTableError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchTables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchTables.fulfilled, (state, action) => {
                state.loading = false;
                state.tables = action.payload;
            })

            .addCase(fetchTables.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to fetch tables";
            });
    },
});

export const {
    setTables,
    setTableLoading,
    setTableError,
    clearTableError,
} = tableSlice.actions;

export default tableSlice.reducer;