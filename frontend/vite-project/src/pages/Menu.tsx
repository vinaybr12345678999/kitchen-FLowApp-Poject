import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchMenuItems } from "../store/menuSlice";
import "../styles/Menu.css";
import { useSearchParams } from "react-router-dom";
import { createOrder } from "../services/orderService";

const MenuItems = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [searchParams] = useSearchParams();

    const tableId = searchParams.get("tableId");
    const tableNumber = searchParams.get("tableNumber");

    const { menuItems, loading, error } = useSelector(
        (state: RootState) => state.menuItems
    );

    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [instructions, setInstructions] = useState<Record<string, string>>(
        {}
    );

    const [orderMessage, setOrderMessage] = useState<string>("");
    const [placingOrder, setPlacingOrder] = useState<boolean>(false);

    // Fetch menu
    useEffect(() => {
        dispatch(fetchMenuItems());
    }, [dispatch]);

    // Increase quantity
    const increaseQuantity = (id: string) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    };

    // Decrease quantity
    const decreaseQuantity = (id: string) => {
        if ((quantities[id] || 0) > 0) {
            setQuantities((prev) => ({
                ...prev,
                [id]: prev[id] - 1,
            }));
        }
    };

    // Change instruction
    const changeInstruction = (id: string, value: string) => {
        setInstructions((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Place Order
    const handlePlaceOrder = async () => {
        // Check table information
        if (!tableId || !tableNumber) {
            setOrderMessage("Table information is missing.");
            return;
        }

        // Get selected items
        const selectedItems = menuItems
            .filter((item) => (quantities[item._id] || 0) > 0)
            .map((item) => ({
                menuItemId: item._id,
                name: item.name,
                price: item.price,
                quantity: quantities[item._id],
                instructions: instructions[item._id] || "",
            }));

        // Check items
        if (selectedItems.length === 0) {
            setOrderMessage("Please select at least one item.");
            return;
        }

        try {
            setPlacingOrder(true);
            setOrderMessage("");

            // Create order
            const response = await createOrder({
                tableId,
                tableNumber: Number(tableNumber),
                items: selectedItems,
            });

            // Success
            setOrderMessage(
                response.message || "Order sent to kitchen successfully!"
            );

            // Clear selected items
            setQuantities({});
            setInstructions({});

            // IMPORTANT:
            // Do NOT navigate to Kitchen.
            // Do NOT navigate to Waiter.
            // Stay on Menu page.
        } catch (error: any) {
            console.error("Place order error:", error);

            setOrderMessage(
                error.response?.data?.message ||
                    "Failed to place order."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    // Loading
    if (loading) {
        return <p>Loading menu items...</p>;
    }

    // Error
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="menu-page">
            <div className="container">

                {/* Heading */}
                <h2 className="text-center mb-2 menu-title">
                    Menu Items
                </h2>

                {/* Selected Table */}
                <p className="text-center mb-4">
                    Taking order for{" "}
                    <strong>
                        Table {tableNumber}
                    </strong>
                </p>

                {/* Menu Items */}
                <div className="row">
                    {menuItems.map((item) => (
                        <div
                            className="col-md-4 mb-4"
                            key={item._id}
                        >
                            <div className="menu-card h-100">

                                {/* Food Image */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="menu-item-image"
                                />

                                <div className="card-body">

                                    {/* Food Name */}
                                    <h4>
                                        {item.name}
                                    </h4>

                                    {/* Category */}
                                    <p>
                                        Category: {item.category}
                                    </p>

                                    {/* Price */}
                                    <p>
                                        Price: ₹{item.price}
                                    </p>

                                    {/* Availability */}
                                    <p
                                        className={
                                            item.isAvailable
                                                ? "available-text"
                                                : "unavailable-text"
                                        }
                                    >
                                        {item.isAvailable
                                            ? "✓ Available"
                                            : "✗ Not Available"}
                                    </p>

                                    {/* Available items */}
                                    {item.isAvailable && (
                                        <>
                                            {/* Quantity */}
                                            <div className="d-flex align-items-center gap-3 mt-3">

                                                <button
                                                    className="quantity-button"
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item._id
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>

                                                <span className="quantity">
                                                    {quantities[item._id] || 0}
                                                </span>

                                                <button
                                                    className="quantity-button"
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item._id
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                            {/* Instructions */}
                                            <div className="mt-3">

                                                <label className="form-label">
                                                    Special Instructions
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control instruction-input"
                                                    placeholder="Add special instructions"
                                                    value={
                                                        instructions[
                                                            item._id
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        changeInstruction(
                                                            item._id,
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="order-summary mt-4 mb-5">

                    <h3>
                        Order Summary
                    </h3>

                    {menuItems.map((item) => {

                        const quantity =
                            quantities[item._id] || 0;

                        if (quantity === 0) {
                            return null;
                        }

                        return (
                            <div
                                key={item._id}
                                className="order-item"
                            >
                                <p>
                                    {item.name} - {quantity} × ₹
                                    {item.price}
                                    {" = ₹"}
                                    {item.price * quantity}
                                </p>

                                {instructions[item._id] && (
                                    <p>
                                        Instructions:{" "}
                                        {instructions[item._id]}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    {/* Total */}
                    <h4 className="order-total mt-3">
                        Total: ₹
                        {menuItems.reduce(
                            (total, item) => {
                                const quantity =
                                    quantities[item._id] || 0;

                                return (
                                    total +
                                    item.price * quantity
                                );
                            },
                            0
                        )}
                    </h4>

                    {/* Place Order */}
                    <button
                        className="place-order-button mt-3"
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                    >
                        {placingOrder
                            ? "Sending to Kitchen..."
                            : "Send Order to Kitchen"}
                    </button>

                    {/* Order Message */}
                    {orderMessage && (
                        <p className="mt-3">
                            {orderMessage}
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default MenuItems;