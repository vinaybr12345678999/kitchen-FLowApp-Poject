// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../store/store";
// import { fetchMenuItems } from "../store/menuSlice";
// import "../styles/Menu.css";
// import { useLocation } from "react-router-dom";
// import { createOrder } from "../services/orderService";

// const MenuItems = () => {
//     const dispatch = useDispatch<AppDispatch>();

//     // ========================================
//     // GET TABLE DATA FROM ROUTER STATE
//     // ========================================

//     const location = useLocation();

//     const tableId = location.state?.tableId;
//     const tableNumber = location.state?.tableNumber;

//     // ========================================
//     // REDUX MENU
//     // ========================================

//     const { menuItems, loading, error } = useSelector(
//         (state: RootState) => state.menuItems
//     );

//     // ========================================
//     // STATES
//     // ========================================

//     const [quantities, setQuantities] = useState<
//         Record<string, number>
//     >({});

//     const [instructions, setInstructions] = useState<
//         Record<string, string>
//     >({});

//     const [orderMessage, setOrderMessage] =
//         useState("");

//     const [placingOrder, setPlacingOrder] =
//         useState(false);

//     // ========================================
//     // FETCH MENU ITEMS
//     // ========================================

//     useEffect(() => {
//         dispatch(fetchMenuItems());
//     }, [dispatch]);

//     // ========================================
//     // INCREASE QUANTITY
//     // ========================================

//     const increaseQuantity = (id: string) => {
//         setQuantities((previous) => ({
//             ...previous,
//             [id]: (previous[id] || 0) + 1,
//         }));
//     };

//     // ========================================
//     // DECREASE QUANTITY
//     // ========================================

//     const decreaseQuantity = (id: string) => {
//         setQuantities((previous) => {
//             const current =
//                 previous[id] || 0;

//             if (current <= 0) {
//                 return previous;
//             }

//             return {
//                 ...previous,
//                 [id]: current - 1,
//             };
//         });
//     };

//     // ========================================
//     // CHANGE INSTRUCTION
//     // ========================================

//     const changeInstruction = (
//         id: string,
//         value: string
//     ) => {
//         setInstructions((previous) => ({
//             ...previous,
//             [id]: value,
//         }));
//     };

//     // ========================================
//     // PLACE ORDER
//     // ========================================

//     const handlePlaceOrder = async () => {
//         // ========================================
//         // CHECK TABLE DATA
//         // ========================================

//         if (!tableId || !tableNumber) {
//             setOrderMessage(
//                 "Please select a table before placing an order."
//             );
//             return;
//         }

//         // ========================================
//         // GET SELECTED ITEMS
//         // ========================================

//         const selectedItems = menuItems
//             .filter(
//                 (item) =>
//                     (quantities[item._id] || 0) > 0
//             )
//             .map((item) => ({
//                 menuItemId: item._id,
//                 name: item.name,
//                 price: item.price,
//                 quantity:
//                     quantities[item._id],
//                 instructions:
//                     instructions[item._id]?.trim() ||
//                     "",
//             }));

//         // ========================================
//         // CHECK ITEMS
//         // ========================================

//         if (selectedItems.length === 0) {
//             setOrderMessage(
//                 "Please select at least one item."
//             );
//             return;
//         }

//         // ========================================
//         // CREATE ORDER
//         // ========================================

//         try {
//             setPlacingOrder(true);
//             setOrderMessage("");

//             const response =
//                 await createOrder({
//                     tableId: tableId,

//                     tableNumber:
//                         Number(tableNumber),

//                     items: selectedItems,
//                 });

//             console.log(
//                 "Order created:",
//                 response
//             );

//             // ========================================
//             // SUCCESS
//             // ========================================

//             setOrderMessage(
//                 response.message ||
//                     "Order sent to kitchen successfully!"
//             );

//             // ========================================
//             // CLEAR CURRENT SELECTION
//             // ========================================

//             setQuantities({});
//             setInstructions({});
//         } catch (error: any) {
//             console.error(
//                 "Place order error:",
//                 error
//             );

//             setOrderMessage(
//                 error.response?.data?.message ||
//                     "Failed to place order."
//             );
//         } finally {
//             setPlacingOrder(false);
//         }
//     };

//     // ========================================
//     // TOTAL
//     // ========================================

//     const totalAmount = menuItems.reduce(
//         (total, item) => {
//             const quantity =
//                 quantities[item._id] || 0;

//             return (
//                 total +
//                 item.price * quantity
//             );
//         },
//         0
//     );

//     // ========================================
//     // LOADING
//     // ========================================

