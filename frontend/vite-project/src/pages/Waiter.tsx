// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../store/store";
// import { fetchTables } from "../store/tableSlice";
// import { useNavigate } from "react-router-dom";
// import {
//     getActiveOrders,
//     updateOrderStatus,
// } from "../services/orderService";
// import "../styles/Waiter.css";

// interface WaiterOrder {
//     _id: string;
//     tableId: string;
//     tableNumber: number;
//     items: {
//         name: string;
//         quantity: number;
//         instructions?: string;
//     }[];
//     status:
//         | "NEW"
//         | "PREPARING"
//         | "READY"
//         | "SERVED";
// }

// interface Table {
//     _id: string;
//     tableNumber: number;
//     status: "AVAILABLE" | "OCCUPIED";
// }

// const Waiter = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     const { tables, loading, error } = useSelector(
//         (state: RootState) => state.tables
//     );

//     const [selectedTable, setSelectedTable] =
//         useState<string | null>(null);

//     const [tableMessage, setTableMessage] =
//         useState("");

//     const [orders, setOrders] =
//         useState<WaiterOrder[]>([]);

//     const [ordersLoading, setOrdersLoading] =
//         useState(true);

//     const [orderError, setOrderError] =
//         useState("");

//     const [servingOrder, setServingOrder] =
//         useState<string | null>(null);

//     // =====================================================
//     // LOGOUT
//     // =====================================================

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("role");

//         navigate("/login", {
//             replace: true,
//         });
//     };

//     // =====================================================
//     // FETCH TABLES
//     // =====================================================

//     useEffect(() => {
//         dispatch(fetchTables());
//     }, [dispatch]);

//     // =====================================================
//     // FETCH ACTIVE ORDERS
//     // =====================================================

//     const fetchOrders = async () => {
//         try {
//             setOrdersLoading(true);
//             setOrderError("");

//             const data =
//                 await getActiveOrders();

//             const waiterOrders =
//                 data.filter(
//                     (order: WaiterOrder) =>
//                         order.status === "NEW" ||
//                         order.status === "PREPARING" ||
//                         order.status === "READY"
//                 );

//             setOrders(waiterOrders);
//         } catch (error: any) {
//             console.error(
//                 "Failed to fetch orders:",
//                 error
//             );

//             setOrderError(
//                 error.response?.data?.message ||
//                     "Failed to fetch orders"
//             );
//         } finally {
//             setOrdersLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     // =====================================================
//     // SELECT TABLE
//     // =====================================================

//     const handleTableSelect = (
//         tableId: string,
//         status: "AVAILABLE" | "OCCUPIED"
//     ) => {
//         const selectedTableData =
//             tables.find(
//                 (table: Table) =>
//                     table._id === tableId
//             );

//         if (!selectedTableData) {
//             return;
//         }

//         setSelectedTable(tableId);
//         setTableMessage("");

//         if (status === "OCCUPIED") {
//             setTableMessage(
//                 `Table ${selectedTableData.tableNumber} is occupied. You can add an extra order.`
//             );
//         }

//        sessionStorage.setItem("tableId", tableId);
// sessionStorage.setItem(
//     "tableNumber",
//     String(selectedTableData.tableNumber)
// );

// navigate("/menu");
//     };

//     // =====================================================
//     // SERVE ORDER
//     // =====================================================

//     const handleServeOrder = async (
//         orderId: string
//     ) => {
//         try {
//             setServingOrder(orderId);
//             setOrderError("");

//             await updateOrderStatus(
//                 orderId,
//                 "SERVED"
//             );

//             setOrders(
//                 (previousOrders) =>
//                     previousOrders.filter(
//                         (order) =>
//                             order._id !==
//                             orderId
//                     )
//             );

//             await dispatch(
//                 fetchTables()
//             );

//             await fetchOrders();
//         } catch (error: any) {
//             console.error(
//                 "Failed to serve order:",
//                 error
//             );

//             setOrderError(
//                 error.response?.data?.message ||
//                     "Failed to serve order"
//             );
//         } finally {
//             setServingOrder(null);
//         }
//     };

//     // =====================================================
//     // SELECTED TABLE NUMBER
//     // =====================================================

