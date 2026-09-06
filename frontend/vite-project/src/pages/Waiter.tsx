import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchTables } from "../store/tableSlice";
import { useNavigate } from "react-router-dom";
import {
    getActiveOrders,
    updateOrderStatus,
} from "../services/orderService";
import "../styles/Waiter.css";

interface WaiterOrder {
    _id: string;
    tableId: string;
    tableNumber: number;
    items: {
        name: string;
        quantity: number;
        instructions?: string;
    }[];
    status: "NEW" | "PREPARING" | "READY";
}

const Waiter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { tables, loading, error } = useSelector(
        (state: RootState) => state.tables
    );

    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [tableMessage, setTableMessage] = useState<string>("");

    const [orders, setOrders] = useState<WaiterOrder[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [orderError, setOrderError] = useState("");
    const [servingOrder, setServingOrder] = useState<string | null>(null);

    // Fetch tables
    useEffect(() => {
        dispatch(fetchTables());
    }, [dispatch]);

    // Fetch active orders
    const fetchOrders = async () => {
        try {
            setOrdersLoading(true);
            setOrderError("");

            const data = await getActiveOrders();

            setOrders(data);
        } catch (error: any) {
            console.error("Failed to fetch orders:", error);

            setOrderError(
                error.response?.data?.message ||
                    "Failed to fetch orders"
            );
        } finally {
            setOrdersLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Automatically check order status every 5 seconds
        const interval = setInterval(() => {
            fetchOrders();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Select table
    const handleTableSelect = (
        tableId: string,
        status: "AVAILABLE" | "OCCUPIED"
    ) => {
        if (status === "OCCUPIED") {
            setTableMessage(
                "Table is occupied, choose another table."
            );
            return;
        }

        setSelectedTable(tableId);
        setTableMessage("");

        const selectedTableData = tables.find(
            (table) => table._id === tableId
        );

        if (!selectedTableData) {
            return;
        }

        navigate(
            `/menu?tableId=${tableId}&tableNumber=${selectedTableData.tableNumber}`
        );
    };

    // Serve order
    const handleServeOrder = async (orderId: string) => {
        try {
            setServingOrder(orderId);
            setOrderError("");

            await updateOrderStatus(orderId, "SERVED");

            // Refresh tables and orders
            await fetchOrders();
            dispatch(fetchTables());
        } catch (error: any) {
            console.error("Failed to serve order:", error);

            setOrderError(
                error.response?.data?.message ||
                    "Failed to serve order"
            );
        } finally {
            setServingOrder(null);
        }
    };

    const selectedTableNumber = tables.find(
        (table) => table._id === selectedTable
    )?.tableNumber;

    if (loading) {
        return (
            <div className="waiter-page">
                <div className="container waiter-container">
                    <h2 className="text-center waiter-title">
                        Loading tables...
                    </h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="waiter-page">
                <div className="container waiter-container">
                    <h2 className="text-center waiter-title">
                        {error}
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="waiter-page">
            <div className="container waiter-container">

                {/* Heading */}
                <div className="text-center mb-4">
                    <h1 className="waiter-title">
                        Select a Table
                    </h1>

                    <p className="waiter-subtitle">
                        Choose an available table to take an order.
                    </p>
                </div>

                {/* Tables */}
                {tables.length === 0 ? (
                    <p className="text-center waiter-subtitle">
                        No tables available.
                    </p>
                ) : (
                    <div className="row g-4">
                        {tables.map((table) => (
                            <div
                                key={table._id}
                                className="col-12 col-sm-6 col-md-4 col-lg-3"
                            >
                                <div
                                    className={`table-card ${
                                        table.status === "AVAILABLE"
                                            ? "available"
                                            : "occupied"
                                    } ${
                                        selectedTable === table._id
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleTableSelect(
                                            table._id,
                                            table.status
                                        )
                                    }
                                >
                                    <div className="table-number">
                                        Table {table.tableNumber}
                                    </div>

                                    <p className="table-status">
                                        {table.status === "AVAILABLE"
                                            ? "✓ AVAILABLE"
                                            : "🔒 OCCUPIED"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Occupied message */}
                {tableMessage && (
                    <div className="table-occupied-message text-center mt-4">
                        {tableMessage}
                    </div>
                )}

                {/* Selected table */}
                {selectedTable && (
                    <div className="table-selected-message text-center mt-4">
                        ✓ Table {selectedTableNumber} selected
                    </div>
                )}

                {/* Orders Section */}
                <div className="mt-5">

                    <h2 className="text-center mb-4">
                        My Active Orders
                    </h2>

                    {ordersLoading ? (
                        <p className="text-center">
                            Loading orders...
                        </p>
                    ) : orderError ? (
                        <p
                            className="text-center"
                            style={{ color: "red" }}
                        >
                            {orderError}
                        </p>
                    ) : orders.length === 0 ? (
                        <p className="text-center">
                            No active orders.
                        </p>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order._id}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "20px",
                                    marginBottom: "20px",
                                    borderRadius: "10px",
                                    backgroundColor: "#fff",
                                }}
                            >
                                <h3>
                                    Table {order.tableNumber}
                                </h3>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    {order.status}
                                </p>

                                {/* Items */}
                                {order.items.map(
                                    (item, index) => (
                                        <div key={index}>
                                            <p>
                                                <strong>
                                                    {item.name}
                                                </strong>
                                            </p>

                                            <p>
                                                Quantity:{" "}
                                                {item.quantity}
                                            </p>

                                            {item.instructions && (
                                                <p>
                                                    Instructions:{" "}
                                                    {
                                                        item.instructions
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )
                                )}

                                {/* Serve button */}
                                {order.status === "READY" && (
                                    <button
                                        onClick={() =>
                                            handleServeOrder(
                                                order._id
                                            )
                                        }
                                        disabled={
                                            servingOrder ===
                                            order._id
                                        }
                                        style={{
                                            marginTop: "10px",
                                            padding: "10px 20px",
                                            backgroundColor:
                                                "green",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {servingOrder ===
                                        order._id
                                            ? "Serving..."
                                            : "Serve Order"}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Waiter;