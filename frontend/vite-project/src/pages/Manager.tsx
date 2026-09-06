import { useEffect, useState } from "react";
import api from "../services/api";

// ========================================
// TYPES
// ========================================

interface MenuItem {
_id: string;
name: string;
category: string;
price: number;
image: string;
isAvailable: boolean;
}

interface OrderItem {
menuItemId?: string;
name: string;
price?: number;
quantity: number;
instructions?: string;
}

type OrderStatus =
| "NEW"
| "PREPARING"
| "READY"
| "SERVED"
| "PAID";

interface Order {
_id: string;
tableId: string;
tableNumber: number;
items: OrderItem[];
totalAmount?: number;
status: OrderStatus;
createdAt: string;
updatedAt?: string;
}

interface BillItem {
menuItemId?: string;
name: string;
price: number;
quantity: number;
amount: number;
}

interface Bill {
_id: string;
orderId: string;
tableId: string;
tableNumber: number;
items: BillItem[];
totalAmount: number;
createdAt: string;
}

// ========================================
// MANAGER COMPONENT
// ========================================

const Manager = () => {
// ========================================
// MENU STATE
// ========================================


const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

const [name, setName] = useState("");
const [category, setCategory] = useState("");
const [price, setPrice] = useState("");
const [image, setImage] = useState("");

const [editingId, setEditingId] = useState<string | null>(null);

// ========================================
// ORDER STATE
// ========================================

const [orders, setOrders] = useState<Order[]>([]);

// ========================================
// BILL STATE
// ========================================

const [bill, setBill] = useState<Bill | null>(null);
const [billLoading, setBillLoading] = useState<string | null>(null);

// Stores order IDs for which bill is generated
const [generatedBillOrderIds, setGeneratedBillOrderIds] =
    useState<Set<string>>(new Set());

// ========================================
// MESSAGE STATE
// ========================================

const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState<
    "success" | "danger" | "info"
>("info");

// ========================================
// LOADING
// ========================================

const [menuLoading, setMenuLoading] = useState(false);
const [orderLoading, setOrderLoading] = useState(false);

// ========================================
// LOAD DATA
// ========================================

useEffect(() => {
    fetchMenuItems();
    fetchOrders();
}, []);

// ========================================
// SHOW MESSAGE
// ========================================

const showMessage = (
    text: string,
    type: "success" | "danger" | "info" = "info"
) => {
    setMessage(text);
    setMessageType(type);
};

// ========================================
// GET MENU ITEMS
// ========================================

const fetchMenuItems = async () => {
    try {
        setMenuLoading(true);

        const response = await api.get("/menu-items");

        const data = Array.isArray(response.data)
            ? response.data
            : response.data.menuItems || [];

        setMenuItems(data);
    } catch (error: any) {
        console.error("Fetch menu error:", error);

        showMessage(
            error.response?.data?.message ||
                "Failed to fetch menu items",
            "danger"
        );
    } finally {
        setMenuLoading(false);
    }
};

// ========================================
// GET ALL ORDERS
// ========================================

const fetchOrders = async () => {
    try {
        setOrderLoading(true);

        const response = await api.get("/orders/all");

        console.log("All orders:", response.data);

        const data = Array.isArray(response.data)
            ? response.data
            : response.data.orders || [];

        setOrders(data);

        // ========================================
        // IMPORTANT
        // PAID orders are considered bill generated
        // ========================================

        const paidOrderIds = data
            .filter(
                (order: Order) =>
                    order.status === "PAID"
            )
            .map((order: Order) => order._id);

        setGeneratedBillOrderIds(
            new Set(paidOrderIds)
        );
    } catch (error: any) {
        console.error("Fetch orders error:", error);

        showMessage(
            error.response?.data?.message ||
                "Failed to fetch orders",
            "danger"
        );
    } finally {
        setOrderLoading(false);
    }
};

// ========================================
// CLEAR FORM
// ========================================

const clearForm = () => {
    setEditingId(null);
    setName("");
    setCategory("");
    setPrice("");
    setImage("");
};

// ========================================
// ADD MENU ITEM
// ========================================

const handleAddMenuItem = async (
    e: React.FormEvent<HTMLFormElement>
) => {
    e.preventDefault();

    if (!name.trim()) {
        showMessage("Dish name is required", "danger");
        return;
    }

    if (!category.trim()) {
        showMessage("Category is required", "danger");
        return;
    }

    if (!price || Number(price) < 0) {
        showMessage("Please enter a valid price", "danger");
        return;
    }

    try {
        const response = await api.post("/menu-items", {
            name: name.trim(),
            category: category.trim(),
            price: Number(price),
            image: image.trim(),
            isAvailable: true,
        });

        showMessage(
            response.data.message ||
                "Menu item added successfully",
            "success"
        );

        clearForm();

        await fetchMenuItems();
    } catch (error: any) {
        console.error("Add menu error:", error);

        showMessage(
            error.response?.data?.message ||
                "Failed to add menu item",
            "danger"
        );
    }
};

// ========================================
// START EDIT
// ========================================

const handleEdit = (item: MenuItem) => {
    setEditingId(item._id);

    setName(item.name);
    setCategory(item.category);
    setPrice(String(item.price));
    setImage(item.image || "");

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

// ========================================
// UPDATE MENU ITEM
// ========================================

const handleUpdateMenuItem = async (
    e: React.FormEvent<HTMLFormElement>
) => {
    e.preventDefault();

    if (!editingId) {
        showMessage(
            "Please select a menu item to edit",
            "danger"
        );
        return;
    }

    try {
        const response = await api.patch(
            `/menu-items/${editingId}`,
            {
                name: name.trim(),
                category: category.trim(),
                price: Number(price),
                image: image.trim(),
            }
        );

        showMessage(
            response.data.message ||
                "Menu item updated successfully",
            "success"
        );

        clearForm();

        await fetchMenuItems();
    } catch (error: any) {
        console.error("Update menu error:", error);

        showMessage(
            error.response?.data?.message ||
                "Failed to update menu item",
            "danger"
        );
    }
};

// ========================================
// DELETE MENU ITEM
// ========================================

const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await api.delete(
            `/menu-items/${id}`
        );

        showMessage(
            response.data.message ||
                "Menu item deleted successfully",
            "success"
        );

        if (editingId === id) {
            clearForm();
        }

        await fetchMenuItems();
    } catch (error: any) {
        console.error("Delete menu error:", error);

        showMessage(
            error.response?.data?.message ||
                "Failed to delete menu item",
            "danger"
        );
    }
};