//     const selectedTableNumber =
//         tables.find(
//             (table: Table) =>
//                 table._id === selectedTable
//         )?.tableNumber;

//     // =====================================================
//     // LOADING
//     // =====================================================

//     if (loading) {
//         return (
//             <div className="waiter-page">

//                 <header className="waiter-header">
//                     <div className="waiter-header-inner">

//                         <div className="waiter-brand">

//                             <div className="waiter-brand-icon">
//                                 KF
//                             </div>

//                             <div>
//                                 <h2>
//                                     KitchenFlow
//                                 </h2>

//                                 <span>
//                                     Waiter Dashboard
//                                 </span>
//                             </div>

//                         </div>

//                         <button
//                             type="button"
//                             className="logout-button"
//                             onClick={handleLogout}
//                         >
//                             <span>↪</span>
//                             Logout
//                         </button>

//                     </div>
//                 </header>

//                 <main className="waiter-main">

//                     <div className="container waiter-container">

//                         <h2 className="text-center waiter-title">
//                             Loading tables...
//                         </h2>

//                     </div>

//                 </main>

//             </div>
//         );
//     }

//     // =====================================================
//     // ERROR
//     // =====================================================

//     if (error) {
//         return (
//             <div className="waiter-page">

//                 <header className="waiter-header">
//                     <div className="waiter-header-inner">

//                         <div className="waiter-brand">

//                             <div className="waiter-brand-icon">
//                                 KF
//                             </div>

//                             <div>
//                                 <h2>
//                                     KitchenFlow
//                                 </h2>

//                                 <span>
//                                     Waiter Dashboard
//                                 </span>
//                             </div>

//                         </div>

//                         <button
//                             type="button"
//                             className="logout-button"
//                             onClick={handleLogout}
//                         >
//                             <span>↪</span>
//                             Logout
//                         </button>

//                     </div>
//                 </header>

//                 <main className="waiter-main">

//                     <div className="container waiter-container">

//                         <h2 className="text-center waiter-title">
//                             {error}
//                         </h2>

//                     </div>

//                 </main>

//             </div>
//         );
//     }

//     // =====================================================
//     // MAIN UI
//     // =====================================================

//     return (
//         <div className="waiter-page">

//             {/* HEADER */}

//             <header className="waiter-header">

//                 <div className="waiter-header-inner">

//                     <div className="waiter-brand">

//                         <div className="waiter-brand-icon">
//                             KF
//                         </div>

//                         <div className="waiter-brand-text">

//                             <h2>
//                                 KitchenFlow
//                             </h2>

//                             <span>
//                                 Waiter Dashboard
//                             </span>

//                         </div>

//                     </div>

//                     <button
//                         type="button"
//                         className="logout-button"
//                         onClick={handleLogout}
//                     >
//                         <span className="logout-icon">
//                             ↪
//                         </span>

//                         <span>
//                             Logout
//                         </span>
//                     </button>

//                 </div>

//             </header>

//             {/* MAIN */}

//             <main className="waiter-main">

//                 <div className="container waiter-container">

//                     {/* PAGE HEADING */}

//                     <div className="text-center mb-4">

//                         <div className="dashboard-badge">
//                             WAITER PANEL
//                         </div>

//                         <h1 className="waiter-title">
//                             Select a Table
//                         </h1>

//                         <p className="waiter-subtitle">
//                             Select an available table
//                             for a new order or an
//                             occupied table for an
//                             extra order.
//                         </p>

//                     </div>

//                     {/* TABLES */}

//                     {tables.length === 0 ? (

//                         <p className="text-center waiter-subtitle">
//                             No tables available.
//                         </p>

//                     ) : (

//                         <div className="row g-4">

//                             {tables.map(
//                                 (table: Table) => (

//                                     <div
//                                         key={table._id}
//                                         className="col-12 col-sm-6 col-md-4 col-lg-3"
//                                     >

//                                         {/* TABLE CARD ONLY */}

//                                         <div
//                                             className={`table-card ${
//                                                 table.status ===
//                                                 "AVAILABLE"
//                                                     ? "available"
//                                                     : "occupied"
//                                             } ${
//                                                 selectedTable ===
//                                                 table._id
//                                                     ? "selected"
//                                                     : ""
//                                             }`}
//                                             onClick={() =>
//                                                 handleTableSelect(
//                                                     table._id,
//                                                     table.status
//                                                 )
//                                             }
//                                         >

