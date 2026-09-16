
import { useEffect, useState } from "react";
import {
    getActiveOrders,
    updateOrderStatus,
} from "../services/orderService";
import { useNavigate } from "react-router-dom";
import "../styles/Kitchen.css";

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
    const navigate = useNavigate();

    const [orders, setOrders] = useState<KitchenOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingOrder, setUpdatingOrder] =
        useState<string | null>(null);

    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {
        localStorage.removeItem("token");

        // If you are storing user data, remove it too
        localStorage.removeItem("user");

        navigate("/login");
    };

    // ========================================
    // FETCH ACTIVE ORDERS
    // ========================================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getActiveOrders();

            setOrders(data);
        } catch (error: any) {
            console.error(
                "Failed to fetch orders:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to fetch kitchen orders"
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // UPDATE ORDER STATUS
    // ========================================

    const handleStatusChange = async (
        orderId: string,
        status: "PREPARING" | "READY"
    ) => {
        try {
            setUpdatingOrder(orderId);
            setError("");

            await updateOrderStatus(
                orderId,
                status
            );

            await fetchOrders();
        } catch (error: any) {
            console.error(
                "Failed to update order:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to update order status"
            );
        } finally {
            setUpdatingOrder(null);
        }
    };

    // ========================================
    // LOAD ORDERS
    // ========================================

    useEffect(() => {
        fetchOrders();
    }, []);

    // ========================================
    // LOADING
    // ========================================

    if (loading) {
        return (
            <div className="kitchen-page">
                <header className="kitchen-header">
                    <div className="kitchen-header-inner">
                        <div>
                            <h2 className="kitchen-logo">
                                🍳 KitchenFlow
                            </h2>
                            <span className="kitchen-role">
                                Kitchen Dashboard
                            </span>
                        </div>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            ↪ Logout
                        </button>
                    </div>
                </header>

                <div className="kitchen-container">
                    <div className="kitchen-loading">
                        Loading kitchen orders...
                    </div>
                </div>
            </div>
        );
    }

    // ========================================
    // UI
    // ========================================

    return (
        <div className="kitchen-page">

            {/* ========================================
                HEADER
            ======================================== */}

            <header className="kitchen-header">
                <div className="kitchen-header-inner">

                    <div className="kitchen-brand">
                        <div className="kitchen-icon">
                            🍳
                        </div>

                        <div>
                            <h2 className="kitchen-logo">
                                KitchenFlow
                            </h2>

                            <span className="kitchen-role">
                                Kitchen Dashboard
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <span className="logout-icon">
                            ↪
                        </span>
                        Logout
                    </button>

                </div>
            </header>

            {/* ========================================
                MAIN
            ======================================== */}

            <main className="kitchen-container">

                <div className="kitchen-page-heading">
                    <div>
                        <h1>
                            Kitchen Orders
                        </h1>

                        <p>
                            Manage incoming orders
                            and update their status.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="refresh-button"
                        onClick={fetchOrders}
                    >
                        ↻ Refresh
                    </button>
                </div>

                {/* ERROR */}

                {error && (
                    <div className="kitchen-error">
                        ⚠ {error}
                    </div>
                )}

                {/* NO ORDERS */}

                {orders.length === 0 ? (
                    <div className="no-orders-card">
                        <div className="no-orders-icon">
                            🍽️
                        </div>

                        <h2>
                            No Active Orders
                        </h2>

                        <p>
                            New orders will appear
                            here when customers place
                            them.
                        </p>
                    </div>
                ) : (
                    <div className="kitchen-orders-grid">

                        {orders.map((order) => (

                            <div
                                key={order._id}
                                className={`kitchen-order-card ${order.status.toLowerCase()}`}
                            >

                                {/* CARD HEADER */}

                                <div className="order-card-header">

                                    <div>
                                        <span className="order-label">
                                            ORDER
                                        </span>

                                        <h2>
                                            Table{" "}
                                            {order.tableNumber}
                                        </h2>
                                    </div>

                                    <span
                                        className={`status-badge ${order.status.toLowerCase()}`}
                                    >
                                        {order.status}
                                    </span>

                                </div>

                                {/* ITEMS */}

                                <div className="order-items">

                                    {order.items.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                key={index}
                                                className="kitchen-item"
                                            >

                                                <div className="item-main">

                                                    <div className="item-name">
                                                        {
                                                            item.name
                                                        }
                                                    </div>

                                                    <div className="item-quantity">
                                                        ×{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </div>

                                                </div>

                                                {item.instructions && (
                                                    <div className="item-instructions">
                                                        <strong>
                                                            Note:
                                                        </strong>{" "}
                                                        {
                                                            item.instructions
                                                        }
                                                    </div>
                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                                {/* ACTION */}

                                <div className="order-action">

                                    {order.status ===
                                        "NEW" && (
                                        <button
                                            type="button"
                                            className="prepare-button"
                                            onClick={() =>
                                                handleStatusChange(
                                                    order._id,
                                                    "PREPARING"
                                                )
                                            }
                                            disabled={
                                                updatingOrder ===
                                                order._id
                                            }
                                        >
                                            {updatingOrder ===
                                            order._id
                                                ? "Updating..."
                                                : "👨‍🍳 Start Preparing"}
                                        </button>
                                    )}

                                    {order.status ===
                                        "PREPARING" && (
                                        <button
                                            type="button"
                                            className="ready-button"
                                            onClick={() =>
                                                handleStatusChange(
                                                    order._id,
                                                    "READY"
                                                )
                                            }
                                            disabled={
                                                updatingOrder ===
                                                order._id
                                            }
                                        >
                                            {updatingOrder ===
                                            order._id
                                                ? "Updating..."
                                                : "✓ Mark Ready"}
                                        </button>
                                    )}

                                    {order.status ===
                                        "READY" && (
                                        <div className="ready-message">
                                            ✓ Order Ready
                                        </div>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </main>
        </div>
    );
};

export default Kitchen;