// ========================================
// TOGGLE AVAILABILITY
// ========================================

const handleAvailability = async (
    item: MenuItem
) => {
    try {
        const newAvailability =
            !item.isAvailable;

        const response = await api.patch(
            `/menu-items/${item._id}`,
            {
                isAvailable: newAvailability,
            }
        );

        showMessage(
            response.data.message ||
                (newAvailability
                    ? `${item.name} marked as available`
                    : `${item.name} marked as unavailable`),
            "success"
        );

        await fetchMenuItems();
    } catch (error: any) {
        console.error(
            "Availability update error:",
            error
        );

        showMessage(
            error.response?.data?.message ||
                "Failed to update availability",
            "danger"
        );
    }
};

// ========================================
// GET EXISTING BILL
// ========================================

const getExistingBill = async (
    orderId: string
) => {
    try {
        const response = await api.get(
            `/billing/${orderId}`
        );

        const existingBill =
            response.data.bill || response.data;

        if (existingBill?._id) {
            setBill(existingBill);

            setGeneratedBillOrderIds(
                (previous) => {
                    const next = new Set(previous);
                    next.add(orderId);
                    return next;
                }
            );
        }

        return existingBill;
    } catch (error: any) {
        console.error(
            "Get existing bill error:",
            error
        );

        return null;
    }
};

// ========================================
// GENERATE BILL
// ========================================