//                                             <div className="table-icon">
//                                                 🪑
//                                             </div>

//                                             <div className="table-number">
//                                                 Table{" "}
//                                                 {
//                                                     table.tableNumber
//                                                 }
//                                             </div>

//                                             <p className="table-status">

//                                                 {table.status ===
//                                                 "AVAILABLE"
//                                                     ? "✓ AVAILABLE"
//                                                     : "🔒 OCCUPIED"}

//                                             </p>

//                                             {table.status ===
//                                                 "OCCUPIED" && (
//                                                 <p className="extra-order-text">
//                                                     + Extra Order
//                                                 </p>
//                                             )}

//                                         </div>

//                                     </div>

//                                 )
//                             )}

//                         </div>

//                     )}

//                     {/* TABLE MESSAGE */}

//                     {tableMessage && (
//                         <div className="table-occupied-message text-center mt-4">
//                             {tableMessage}
//                         </div>
//                     )}

//                     {/* SELECTED TABLE */}

//                     {selectedTable && (
//                         <div className="table-selected-message text-center mt-4">
//                             ✓ Table{" "}
//                             {selectedTableNumber}{" "}
//                             selected
//                         </div>
//                     )}

//                     {/* ACTIVE ORDERS */}

//                     <div className="orders-section mt-5">

//                         <div className="section-heading">

//                             <div>

//                                 <span className="section-label">
//                                     LIVE ORDERS
//                                 </span>

//                                 <h2>
//                                     Active Orders
//                                 </h2>

//                             </div>

//                             <div className="order-count">
//                                 {orders.length}
//                             </div>

//                         </div>

//                         {ordersLoading ? (

//                             <p className="text-center">
//                                 Loading orders...
//                             </p>

//                         ) : orderError ? (

//                             <p
//                                 className="text-center"
//                                 style={{
//                                     color: "red",
//                                 }}
//                             >
//                                 {orderError}
//                             </p>

//                         ) : orders.length === 0 ? (

//                             <div className="no-orders">

//                                 <div className="no-orders-icon">
//                                     ✓
//                                 </div>

//                                 <h4>
//                                     No active orders
//                                 </h4>

//                                 <p>
//                                     New orders will appear
//                                     here automatically.
//                                 </p>

//                             </div>

//                         ) : (

//                             orders.map(
//                                 (order) => (

//                                     <div
//                                         key={order._id}
//                                         className="order-card"
//                                     >

//                                         <div className="order-card-header">

//                                             <div>

//                                                 <span className="order-table-label">
//                                                     TABLE
//                                                 </span>

//                                                 <h3>
//                                                     Table{" "}
//                                                     {
//                                                         order.tableNumber
//                                                     }
//                                                 </h3>

//                                             </div>

//                                             <span
//                                                 className={`order-status ${order.status.toLowerCase()}`}
//                                             >
//                                                 {order.status}
//                                             </span>

//                                         </div>

//                                         <hr />

//                                         {order.items.map(
//                                             (
//                                                 item,
//                                                 index
//                                             ) => (

//                                                 <div
//                                                     key={
//                                                         index
//                                                     }
//                                                     className="order-item"
//                                                 >

//                                                     <div>

//                                                         <strong>
//                                                             {
//                                                                 item.name
//                                                             }
//                                                         </strong>

//                                                         {item.instructions && (
//                                                             <p>
//                                                                 <strong>
//                                                                     Instructions:
//                                                                 </strong>{" "}
//                                                                 {
//                                                                     item.instructions
//                                                                 }
//                                                             </p>
//                                                         )}

//                                                     </div>

//                                                     <span className="item-quantity">
//                                                         ×{" "}
//                                                         {
//                                                             item.quantity
//                                                         }
//                                                     </span>

//                                                 </div>

//                                             )
//                                         )}

//                                         {/* READY */}

//                                         {order.status ===
//                                             "READY" && (

//                                             <button
//                                                 type="button"
//                                                 className="serve-button"
//                                                 onClick={() =>
//                                                     handleServeOrder(
//                                                         order._id
//                                                     )
//                                                 }
//                                                 disabled={
//                                                     servingOrder ===
//                                                     order._id
//                                                 }
//                                             >

