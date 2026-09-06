import api from "./api";

export interface MenuItem {
_id: string;
name: string;
category: string;
price: number;
isAvailable: boolean;
image?: string;
}

// Get all menu items
export const getMenuItems = async (): Promise<MenuItem[]> => {
const response = await api.get("/menu-items");
return response.data;
};

// Create menu item
export const createMenuItem = async (data: {
name: string;
category: string;
price: number;
isAvailable: boolean;
image?: string;
}) => {
const response = await api.post("/menu-items", data);
return response.data;
};

// Update whole menu item
export const updateMenuItem = async (
id: string,
data: {
name?: string;
category?: string;
price?: number;
isAvailable?: boolean;
image?: string;
}
) => {
const response = await api.patch(`/menu-items/${id}`, data);
return response.data;
};

// Delete menu item
export const deleteMenuItem = async (id: string) => {
const response = await api.delete(`/menu-items/${id}`);
return response.data;
};