const handleGenerateBill = async (
    orderId: string
) => {
    if (billLoading) {
        return;
    }

    // ========================================
    // PREVENT SECOND CLICK
    // ========================================

    if (generatedBillOrderIds.has(orderId)) {
        await handleViewBill(orderId);
        return;
    }

    try {
        setBillLoading(orderId);
        setMessage("");

        console.log(
            "Generating bill for order:",
            orderId
        );

        const response = await api.post(
            `/billing/${orderId}`
        );

        console.log(
            "Bill response:",
            response.data
        );

        const generatedBill =
            response.data.bill ||
            response.data;

        // ========================================
        // SAVE BILL
        // ========================================

        if (generatedBill?._id) {
            setBill(generatedBill);

            setGeneratedBillOrderIds(
                (previous) => {
                    const next = new Set(previous);
                    next.add(orderId);
                    return next;
                }
            );
        }

        // ========================================
        // UPDATE ORDER TO PAID
        // ========================================

        setOrders((previousOrders) =>
            previousOrders.map((order) =>
                order._id === orderId
                    ? {
                          ...order,
                          status: "PAID",
                      }
                    : order
            )
        );

        showMessage(
            response.data.message ||
                "Bill generated successfully",
            "success"
        );

        // ========================================
        // REFRESH ORDERS
        // ========================================

        await fetchOrders();
    } catch (error: any) {
        console.error(
            "Generate bill error:",
            error
        );

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "Response:",
            error.response?.data
        );

        // ========================================
        // BILL ALREADY EXISTS
        // ========================================

        if (
            error.response?.data?.bill
        ) {
            const existingBill =
                error.response.data.bill;

            setBill(existingBill);

            setGeneratedBillOrderIds(
                (previous) => {
                    const next = new Set(previous);
                    next.add(orderId);
                    return next;
                }
            );

            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order._id === orderId
                        ? {
                              ...order,
                              status: "PAID",
                          }
                        : order
                )
            );

            showMessage(
                "Bill already generated",
                "info"
            );

            return;
        }

        // ========================================
        // BILL ALREADY EXISTS - 200 RESPONSE
        // ========================================

        if (
            error.response?.data?.message ===
            "Bill already generated"
        ) {
            await getExistingBill(orderId);

            setGeneratedBillOrderIds(
                (previous) => {
                    const next = new Set(previous);
                    next.add(orderId);
                    return next;
                }
            );

            showMessage(
                "Bill already generated",
                "info"
            );

            return;
        }

        showMessage(
            error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "Failed to generate bill",
            "danger"
        );
    } finally {
        setBillLoading(null);
    }
};

// ========================================
// VIEW BILL
// ========================================

const handleViewBill = async (
    orderId: string
) => {
    try {
        setBillLoading(orderId);

        const existingBill =
            await getExistingBill(orderId);

        if (!existingBill) {
            showMessage(
                "Bill not found",
                "danger"
            );
        }
    } finally {
        setBillLoading(null);
    }
};

// ========================================
// CHECK BILL GENERATED
// ========================================

const isBillGenerated = (
    order: Order
) => {
    return (
        order.status === "PAID" ||
        generatedBillOrderIds.has(order._id)
    );
};

// ========================================
// ORDER COUNTS
// ========================================

const newOrders = orders.filter(
    (order) => order.status === "NEW"
);

const preparingOrders = orders.filter(
    (order) => order.status === "PREPARING"
);

const readyOrders = orders.filter(
    (order) => order.status === "READY"
);

const servedOrders = orders.filter(
    (order) => order.status === "SERVED"
);

const paidOrders = orders.filter(
    (order) => order.status === "PAID"
);

// ========================================
// STATUS COLOR
// ========================================

const getStatusClass = (
    status: OrderStatus
) => {
    switch (status) {
        case "NEW":
            return "text-primary";

        case "PREPARING":
            return "text-warning";

        case "READY":
            return "text-success";

        case "SERVED":
            return "text-info";

        case "PAID":
            return "text-secondary";

        default:
            return "text-dark";
    }
};

// ========================================
// DISPLAY STATUS
// ========================================

const getDisplayStatus = (
    order: Order
) => {
    if (isBillGenerated(order)) {
        return "Bill Generated";
    }

    return order.status;
};

// ========================================
// DISPLAY STATUS CLASS
// ========================================

const getDisplayStatusClass = (
    order: Order
) => {
    if (isBillGenerated(order)) {
        return "text-success";
    }

    return getStatusClass(order.status);
};

// ========================================
// UI
// ========================================