//                                                 {servingOrder ===
//                                                 order._id
//                                                     ? "Serving..."
//                                                     : "✓ Serve Order"}

//                                             </button>

//                                         )}

//                                         {/* NEW */}

//                                         {order.status ===
//                                             "NEW" && (

//                                             <div className="order-info new-info">
//                                                 🔵 Waiting for kitchen
//                                             </div>

//                                         )}

//                                         {/* PREPARING */}

//                                         {order.status ===
//                                             "PREPARING" && (

//                                             <div className="order-info preparing-info">
//                                                 👨‍🍳 Kitchen is preparing
//                                             </div>

//                                         )}

//                                     </div>

//                                 )
//                             )

//                         )}

//                     </div>

//                 </div>

//             </main>

//             {/* FOOTER */}

//             <footer className="waiter-footer">

//                 <div className="waiter-footer-inner">

//                     <div>

//                         <strong>
//                             KitchenFlow
//                         </strong>

//                         <span>
//                             Waiter Dashboard
//                         </span>

//                     </div>

//                     <p>
//                         ©{" "}
//                         {new Date().getFullYear()}{" "}
//                         KitchenFlow.
//                         All rights reserved.
//                     </p>

//                 </div>

//             </footer>

//         </div>
//     );
// };

// export default Waiter;
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
import { QRCodeCanvas } from "qrcode.react";

interface WaiterOrder {
    _id: string;
    tableId: string;
    tableNumber: number;
    items: {
        name: string;
        quantity: number;
        instructions?: string;
    }[];
    status:
        | "NEW"
        | "PREPARING"
        | "READY"
        | "SERVED";
}

interface Table {
    _id: string;
    tableNumber: number;
    status: "AVAILABLE" | "OCCUPIED";
}

