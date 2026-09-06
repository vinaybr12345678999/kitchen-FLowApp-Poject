import { useEffect, useState } from "react";
import {
    getActiveOrders,
    updateOrderStatus,
} from "../services/orderService";

interface KitchenItem {
    name: string;
    quantity: number;
    instructions?: string;
}

interface KitchenOrder {
    _id: string;
    tableNumber: number;
    items: KitchenItem[];
    status: "NEW" | "PREPARING" | "READY";
}

const Kitchen = () => {
    const [orders, setOrders] = useState<KitchenOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

    // Fetch active orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getActiveOrders();

            setOrders(data);
        } catch (error: any) {
            console.error("Failed to fetch orders:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to fetch kitchen orders"
            );
        } finally {
            setLoading(false);
        }
    };

    // Update order status
    const handleStatusChange = async (
        orderId: string,
        status: "PREPARING" | "READY"
    ) => {
        try {
            setUpdatingOrder(orderId);
            setError("");

            await updateOrderStatus(orderId, status);

            // Get latest orders
            await fetchOrders();
        } catch (error: any) {
            console.error("Failed to update order:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to update order status"
            );
        } finally {
            setUpdatingOrder(null);
        }
    };

    // Load orders when page opens
    useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
        fetchOrders();
    }, 15000);

    return () => {
        clearInterval(interval);
    };
}, []);

    // Loading
    if (loading) {
        return <p>Loading kitchen orders...</p>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Kitchen Screen</h1>

            {/* Refresh
            <button onClick={fetchOrders}>
                Refresh Orders
            </button> */}

            {/* Error */}
            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {/* No orders */}
            {orders.length === 0 ? (
                <p>No active orders.</p>
            ) : (
                orders.map((order) => (
                    <div
                        key={order._id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "20px",
                            margin: "20px 0",
                            borderRadius: "10px",
                            maxWidth: "500px",
                        }}
                    >
                        {/* Table */}
                        <h2>
                            Table {order.tableNumber}
                        </h2>

                        {/* Status */}
                        <p>
                            <strong>Status:</strong>{" "}
                            {order.status}
                        </p>

                        {/* Items */}
                        {order.items.map((item, index) => (
                            <div key={index}>
                                <p>
                                    <strong>
                                        {item.name}
                                    </strong>
                                </p>

                                <p>
                                    Quantity: {item.quantity}
                                </p>

                                {item.instructions && (
                                    <p>
                                        <strong>
                                            Instructions:
                                        </strong>{" "}
                                        {item.instructions}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* NEW → PREPARING */}
                        {order.status === "NEW" && (
                            <button
                                onClick={() =>
                                    handleStatusChange(
                                        order._id,
                                        "PREPARING"
                                    )
                                }
                                disabled={
                                    updatingOrder === order._id
                                }
                            >
                                {updatingOrder === order._id
                                    ? "Updating..."
                                    : "Start Preparing"}
                            </button>
                        )}

                        {/* PREPARING → READY */}
                        {order.status === "PREPARING" && (
                            <button
                                onClick={() =>
                                    handleStatusChange(
                                        order._id,
                                        "READY"
                                    )
                                }
                                disabled={
                                    updatingOrder === order._id
                                }
                            >
                                {updatingOrder === order._id
                                    ? "Updating..."
                                    : "Mark Ready"}
                            </button>
                        )}

                        {/* READY */}
                        {order.status === "READY" && (
                            <p
                                style={{
                                    color: "green",
                                    fontWeight: "bold",
                                }}
                            >
                                ✓ Order Ready
                            </p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Kitchen;