return (
    <div className="container mt-4 mb-5">

        {/* ========================================
            TITLE
        ======================================== */}

        <h1 className="mb-4">
            Manager Dashboard
        </h1>

        {/* ========================================
            MESSAGE
        ======================================== */}

        {message && (
            <div
                className={`alert alert-${messageType} d-flex justify-content-between align-items-center`}
            >
                <span>{message}</span>

                <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                        setMessage("")
                    }
                />
            </div>
        )}

        {/* ========================================
            ADD / EDIT MENU ITEM
        ======================================== */}

        <div className="card p-4 mb-5">

            <h2 className="mb-4">
                {editingId
                    ? "Edit Menu Item"
                    : "Add Menu Item"}
            </h2>

            <form
                onSubmit={
                    editingId
                        ? handleUpdateMenuItem
                        : handleAddMenuItem
                }
            >

                <div className="mb-3">
                    <label className="form-label">
                        Dish Name
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        placeholder="Enter dish name"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Category
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value
                            )
                        }
                        placeholder="Breakfast / Main Course / Starter"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Price
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        value={price}
                        onChange={(e) =>
                            setPrice(
                                e.target.value
                            )
                        }
                        placeholder="Enter price"
                        min="0"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Image URL
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={image}
                        onChange={(e) =>
                            setImage(
                                e.target.value
                            )
                        }
                        placeholder="Enter image URL"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary me-2"
                >
                    {editingId
                        ? "Update Menu Item"
                        : "Add Menu Item"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={clearForm}
                    >
                        Cancel
                    </button>
                )}
            </form>
        </div>

        {/* ========================================
            MENU MANAGEMENT
        ======================================== */}

        <div className="card p-4 mb-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="mb-0">
                    Menu Management
                </h2>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={fetchMenuItems}
                    disabled={menuLoading}
                >
                    {menuLoading
                        ? "Loading..."
                        : "Refresh"}
                </button>

            </div>

            {menuLoading ? (
                <p>
                    Loading menu items...
                </p>
            ) : menuItems.length === 0 ? (
                <p>
                    No menu items available.
                </p>
            ) : (
                <div className="row">

                    {menuItems.map((item) => (

                        <div
                            className="col-md-4 mb-4"
                            key={item._id}
                        >

                            <div className="card h-100">

                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="card-img-top"
                                        style={{
                                            height: "200px",
                                            objectFit: "cover",
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                )}

                                <div className="card-body">

                                    <h4>
                                        {item.name}
                                    </h4>

                                    <p>
                                        Category:{" "}
                                        {item.category}
                                    </p>

                                    <p>
                                        Price: ₹
                                        {item.price}
                                    </p>

                                    <p>
                                        Status:{" "}

                                        <strong
                                            className={
                                                item.isAvailable
                                                    ? "text-success"
                                                    : "text-danger"
                                            }
                                        >
                                            {item.isAvailable
                                                ? "Available"
                                                : "Out of Stock"}
                                        </strong>
                                    </p>

                                    <button
                                        type="button"
                                        className="btn btn-warning me-2 mb-2"
                                        onClick={() =>
                                            handleEdit(item)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger me-2 mb-2"
                                        onClick={() =>
                                            handleDelete(
                                                item._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            item.isAvailable
                                                ? "btn btn-secondary mb-2"
                                                : "btn btn-success mb-2"
                                        }
                                        onClick={() =>
                                            handleAvailability(
                                                item
                                            )
                                        }
                                    >
                                        {item.isAvailable
                                            ? "Mark Out of Stock"
                                            : "Mark Available"}
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* ========================================
            ORDERS OVERVIEW
        ======================================== */}

        <div className="card p-4">

            <div className="d-flex justify-content-between align-items-center">

                <h2>
                    Orders Overview
                </h2>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={fetchOrders}
                    disabled={orderLoading}
                >
                    {orderLoading
                        ? "Loading..."
                        : "Refresh"}
                </button>

            </div>

            {/* ========================================
                ORDER COUNTS
            ======================================== */}

            <div className="row mt-4">

                <div className="col-md-2 mb-3">
                    <div className="card bg-light p-3">
                        <h5>
                            New Orders
                        </h5>
                        <h2>
                            {newOrders.length}
                        </h2>
                    </div>
                </div>

                <div className="col-md-2 mb-3">
                    <div className="card bg-light p-3">
                        <h5>
                            Preparing
                        </h5>
                        <h2>
                            {preparingOrders.length}
                        </h2>
                    </div>
                </div>

                <div className="col-md-2 mb-3">
                    <div className="card bg-light p-3">
                        <h5>
                            Ready
                        </h5>
                        <h2>
                            {readyOrders.length}
                        </h2>
                    </div>
                </div>

                <div className="col-md-2 mb-3">
                    <div className="card bg-light p-3">
                        <h5>
                            Served
                        </h5>
                        <h2>
                            {servedOrders.length}
                        </h2>
                    </div>
                </div>

                <div className="col-md-2 mb-3">
                    <div className="card bg-light p-3">
                        <h5>
                            Paid
                        </h5>
                        <h2>
                            {paidOrders.length}
                        </h2>
                    </div>
                </div>

            </div>

            {/* ========================================
                ALL ORDERS
            ======================================== */}

            <div className="mt-4">

                {orderLoading ? (

                    <p>
                        Loading orders...
                    </p>

                ) : orders.length === 0 ? (

                    <p>
                        No orders available.
                    </p>

                ) : (

                    orders.map((order) => {

                        const billGenerated =
                            isBillGenerated(order);

                        return (
                            <div
                                className="card mb-3 p-3"
                                key={order._id}
                            >

                                {/* TABLE */}

                                <h4>
                                    Table{" "}
                                    {order.tableNumber}
                                </h4>

                                {/* STATUS */}

                                <p>
                                    Status:{" "}

                                    <strong
                                        className={getDisplayStatusClass(
                                            order
                                        )}
                                    >
                                        {getDisplayStatus(
                                            order
                                        )}
                                    </strong>
                                </p>

                                {/* ITEMS */}

                                <div className="mb-2">

                                    {order.items.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <p
                                                key={index}
                                                className="mb-1"
                                            >
                                                {item.name}{" "}
                                                ×{" "}
                                                {item.quantity}

                                                {item.price !==
                                                    undefined && (
                                                    <span className="text-muted">
                                                        {" "}
                                                        — ₹
                                                        {
                                                            item.price
                                                        }
                                                    </span>
                                                )}
                                            </p>
                                        )
                                    )}

                                </div>

                                {/* TOTAL */}

                                {order.totalAmount !==
                                    undefined && (
                                    <p>
                                        <strong>
                                            Total: ₹
                                            {
                                                order.totalAmount
                                            }
                                        </strong>
                                    </p>
                                )}

                                {/* CREATED DATE */}

                                <small className="text-muted">
                                    Created:{" "}
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleString()}
                                </small>

                                {/* ========================================
                                    SERVED → GENERATE BILL
                                ======================================== */}

                                {order.status ===
                                    "SERVED" &&
                                    !billGenerated && (

                                    <button
                                        type="button"
                                        className="btn btn-success mt-3"
                                        onClick={() =>
                                            handleGenerateBill(
                                                order._id
                                            )
                                        }
                                        disabled={
                                            billLoading !==
                                            null
                                        }
                                    >
                                        {billLoading ===
                                        order._id
                                            ? "Generating Bill..."
                                            : "Generate Bill"}
                                    </button>
                                )}

                                {/* ========================================
                                    BILL GENERATED
                                ======================================== */}

                                {billGenerated && (

                                    <div className="mt-3">

                                        <span className="badge bg-success fs-6 me-2">
                                            ✓ Bill Generated
                                        </span>

                                        <button
                                            type="button"
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() =>
                                                handleViewBill(
                                                    order._id
                                                )
                                            }
                                            disabled={
                                                billLoading !==
                                                null
                                            }
                                        >
                                            {billLoading ===
                                            order._id
                                                ? "Loading Bill..."
                                                : "View Bill"}
                                        </button>

                                    </div>
                                )}

                            </div>
                        );
                    })
                )}
            </div>

            {/* ========================================
                BILL DISPLAY
            ======================================== */}

            {bill && (

                <div className="card mt-4 border-success">

                    <div className="card-header bg-success text-white">

                        <h3 className="mb-0">
                            Bill
                        </h3>

                    </div>

                    <div className="card-body">

                        <h5>
                            Table Number:{" "}
                            {bill.tableNumber}
                        </h5>

                        <p>
                            Bill ID:{" "}
                            {bill._id}
                        </p>

                        <p>
                            Order ID:{" "}
                            {bill.orderId}
                        </p>

                        <hr />

                        {bill.items.map(
                            (
                                item,
                                index
                            ) => (

                                <div
                                    key={index}
                                    className="d-flex justify-content-between mb-2"
                                >

                                    <span>
                                        {item.name}{" "}
                                        ×{" "}
                                        {item.quantity}
                                    </span>

                                    <span>
                                        ₹
                                        {item.amount}
                                    </span>

                                </div>
                            )
                        )}

                        <hr />

                        <div className="d-flex justify-content-between">

                            <h4>
                                Total Amount
                            </h4>

                            <h4>
                                ₹
                                {bill.totalAmount}
                            </h4>

                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary mt-3"
                            onClick={() =>
                                setBill(null)
                            }
                        >
                            Close Bill
                        </button>

                    </div>
                </div>
            )}

        </div>

    </div>
);


};

export default Manager;