const Waiter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // QR code URL for the customer menu
    const customerMenuUrl = "http://192.168.1.10:5173/menu";

    const { tables, loading, error } = useSelector(
        (state: RootState) => state.tables
    );

    const [selectedTable, setSelectedTable] =
        useState<string | null>(null);

    const [tableMessage, setTableMessage] =
        useState("");

    const [orders, setOrders] =
        useState<WaiterOrder[]>([]);

    const [ordersLoading, setOrdersLoading] =
        useState(true);

    const [orderError, setOrderError] =
        useState("");

    const [servingOrder, setServingOrder] =
        useState<string | null>(null);

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login", {
            replace: true,
        });
    };

    // =====================================================
    // FETCH TABLES
    // =====================================================

    useEffect(() => {
        dispatch(fetchTables());
    }, [dispatch]);

    // =====================================================
    // FETCH ACTIVE ORDERS
    // =====================================================

    const fetchOrders = async () => {
        try {
            setOrdersLoading(true);
            setOrderError("");

            const data =
                await getActiveOrders();

            const waiterOrders =
                data.filter(
                    (order: WaiterOrder) =>
                        order.status === "NEW" ||
                        order.status === "PREPARING" ||
                        order.status === "READY"
                );

            setOrders(waiterOrders);
        } catch (error: any) {
            console.error(
                "Failed to fetch orders:",
                error
            );

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
    }, []);

    // =====================================================
    // SELECT TABLE
    // =====================================================

    const handleTableSelect = (
        tableId: string,
        status: "AVAILABLE" | "OCCUPIED"
    ) => {
        const selectedTableData =
            tables.find(
                (table: Table) =>
                    table._id === tableId
            );

        if (!selectedTableData) {
            return;
        }

        setSelectedTable(tableId);
        setTableMessage("");

        if (status === "OCCUPIED") {
            setTableMessage(
                `Table ${selectedTableData.tableNumber} is occupied. You can add an extra order.`
            );
        }

       sessionStorage.setItem("tableId", tableId);
sessionStorage.setItem(
    "tableNumber",
    String(selectedTableData.tableNumber)
);

navigate("/menu");
    };

    // =====================================================
    // SERVE ORDER
    // =====================================================

    const handleServeOrder = async (
        orderId: string
    ) => {
        try {
            setServingOrder(orderId);
            setOrderError("");

            await updateOrderStatus(
                orderId,
                "SERVED"
            );

            setOrders(
                (previousOrders) =>
                    previousOrders.filter(
                        (order) =>
                            order._id !==
                            orderId
                    )
            );

            await dispatch(
                fetchTables()
            );

            await fetchOrders();
        } catch (error: any) {
            console.error(
                "Failed to serve order:",
                error
            );

            setOrderError(
                error.response?.data?.message ||
                    "Failed to serve order"
            );
        } finally {
            setServingOrder(null);
        }
    };

    // =====================================================
    // SELECTED TABLE NUMBER
    // =====================================================

    const selectedTableNumber =
        tables.find(
            (table: Table) =>
                table._id === selectedTable
        )?.tableNumber;

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="waiter-page">

                <header className="waiter-header">
                    <div className="waiter-header-inner">

                        <div className="waiter-brand">

                            <div className="waiter-brand-icon">
                                KF
                            </div>

                            <div>
                                <h2>
                                    KitchenFlow
                                </h2>

                                <span>
                                    Waiter Dashboard
                                </span>
                            </div>

                        </div>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            <span>↪</span>
                            Logout
                        </button>

                    </div>
                </header>

                <main className="waiter-main">

                    <div className="container waiter-container">

                        <h2 className="text-center waiter-title">
                            Loading tables...
                        </h2>

                    </div>

                </main>

            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div className="waiter-page">

                <header className="waiter-header">
                    <div className="waiter-header-inner">

                        <div className="waiter-brand">

                            <div className="waiter-brand-icon">
                                KF
                            </div>

                            <div>
                                <h2>
                                    KitchenFlow
                                </h2>

                                <span>
                                    Waiter Dashboard
                                </span>
                            </div>

                        </div>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            <span>↪</span>
                            Logout
                        </button>

                    </div>
                </header>

                <main className="waiter-main">

                    <div className="container waiter-container">

                        <h2 className="text-center waiter-title">
                            {error}
                        </h2>

                    </div>

                </main>

            </div>
        );
    }

    // =====================================================
    // MAIN UI
    // =====================================================

    return (
        <div className="waiter-page">

            {/* HEADER */}

            <header className="waiter-header">

                <div className="waiter-header-inner">

                    <div className="waiter-brand">

                        <div className="waiter-brand-icon">
                            KF
                        </div>

                        <div className="waiter-brand-text">

                            <h2>
                                KitchenFlow
                            </h2>

                            <span>
                                Waiter Dashboard
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

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </header>

            {/* MAIN */}

            <main className="waiter-main">

                <div className="container waiter-container">

                    {/* PAGE HEADING */}

                    <div className="text-center mb-4">

                        <div className="dashboard-badge">
                            WAITER PANEL
                        </div>

                        <h1 className="waiter-title">
                            Select a Table
                        </h1>

                        <p className="waiter-subtitle">
                            Select an available table
                            for a new order or an
                            occupied table for an
                            extra order.
                        </p>

                    </div>

                    {/* TABLES */}

                    {tables.length === 0 ? (

                        <p className="text-center waiter-subtitle">
                            No tables available.
                        </p>

                    ) : (

                        <div className="row g-4">

                            {tables.map(
                                (table: Table) => (

                                    <div
                                        key={table._id}
                                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                                    >

                                        {/* TABLE CARD ONLY */}

                                        <div
                                            className={`table-card ${
                                                table.status ===
                                                "AVAILABLE"
                                                    ? "available"
                                                    : "occupied"
                                            } ${
                                                selectedTable ===
                                                table._id
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

                                            <div className="table-icon">
                                                🪑
                                            </div>

                                            <div className="table-number">
                                                Table{" "}
                                                {
                                                    table.tableNumber
                                                }
                                            </div>

                                            <p className="table-status">

                                                {table.status ===
                                                "AVAILABLE"
                                                    ? "✓ AVAILABLE"
                                                    : "🔒 OCCUPIED"}

                                            </p>

                                            {table.status ===
                                                "OCCUPIED" && (
                                                <p className="extra-order-text">
                                                    + Extra Order
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                    {/* TABLE MESSAGE */}

                    {tableMessage && (
                        <div className="table-occupied-message text-center mt-4">
                            {tableMessage}
                        </div>
                    )}

                    {/* SELECTED TABLE */}

                    {selectedTable && (
                        <div className="table-selected-message text-center mt-4">
                            ✓ Table{" "}
                            {selectedTableNumber}{" "}
                            selected
                        </div>
                    )}

                    {/* CUSTOMER MENU QR */}
                    {/* Customers can scan this QR code to view the menu. */}
                    <div className="customer-qr-section text-center mt-5 mb-5">

                        <h2 className="waiter-title">
                            Customer Menu
                        </h2>

                        <p className="waiter-subtitle">
                            Scan the QR code to view the menu
                        </p>

                        <QRCodeCanvas
                            value={customerMenuUrl}
                            size={200}
                        />

                    </div>

                    {/* ACTIVE ORDERS */}

                    <div className="orders-section mt-5">

                        <div className="section-heading">

                            <div>

                                <span className="section-label">
                                    LIVE ORDERS
                                </span>

                                <h2>
                                    Active Orders
                                </h2>

                            </div>

                            <div className="order-count">
                                {orders.length}
                            </div>

                        </div>

                        {ordersLoading ? (

                            <p className="text-center">
                                Loading orders...
                            </p>

                        ) : orderError ? (

                            <p
                                className="text-center"
                                style={{
                                    color: "red",
                                }}
                            >
                                {orderError}
                            </p>

                        ) : orders.length === 0 ? (

                            <div className="no-orders">

                                <div className="no-orders-icon">
                                    ✓
                                </div>

                                <h4>
                                    No active orders
                                </h4>

                                <p>
                                    New orders will appear
                                    here automatically.
                                </p>

                            </div>

                        ) : (

                            orders.map(
                                (order) => (

                                    <div
                                        key={order._id}
                                        className="order-card"
                                    >

                                        <div className="order-card-header">

                                            <div>

                                                <span className="order-table-label">
                                                    TABLE
                                                </span>

                                                <h3>
                                                    Table{" "}
                                                    {
                                                        order.tableNumber
                                                    }
                                                </h3>

                                            </div>

                                            <span
                                                className={`order-status ${order.status.toLowerCase()}`}
                                            >
                                                {order.status}
                                            </span>

                                        </div>

                                        <hr />

                                        {order.items.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="order-item"
                                                >

                                                    <div>

                                                        <strong>
                                                            {
                                                                item.name
                                                            }
                                                        </strong>

                                                        {item.instructions && (
                                                            <p>
                                                                <strong>
                                                                    Instructions:
                                                                </strong>{" "}
                                                                {
                                                                    item.instructions
                                                                }
                                                            </p>
                                                        )}

                                                    </div>

                                                    <span className="item-quantity">
                                                        ×{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                </div>

                                            )
                                        )}

                                        {/* READY */}

                                        {order.status ===
                                            "READY" && (

                                            <button
                                                type="button"
                                                className="serve-button"
                                                onClick={() =>
                                                    handleServeOrder(
                                                        order._id
                                                    )
                                                }
                                                disabled={
                                                    servingOrder ===
                                                    order._id
                                                }
                                            >

                                                {servingOrder ===
                                                order._id
                                                    ? "Serving..."
                                                    : "✓ Serve Order"}

                                            </button>

                                        )}

                                        {/* NEW */}

                                        {order.status ===
                                            "NEW" && (

                                            <div className="order-info new-info">
                                                🔵 Waiting for kitchen
                                            </div>

                                        )}

                                        {/* PREPARING */}

                                        {order.status ===
                                            "PREPARING" && (

                                            <div className="order-info preparing-info">
                                                👨‍🍳 Kitchen is preparing
                                            </div>

                                        )}

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>

            </main>

            {/* FOOTER */}

            <footer className="waiter-footer">

                <div className="waiter-footer-inner">

                    <div>

                        <strong>
                            KitchenFlow
                        </strong>

                        <span>
                            Waiter Dashboard
                        </span>

                    </div>

                    <p>
                        ©{" "}
                        {new Date().getFullYear()}{" "}
                        KitchenFlow.
                        All rights reserved.
                    </p>

                </div>

            </footer>

        </div>
    );
};

export default Waiter;