//     if (loading) {
//         return (
//             <div className="menu-page">
//                 <div className="container">
//                     <p className="text-center">
//                         Loading menu items...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // ========================================
//     // ERROR
//     // ========================================

//     if (error) {
//         return (
//             <div className="menu-page">
//                 <div className="container">
//                     <p className="text-center">
//                         {error}
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // ========================================
//     // TABLE DATA MISSING
//     // ========================================

//     if (!tableId || !tableNumber) {
//         return (
//             <div className="menu-page">
//                 <div className="container">
//                     <p className="text-center">
//                         Please select a table before
//                         opening the menu.
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // ========================================
//     // UI
//     // ========================================

//     return (
//         <div className="menu-page">
//             <div className="container">

//                 {/* ========================================
//                     HEADING
//                 ======================================== */}

//                 <h2 className="text-center mb-4 menu-title">
//                     Menu Items
//                 </h2>

//                 {/* ========================================
//                     TABLE INFO
//                 ======================================== */}

//                 <p className="text-center mb-4">
//                     Taking order for{" "}
//                     <strong>
//                         Table {tableNumber}
//                     </strong>
//                 </p>

//                 {/* ========================================
//                     MENU ITEMS
//                 ======================================== */}

//                 <div className="row">

//                     {menuItems.length === 0 ? (
//                         <p className="text-center">
//                             No menu items available.
//                         </p>
//                     ) : (
//                         menuItems.map((item) => (
//                             <div
//                                 className="col-md-4 mb-4"
//                                 key={item._id}
//                             >
//                                 <div className="menu-card h-100">

//                                     {/* IMAGE */}

//                                     <img
//                                         src={item.image}
//                                         alt={item.name}
//                                         className="menu-item-image"
//                                     />

//                                     <div className="card-body">

//                                         {/* NAME */}

//                                         <h4>
//                                             {item.name}
//                                         </h4>

//                                         {/* CATEGORY */}

//                                         <p>
//                                             Category:{" "}
//                                             {item.category}
//                                         </p>

//                                         {/* PRICE */}

//                                         <p>
//                                             Price: ₹
//                                             {item.price}
//                                         </p>

//                                         {/* AVAILABILITY */}

//                                         <p
//                                             className={
//                                                 item.isAvailable
//                                                     ? "available-text"
//                                                     : "unavailable-text"
//                                             }
//                                         >
//                                             {item.isAvailable
//                                                 ? "✓ Available"
//                                                 : "✗ Not Available"}
//                                         </p>

//                                         {/* CONTROLS */}

//                                         {item.isAvailable && (
//                                             <>

//                                                 {/* QUANTITY */}

//                                                 <div className="d-flex align-items-center gap-3 mt-3">

//                                                     <button
//                                                         type="button"
//                                                         className="quantity-button"
//                                                         onClick={() =>
//                                                             decreaseQuantity(
//                                                                 item._id
//                                                             )
//                                                         }
//                                                         disabled={
//                                                             (quantities[
//                                                                 item._id
//                                                             ] || 0) ===
//                                                             0
//                                                         }
//                                                     >
//                                                         -
//                                                     </button>

//                                                     <span className="quantity">
//                                                         {quantities[
//                                                             item._id
//                                                         ] || 0}
//                                                     </span>

//                                                     <button
//                                                         type="button"
//                                                         className="quantity-button"
//                                                         onClick={() =>
//                                                             increaseQuantity(
//                                                                 item._id
//                                                             )
//                                                         }
//                                                     >
//                                                         +
//                                                     </button>

//                                                 </div>

//                                                 {/* INSTRUCTIONS */}

//                                                 <div className="mt-3">

//                                                     <label className="form-label">
//                                                         Special
//                                                         Instructions
//                                                     </label>

//                                                     <input
//                                                         type="text"
//                                                         className="form-control instruction-input"
//                                                         placeholder="Add special instructions"
//                                                         value={
//                                                             instructions[
//                                                                 item._id
//                                                             ] ||
//                                                             ""
//                                                         }
//                                                         onChange={(e) =>
//                                                             changeInstruction(
//                                                                 item._id,
//                                                                 e.target.value
//                                                             )
//                                                         }
//                                                     />

//                                                 </div>

//                                             </>
//                                         )}

//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}

//                 </div>

//                 {/* ========================================
//                     ORDER SUMMARY
//                 ======================================== */}

//                 <div className="order-summary mt-4 mb-5">

//                     <h3>
//                         Order Summary
//                     </h3>

//                     {menuItems.map((item) => {

//                         const quantity =
//                             quantities[item._id] ||
//                             0;

//                         if (quantity === 0) {
//                             return null;
//                         }

