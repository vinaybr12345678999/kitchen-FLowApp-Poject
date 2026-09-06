import api from "./api";

export interface Table {
    _id: string;
    tableNumber: number;
    status: "AVAILABLE" | "OCCUPIED";
}

// Get all tables
export const getTables = async (): Promise<Table[]> => {
    const response = await api.get("/tables");
    return response.data;
};
// Create a new table
export const createTable = async (data: {
    tableNumber: number;
    status: "AVAILABLE" | "OCCUPIED";
}) => {
    const response = await api.post("/tables", data);
    return response.data;
};

// Update table status
export const updateTableStatus = async (
    id: string,
    status: "AVAILABLE" | "OCCUPIED"
) => {
    const response = await api.patch(
        `/tables/${id}/status`,
        { status }
    );

    return response.data;
};