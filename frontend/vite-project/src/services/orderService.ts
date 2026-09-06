import api from "./api";

export const createOrder = async (orderData: {
    tableId: string;
    tableNumber: number;
    items: {
        menuItemId: string;
        name: string;
        price: number;
        quantity: number;
        instructions?: string;
    }[];
}) => {
    const response = await api.post("/orders", orderData);

    return response.data;
};

export const getActiveOrders = async () => {
    const response = await api.get("/orders/active");

    return response.data;
};

export const updateOrderStatus = async (
    orderId: string,
    status: "NEW" | "PREPARING" | "READY" | "SERVED"
) => {
    const response = await api.patch(
        `/orders/${orderId}/status`,
        { status }
    );

    return response.data;
};