//                         return (
//                             <div
//                                 key={item._id}
//                                 className="order-item"
//                             >
//                                 <p>
//                                     {item.name} -{" "}
//                                     {quantity} × ₹
//                                     {item.price}
//                                     {" = ₹"}
//                                     {item.price *
//                                         quantity}
//                                 </p>

//                                 {instructions[
//                                     item._id
//                                 ] && (
//                                     <p>
//                                         Instructions:{" "}
//                                         {
//                                             instructions[
//                                                 item._id
//                                             ]
//                                         }
//                                     </p>
//                                 )}
//                             </div>
//                         );
//                     })}

//                     {/* ========================================
//                         TOTAL
//                     ======================================== */}

//                     <h4 className="order-total mt-3">
//                         Total: ₹
//                         {totalAmount}
//                     </h4>

//                     {/* ========================================
//                         SEND ORDER
//                     ======================================== */}

//                     <button
//                         type="button"
//                         className="place-order-button mt-3"
//                         onClick={
//                             handlePlaceOrder
//                         }
//                         disabled={
//                             placingOrder ||
//                             totalAmount === 0
//                         }
//                     >
//                         {placingOrder
//                             ? "Sending to Kitchen..."
//                             : "Send Order to Kitchen"}
//                     </button>

//                     {/* ========================================
//                         MESSAGE
//                     ======================================== */}

//                     {orderMessage && (
//                         <p
//                             className="mt-3"
//                             style={{
//                                 color:
//                                     orderMessage.includes(
//                                         "successfully"
//                                     )
//                                         ? "green"
//                                         : "red",
//                                 fontWeight:
//                                     "bold",
//                             }}
//                         >
//                             {orderMessage}
//                         </p>
//                     )}

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MenuItems
// 
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type {
    AppDispatch,
    RootState,
} from "../store/store";
import { fetchMenuItems } from "../store/menuSlice";
import "../styles/Menu.css";
import { createOrder } from "../services/orderService";

const MenuItems = () => {
    const dispatch = useDispatch<AppDispatch>();

    // =====================================================
    // GET TABLE DATA
    // =====================================================

    const [tableId] = useState<string | null>(
        () => sessionStorage.getItem("tableId")
    );

    const [tableNumber] = useState<string | null>(
        () => sessionStorage.getItem("tableNumber")
    );

    // =====================================================
    // REDUX MENU
    // =====================================================

    const {
        menuItems,
        loading,
        error,
    } = useSelector(
        (state: RootState) =>
            state.menuItems
    );

    // =====================================================
    // STATES
    // =====================================================

    const [quantities, setQuantities] =
        useState<Record<string, number>>({});

    const [instructions, setInstructions] =
        useState<Record<string, string>>({});

    const [orderMessage, setOrderMessage] =
        useState("");

    const [placingOrder, setPlacingOrder] =
        useState(false);

    // =====================================================
    // FETCH MENU ITEMS
    // =====================================================

    useEffect(() => {
        dispatch(fetchMenuItems());
    }, [dispatch]);

    // =====================================================
    // INCREASE QUANTITY
    // =====================================================

    const increaseQuantity = (
        id: string
    ) => {
        setQuantities((previous) => ({
            ...previous,
            [id]:
                (previous[id] || 0) + 1,
        }));
    };

    // =====================================================
    // DECREASE QUANTITY
    // =====================================================

    const decreaseQuantity = (
        id: string
    ) => {
        setQuantities((previous) => {
            const current =
                previous[id] || 0;

            if (current <= 0) {
                return previous;
            }

            return {
                ...previous,
                [id]: current - 1,
            };
        });
    };

    // =====================================================
    // CHANGE INSTRUCTION
    // =====================================================

    const changeInstruction = (
        id: string,
        value: string
    ) => {
        setInstructions((previous) => ({
            ...previous,
            [id]: value,
        }));
    };

    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handlePlaceOrder = async () => {

        // Table information is required only
        // when placing the order.

        if (
            !tableId ||
            !tableNumber
        ) {
            setOrderMessage(
                "Table information is missing. Please scan the QR code again."
            );

            return;
        }

        // =================================================
        // SELECT ITEMS
        // =================================================

        const selectedItems =
            menuItems
                .filter(
                    (item) =>
                        (quantities[
                            item._id
                        ] || 0) > 0
                )
                .map((item) => ({
                    menuItemId:
                        item._id,

                    name:
                        item.name,

                    price:
                        item.price,

                    quantity:
                        quantities[
                            item._id
                        ],

                    instructions:
                        instructions[
                            item._id
                        ]?.trim() || "",
                }));

        // =================================================
        // CHECK ITEMS
        // =================================================

        if (
            selectedItems.length === 0
        ) {
            setOrderMessage(
                "Please select at least one item."
            );

            return;
        }

        // =================================================
        // CREATE ORDER
        // =================================================

        try {

            setPlacingOrder(true);

            setOrderMessage("");

            const response =
                await createOrder({
                    tableId:
                        tableId,

                    tableNumber:
                        Number(
                            tableNumber
                        ),

                    items:
                        selectedItems,
                });

            console.log(
                "Order created:",
                response
            );

            // =================================================
            // SUCCESS
            // =================================================

            setOrderMessage(
                response.message ||
                    "Order sent to kitchen successfully!"
            );

            // =================================================
            // CLEAR CURRENT SELECTION
            // =================================================

            setQuantities({});

            setInstructions({});

        } catch (error: any) {

            console.error(
                "Place order error:",
                error
            );

            setOrderMessage(
                error.response?.data
                    ?.message ||
                    "Failed to place order."
            );

        } finally {

            setPlacingOrder(false);

        }
    };

    // =====================================================
    // TOTAL
    // =====================================================

    const totalAmount =
        menuItems.reduce(
            (total, item) => {

                const quantity =
                    quantities[
                        item._id
                    ] || 0;

                return (
                    total +
                    item.price *
                        quantity
                );
            },
            0
        );

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="menu-page">
                <div className="container">
                    <p className="text-center">
                        Loading menu items...
                    </p>
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div className="menu-page">
                <div className="container">
                    <p
                        className="text-center"
                        style={{
                            color: "red",
                        }}
                    >
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    // =====================================================
    // CATEGORY DATA
    // =====================================================

    const categories = [
        {
            name: "Breakfast",
            icon: "🍳",
        },
        {
            name: "Starter",
            icon: "🥗",
        },
        {
            name: "Main Course",
            icon: "🍛",
        },
    ];

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="menu-page">

            <div className="container">

                {/* =================================================
                    RESTAURANT HEADER
                ================================================= */}

                <div className="restaurant-header">

                    <div className="restaurant-icon">
                        🍽️
                    </div>

                    <h1 className="restaurant-name">
                        Our Menu
                    </h1>

                    <p className="restaurant-subtitle">
                        Freshly prepared with love
                    </p>

                    {/* TABLE BADGE */}

                    {tableNumber && (
                        <div className="table-badge">
                            Table {tableNumber}
                        </div>
                    )}

                </div>

                {/* =================================================
                    MENU ITEMS
                ================================================= */}

                {menuItems.length === 0 ? (

                    <div className="empty-menu">

                        <div>
                            🍽️
                        </div>

                        <h3>
                            No menu items available
                        </h3>

                        <p>
                            Please check back later.
                        </p>

                    </div>

                ) : (

                    <div className="restaurant-menu">

                        {categories.map(
                            (category) => {

                                const categoryItems =
                                    menuItems.filter(
                                        (item) =>
                                            item.category
                                                ?.trim()
                                                .toLowerCase() ===
                                            category.name
                                                .toLowerCase()
                                    );

                                if (
                                    categoryItems.length ===
                                    0
                                ) {
                                    return null;
                                }

                                return (

                                    <section
                                        className="menu-category"
                                        key={
                                            category.name
                                        }
                                    >

                                        {/* CATEGORY HEADER */}

                                        <div className="category-header">

                                            <div className="category-title-wrapper">

                                                <span className="category-icon">
                                                    {
                                                        category.icon
                                                    }
                                                </span>

                                                <div>

                                                    <h2 className="category-title">
                                                        {
                                                            category.name
                                                        }
                                                    </h2>

                                                    <span className="category-count">
                                                        {
                                                            categoryItems.length
                                                        }{" "}
                                                        {
                                                            categoryItems.length ===
                                                            1
                                                                ? "item"
                                                                : "items"
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                            <div className="category-line" />

                                        </div>

                                        {/* CATEGORY ITEMS */}

                                        <div className="menu-items-list">

                                            {categoryItems.map(
                                                (item) => (

                                                    <div
                                                        className={`restaurant-menu-item ${
                                                            !item.isAvailable
                                                                ? "item-unavailable"
                                                                : ""
                                                        }`}
                                                        key={
                                                            item._id
                                                        }
                                                    >

                                                        {/* IMAGE */}

                                                        <div className="menu-image-wrapper">

                                                            {item.image ? (

                                                                <img
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                    className="menu-item-image"
                                                                />

                                                            ) : (

                                                                <div className="menu-image-placeholder">
                                                                    🍽️
                                                                </div>

                                                            )}

                                                            {!item.isAvailable && (

                                                                <div className="unavailable-overlay">
                                                                    Not Available
                                                                </div>

                                                            )}

                                                        </div>

                                                        {/* ITEM DETAILS */}

                                                        <div className="menu-item-details">

                                                            <div className="menu-item-top">

                                                                <h3 className="menu-item-name">
                                                                    {
                                                                        item.name
                                                                    }
                                                                </h3>

                                                                <span className="menu-item-price">
                                                                    ₹
                                                                    {
                                                                        item.price
                                                                    }
                                                                </span>

                                                            </div>

                                                            {/* CATEGORY */}

                                                            <p className="menu-item-category">
                                                                {
                                                                    item.category
                                                                }
                                                            </p>

                                                            {/* AVAILABILITY */}

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

                                                            {/* CONTROLS */}

                                                            {item.isAvailable && (

                                                                <div className="menu-item-actions">

                                                                    {/* QUANTITY */}

                                                                    <div className="quantity-control">

                                                                        <button
                                                                            type="button"
                                                                            className="quantity-button"
                                                                            onClick={() =>
                                                                                decreaseQuantity(
                                                                                    item._id
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                (quantities[
                                                                                    item._id
                                                                                ] ||
                                                                                    0) ===
                                                                                0
                                                                            }
                                                                        >
                                                                            −
                                                                        </button>

                                                                        <span className="quantity">
                                                                            {
                                                                                quantities[
                                                                                    item._id
                                                                                ] ||
                                                                                0
                                                                            }
                                                                        </span>

                                                                        <button
                                                                            type="button"
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

                                                                    {/* INSTRUCTION */}

                                                                    <input
                                                                        type="text"
                                                                        className="instruction-input"
                                                                        placeholder="Special instructions"
                                                                        value={
                                                                            instructions[
                                                                                item._id
                                                                            ] ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            changeInstruction(
                                                                                item._id,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />

                                                                </div>

                                                            )}

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </section>

                                );
                            }
                        )}

                    </div>

                )}

                {/* =================================================
                    ORDER SUMMARY
                ================================================= */}

                <div className="order-summary">

                    <div className="summary-header">

                        <div>

                            <h3>
                                Your Order
                            </h3>

                            {tableNumber && (
                                <span>
                                    Table {tableNumber}
                                </span>
                            )}

                        </div>

                        <div className="summary-total">
                            ₹{totalAmount}
                        </div>

                    </div>

                    {/* SELECTED ITEMS */}

                    <div className="summary-items">

                        {menuItems.map(
                            (item) => {

                                const quantity =
                                    quantities[
                                        item._id
                                    ] || 0;

                                if (
                                    quantity ===
                                    0
                                ) {
                                    return null;
                                }

                                return (

                                    <div
                                        key={
                                            item._id
                                        }
                                        className="order-item"
                                    >

                                        <div className="order-item-main">

                                            <div>

                                                <strong>
                                                    {
                                                        item.name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        quantity
                                                    }{" "}
                                                    × ₹
                                                    {
                                                        item.price
                                                    }
                                                </span>

                                            </div>

                                            <strong>
                                                ₹
                                                {
                                                    item.price *
                                                    quantity
                                                }
                                            </strong>

                                        </div>

                                        {instructions[
                                            item._id
                                        ] && (

                                            <p className="order-instruction">

                                                Note:{" "}
                                                {
                                                    instructions[
                                                        item._id
                                                    ]
                                                }

                                            </p>

                                        )}

                                    </div>

                                );
                            }
                        )}

                    </div>

                    {/* EMPTY SUMMARY */}

                    {totalAmount === 0 && (

                        <div className="empty-summary">
                            Your order is empty
                        </div>

                    )}

                    {/* TOTAL */}

                    <div className="summary-footer">

                        <div>

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹{totalAmount}
                            </strong>

                        </div>

                        {/* SEND ORDER */}

                        <button
                            type="button"
                            className="place-order-button"
                            onClick={
                                handlePlaceOrder
                            }
                            disabled={
                                placingOrder ||
                                totalAmount ===
                                    0
                            }
                        >

                            {placingOrder
                                ? "Sending to Kitchen..."
                                : "Send Order to Kitchen"}

                        </button>

                    </div>

                    {/* MESSAGE */}

                    {orderMessage && (

                        <div
                            className={`order-message ${
                                orderMessage.includes(
                                    "successfully"
                                )
                                    ? "success-message"
                                    : "error-message"
                            }`}
                        >
                            {
                                orderMessage
                            }
                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default MenuItems;