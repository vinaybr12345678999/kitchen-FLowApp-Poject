// import { useEffect, useMemo, useState } from "react";
// import api from "../services/api";
// import jsPDF from "jspdf";

// // ========================================
// // TYPES
// // ========================================

// interface MenuItem {
//     _id: string;
//     name: string;
//     category: string;
//     price: number;
//     image: string;
//     isAvailable: boolean;
// }

// interface Staff {
//     _id: string;
//     name: string;
//     image: string;
//     email: string;
//     phone: string;
//     role: "WAITER" | "KITCHEN";
//     isActive: boolean;
//     createdAt: string;
//     updatedAt?: string;
// }

// interface OrderItem {
//     menuItemId?: string;
//     name: string;
//     price?: number;
//     quantity: number;
//     instructions?: string;
// }

// type OrderStatus =
//     | "NEW"
//     | "PREPARING"
//     | "READY"
//     | "SERVED"
//     | "PAID";

// interface Order {
//     _id: string;
//     tableId: string;
//     tableNumber: number;
//     items: OrderItem[];
//     totalAmount?: number;
//     status: OrderStatus;
//     createdAt: string;
//     updatedAt?: string;
// }

// interface BillItem {
//     menuItemId?: string;
//     name: string;
//     price: number;
//     quantity: number;
//     amount: number;
// }

// interface Bill {
//     _id: string;
//     orderIds?: string[];
//     orderId?: string;
//     tableId: string;
//     tableNumber: number;
//     items: BillItem[];
//     totalAmount: number;
//     createdAt: string;
// }

// // ========================================
// // MANAGER
// // ========================================

// const Manager = () => {
//     const [activeSection, setActiveSection] = useState<
//         "dashboard" | "menu" | "staff" | "billing" | "orders"
//     >("dashboard");

//     // ========================================
//     // MENU STATE
//     // ========================================

//     const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

//     const [name, setName] = useState("");
//     const [category, setCategory] = useState("");
//     const [price, setPrice] = useState("");
//     const [image, setImage] = useState("");

//     const [editingId, setEditingId] = useState<string | null>(null);

//     // ========================================
//     // STAFF STATE
//     // ========================================

//     const [staffList, setStaffList] = useState<Staff[]>([]);

//     const [staffName, setStaffName] = useState("");
//     const [staffImage, setStaffImage] = useState("");
//     const [staffEmail, setStaffEmail] = useState("");
//     const [staffPhone, setStaffPhone] = useState("");
//     const [staffPassword, setStaffPassword] = useState("");

//     const [staffRole, setStaffRole] =
//         useState<"WAITER" | "KITCHEN">("WAITER");

//     const [editingStaffId, setEditingStaffId] =
//         useState<string | null>(null);

//     const [staffLoading, setStaffLoading] = useState(false);

//     // ========================================
//     // ORDER STATE
//     // ========================================

//     const [orders, setOrders] = useState<Order[]>([]);
//     const [searchTable, setSearchTable] = useState("");

//     const [statusFilter, setStatusFilter] =
//         useState<"ALL" | OrderStatus>("ALL");

//     // ========================================
//     // BILL STATE
//     // ========================================

//     const [bill, setBill] = useState<Bill | null>(null);
//     const [billLoading, setBillLoading] = useState<string | null>(null);

//     const [generatedBillOrderIds, setGeneratedBillOrderIds] =
//         useState<Set<string>>(new Set());

//     // ========================================
//     // MESSAGE
//     // ========================================

//     const [message, setMessage] = useState("");

//     const [messageType, setMessageType] =
//         useState<"success" | "danger" | "info">("info");

//     // ========================================
//     // LOADING
//     // ========================================

//     const [menuLoading, setMenuLoading] = useState(false);
//     const [orderLoading, setOrderLoading] = useState(false);

//     // ========================================
//     // MANUAL REFRESH
//     // ========================================

//     const [refreshing, setRefreshing] = useState(false);

//     // ========================================
//     // SHOW MESSAGE
//     // ========================================

//     const showMessage = (
//         text: string,
//         type: "success" | "danger" | "info" = "info"
//     ) => {
//         setMessage(text);
//         setMessageType(type);
//     };

//     // ========================================
//     // FETCH MENU
//     // ========================================

//     const fetchMenuItems = async () => {
//         try {
//             setMenuLoading(true);

//             const response = await api.get("/menu-items");

//             const data = Array.isArray(response.data)
//                 ? response.data
//                 : response.data.menuItems || [];

//             setMenuItems(data);
//         } catch (error: any) {
//             console.error("Fetch menu error:", error);

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to fetch menu items",
//                 "danger"
//             );
//         } finally {
//             setMenuLoading(false);
//         }
//     };

//     // ========================================
//     // FETCH STAFF
//     // ========================================

//     const fetchStaff = async () => {
//         try {
//             setStaffLoading(true);

//             const response = await api.get("/staff");

//             const data = Array.isArray(response.data)
//                 ? response.data
//                 : response.data.staff || [];

//             setStaffList(data);
//         } catch (error: any) {
//             console.error("Fetch staff error:", error);

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to fetch staff",
//                 "danger"
//             );
//         } finally {
//             setStaffLoading(false);
//         }
//     };

//     // ========================================
//     // FETCH ORDERS
//     // ========================================

//     const fetchOrders = async () => {
//         try {
//             setOrderLoading(true);

//             const response = await api.get("/orders/all");

//             const data = Array.isArray(response.data)
//                 ? response.data
//                 : response.data.orders || [];

//             setOrders(data);

//             const paidOrderIds = data
//                 .filter(
//                     (order: Order) =>
//                         order.status === "PAID"
//                 )
//                 .map(
//                     (order: Order) =>
//                         order._id
//                 );

//             setGeneratedBillOrderIds(
//                 new Set(paidOrderIds)
//             );
//         } catch (error: any) {
//             console.error("Fetch orders error:", error);

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to fetch orders",
//                 "danger"
//             );
//         } finally {
//             setOrderLoading(false);
//         }
//     };

//     // ========================================
//     // MANUAL REFRESH ALL
//     // ========================================

//     const handleRefresh = async () => {
//         if (refreshing) return;

//         try {
//             setRefreshing(true);
//             setMessage("");

//             await Promise.all([
//                 fetchOrders(),
//                 fetchMenuItems(),
//                 fetchStaff(),
//             ]);

//             showMessage(
//                 "Dashboard refreshed successfully",
//                 "success"
//             );
//         } catch (error) {
//             console.error("Refresh error:", error);

//             showMessage(
//                 "Failed to refresh dashboard",
//                 "danger"
//             );
//         } finally {
//             setRefreshing(false);
//         }
//     };

//     // ========================================
//     // INITIAL LOAD ONLY
//     // ========================================

//     useEffect(() => {
//         fetchMenuItems();
//         fetchStaff();
//         fetchOrders();
//     }, []);

//     // ========================================
//     // CLEAR MENU FORM
//     // ========================================

//     const clearForm = () => {
//         setEditingId(null);
//         setName("");
//         setCategory("");
//         setPrice("");
//         setImage("");
//     };

//     // ========================================
//     // ADD MENU
//     // ========================================

//     const handleAddMenuItem = async (
//         e: React.FormEvent<HTMLFormElement>
//     ) => {
//         e.preventDefault();

//         if (!name.trim()) {
//             showMessage(
//                 "Dish name is required",
//                 "danger"
//             );
//             return;
//         }

//         if (!category.trim()) {
//             showMessage(
//                 "Category is required",
//                 "danger"
//             );
//             return;
//         }

//         if (!price || Number(price) < 0) {
//             showMessage(
//                 "Please enter a valid price",
//                 "danger"
//             );
//             return;
//         }

//         try {
//             const response = await api.post(
//                 "/menu-items",
//                 {
//                     name: name.trim(),
//                     category: category.trim(),
//                     price: Number(price),
//                     image: image.trim(),
//                     isAvailable: true,
//                 }
//             );

//             showMessage(
//                 response.data.message ||
//                     "Menu item added successfully",
//                 "success"
//             );

//             clearForm();

//             await fetchMenuItems();
//         } catch (error: any) {
//             console.error("Add menu error:", error);

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to add menu item",
//                 "danger"
//             );
//         }
//     };

//     // ========================================
//     // EDIT MENU
//     // ========================================

//     const handleEdit = (item: MenuItem) => {
//         setEditingId(item._id);

//         setName(item.name);
//         setCategory(item.category);
//         setPrice(String(item.price));
//         setImage(item.image || "");

//         setActiveSection("menu");

//         window.scrollTo({
//             top: 0,
//             behavior: "smooth",
//         });
//     };

//     // ========================================
//     // UPDATE MENU
//     // ========================================

//     const handleUpdateMenuItem = async (
//         e: React.FormEvent<HTMLFormElement>
//     ) => {
//         e.preventDefault();

//         if (!editingId) {
//             showMessage(
//                 "Please select a menu item to edit",
//                 "danger"
//             );
//             return;
//         }

//         if (!name.trim() || !category.trim()) {
//             showMessage(
//                 "Dish name and category are required",
//                 "danger"
//             );
//             return;
//         }

//         if (!price || Number(price) < 0) {
//             showMessage(
//                 "Please enter a valid price",
//                 "danger"
//             );
//             return;
//         }

//         try {
//             const response = await api.patch(
//                 `/menu-items/${editingId}`,
//                 {
//                     name: name.trim(),
//                     category: category.trim(),
//                     price: Number(price),
//                     image: image.trim(),
//                 }
//             );

//             showMessage(
//                 response.data.message ||
//                     "Menu item updated successfully",
//                 "success"
//             );

//             clearForm();

//             await fetchMenuItems();
//         } catch (error: any) {
//             console.error(
//                 "Update menu error:",
//                 error
//             );

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to update menu item",
//                 "danger"
//             );
//         }
//     };

//     // ========================================
//     // DELETE MENU
//     // ========================================

//     const handleDelete = async (id: string) => {
//         const confirmDelete = window.confirm(
//             "Are you sure you want to delete this menu item?"
//         );

//         if (!confirmDelete) return;

//         try {
//             const response = await api.delete(
//                 `/menu-items/${id}`
//             );

//             showMessage(
//                 response.data.message ||
//                     "Menu item deleted successfully",
//                 "success"
//             );

//             if (editingId === id) {
//                 clearForm();
//             }

//             await fetchMenuItems();
//         } catch (error: any) {
//             console.error(
//                 "Delete menu error:",
//                 error
//             );

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to delete menu item",
//                 "danger"
//             );
//         }
//     };

//     // ========================================
//     // MENU AVAILABILITY
//     // ========================================

//     const handleAvailability = async (
//         item: MenuItem
//     ) => {
//         try {
//             const newAvailability =
//                 !item.isAvailable;

//             const response = await api.patch(
//                 `/menu-items/${item._id}`,
//                 {
//                     isAvailable:
//                         newAvailability,
//                 }
//             );

//             showMessage(
//                 response.data.message ||
//                     "Availability updated",
//                 "success"
//             );

//             await fetchMenuItems();
//         } catch (error: any) {
//             console.error(
//                 "Availability update error:",
//                 error
//             );

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to update availability",
//                 "danger"
//             );
//         }
//     };

//     // ========================================
//     // CLEAR STAFF FORM
//     // ========================================

//     const clearStaffForm = () => {
//         setEditingStaffId(null);
//         setStaffName("");
//         setStaffImage("");
//         setStaffEmail("");
//         setStaffPhone("");
//         setStaffPassword("");
//         setStaffRole("WAITER");
//     };

//     // ========================================
//     // ADD STAFF
//     // ========================================

//     const handleAddStaff = async (
//         e: React.FormEvent<HTMLFormElement>
//     ) => {
//         e.preventDefault();

//         if (!staffName.trim()) {
//             showMessage(
//                 "Staff name is required",
//                 "danger"
//             );
//             return;
//         }

//         if (!staffEmail.trim()) {
//             showMessage(
//                 "Staff email is required",
//                 "danger"
//             );
//             return;
//         }

//         if (!staffPhone.trim()) {
//             showMessage(
//                 "Staff phone is required",
//                 "danger"
//             );
//             return;
//         }

//         if (!staffPassword) {
//             showMessage(
//                 "Password is required",
//                 "danger"
//             );
//             return;
//         }

//         if (staffPassword.length < 6) {
//             showMessage(
//                 "Password must be at least 6 characters",
//                 "danger"
//             );
//             return;
//         }

//         try {
//             setStaffLoading(true);

//             const response = await api.post(
//                 "/staff",
//                 {
//                     name: staffName.trim(),
//                     image: staffImage.trim(),
//                     email: staffEmail.trim(),
//                     phone: staffPhone.trim(),
//                     password: staffPassword,
//                     role: staffRole,
//                 }
//             );

//             showMessage(
//                 response.data.message ||
//                     "Staff created successfully",
//                 "success"
//             );

//             clearStaffForm();

//             await fetchStaff();
//         } catch (error: any) {
//             console.error(
//                 "Create staff error:",
//                 error
//             );

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to create staff",
//                 "danger"
//             );
//         } finally {
//             setStaffLoading(false);
//         }
//     };

//     // ========================================
//     // EDIT STAFF
//     // ========================================

//     const handleEditStaff = (
//         staff: Staff
//     ) => {
//         setEditingStaffId(staff._id);

//         setStaffName(staff.name);
//         setStaffImage(staff.image || "");
//         setStaffEmail(staff.email);
//         setStaffPhone(staff.phone);
//         setStaffPassword("");
//         setStaffRole(staff.role);

//         setActiveSection("staff");

//         window.scrollTo({
//             top: 0,
//             behavior: "smooth",
//         });
//     };

//     // ========================================
//     // UPDATE STAFF
//     // ========================================

//     const handleUpdateStaff = async (
//         e: React.FormEvent<HTMLFormElement>
//     ) => {
//         e.preventDefault();

//         if (!editingStaffId) {
//             showMessage(
//                 "Please select staff to edit",
//                 "danger"
//             );
//             return;
//         }

//         if (!staffName.trim()) {
//             showMessage(
//                 "Staff name is required",
//                 "danger"
//             );
//             return;
//         }

//         if (!staffEmail.trim()) {
//             showMessage(
//                 "Staff email is required",
//                 "danger"
//             );
//             return;
//         }

//         if (!staffPhone.trim()) {
//             showMessage(
//                 "Staff phone is required",
//                 "danger"
//             );
//             return;
//         }

//         if (
//             staffPassword &&
//             staffPassword.length < 6
//         ) {
//             showMessage(
//                 "Password must be at least 6 characters",
//                 "danger"
//             );
//             return;
//         }

//         try {
//             setStaffLoading(true);

//             const updateData: {
//                 name: string;
//                 image: string;
//                 email: string;
//                 phone: string;
//                 role: "WAITER" | "KITCHEN";
//                 password?: string;
//             } = {
//                 name: staffName.trim(),
//                 image: staffImage.trim(),
//                 email: staffEmail.trim(),
//                 phone: staffPhone.trim(),
//                 role: staffRole,
//             };

//             if (staffPassword) {
//                 updateData.password =
//                     staffPassword;
//             }

//             const response = await api.patch(
//                 `/staff/${editingStaffId}`,
//                 updateData
//             );

//             showMessage(
//                 response.data.message ||
//                     "Staff updated successfully",
//                 "success"
//             );

//             clearStaffForm();

//             await fetchStaff();
//         } catch (error: any) {
//             console.error(
//                 "Update staff error:",
//                 error
//             );

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to update staff",
//                 "danger"
//             );
//         } finally {
//             setStaffLoading(false);
//         }
//     };

//     // ========================================
//     // ACTIVATE / DEACTIVATE STAFF
//     // ========================================

//     const handleStaffStatus = async (
//         staff: Staff
//     ) => {
//         try {
//             const endpoint = staff.isActive
//                 ? `/staff/${staff._id}/deactivate`
//                 : `/staff/${staff._id}/activate`;

//             const response = await api.patch(
//                 endpoint
//             );

//             showMessage(
//                 response.data.message ||
//                     "Staff status updated",
//                 "success"
//             );

//             await fetchStaff();
//         } catch (error: any) {
//             console.error(
//                 "Staff status error:",
//                 error
//             );

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to update staff status",
//                 "danger"
//             );
//         }
//     };

//     // ========================================
//     // DELETE STAFF
//     // ========================================

//     const handleDeleteStaff = async (
//         staffId: string
//     ) => {
//         const confirmDelete =
//             window.confirm(
//                 "Are you sure you want to permanently delete this staff?"
//             );

//         if (!confirmDelete) return;

//         try {
//             setStaffLoading(true);

//             const response =
//                 await api.delete(
//                     `/staff/${staffId}`
//                 );

//             showMessage(
//                 response.data.message ||
//                     "Staff deleted successfully",
//                 "success"
//             );

//             if (
//                 editingStaffId ===
//                 staffId
//             ) {
//                 clearStaffForm();
//             }

//             await fetchStaff();
//         } catch (error: any) {
//             console.error(
//                 "Delete staff error:",
//                 error
//             );

//             showMessage(
//                 error.response?.data?.message ||
//                     "Failed to delete staff",
//                 "danger"
//             );
//         } finally {
//             setStaffLoading(false);
//         }
//     };

//     // ========================================
//     // GET EXISTING BILL
//     // ========================================

//     const getExistingBill = async (
//         orderId: string
//     ) => {
//         try {
//             const response =
//                 await api.get(
//                     `/billing/${orderId}`
//                 );

//             const existingBill =
//                 response.data.bill ||
//                 response.data;

//             if (existingBill?._id) {
//                 setBill(existingBill);

//                 setGeneratedBillOrderIds(
//                     previous => {
//                         const next =
//                             new Set(previous);

//                         next.add(orderId);

//                         return next;
//                     }
//                 );
//             }

//             return existingBill;
//         } catch (error) {
//             console.error(
//                 "Get existing bill error:",
//                 error
//             );

//             return null;
//         }
//     };

//     // ========================================
//     // GENERATE BILL
//     // ========================================

//     const handleGenerateBill = async (
//         orderId: string
//     ) => {
//         if (billLoading) return;

//         if (
//             generatedBillOrderIds.has(
//                 orderId
//             )
//         ) {
//             await handleViewBill(
//                 orderId
//             );

//             return;
//         }

//         try {
//             setBillLoading(orderId);
//             setMessage("");

//             const response =
//                 await api.post(
//                     `/billing/${orderId}`
//                 );

//             const generatedBill =
//                 response.data.bill ||
//                 response.data;

//             if (generatedBill?._id) {
//                 setBill(generatedBill);

//                 setGeneratedBillOrderIds(
//                     previous => {
//                         const next =
//                             new Set(previous);

//                         next.add(orderId);

//                         return next;
//                     }
//                 );
//             }

//             setOrders(
//                 previousOrders =>
//                     previousOrders.map(
//                         order =>
//                             order._id ===
//                             orderId
//                                 ? {
//                                       ...order,
//                                       status: "PAID",
//                                   }
//                                 : order
//                     )
//             );

//             showMessage(
//                 response.data.message ||
//                     "Bill generated successfully",
//                 "success"
//             );

//             await fetchOrders();
//         } catch (error: any) {
//             console.error(
//                 "Generate bill error:",
//                 error
//             );

//             if (
//                 error.response?.data?.bill
//             ) {
//                 const existingBill =
//                     error.response.data.bill;

//                 setBill(existingBill);

//                 setGeneratedBillOrderIds(
//                     previous => {
//                         const next =
//                             new Set(previous);

//                         next.add(orderId);

//                         return next;
//                     }
//                 );

//                 showMessage(
//                     "Bill already generated",
//                     "info"
//                 );

//                 return;
//             }

//             if (
//                 error.response?.data
//                     ?.message ===
//                 "Bill already generated"
//             ) {
//                 await getExistingBill(
//                     orderId
//                 );

//                 showMessage(
//                     "Bill already generated",
//                     "info"
//                 );

//                 return;
//             }

//             showMessage(
//                 error.response?.data
//                     ?.error ||
//                     error.response?.data
//                         ?.message ||
//                     error.message ||
//                     "Failed to generate bill",
//                 "danger"
//             );
//         } finally {
//             setBillLoading(null);
//         }
//     };

//     // ========================================
//     // VIEW BILL
//     // ========================================

//     const handleViewBill = async (
//         orderId: string
//     ) => {
//         try {
//             setBillLoading(orderId);

//             const existingBill =
//                 await getExistingBill(
//                     orderId
//                 );

//             if (!existingBill) {
//                 showMessage(
//                     "Bill not found",
//                     "danger"
//                 );
//             }
//         } finally {
//             setBillLoading(null);
//         }
//     };

//     // ========================================
//     // DOWNLOAD BILL PDF
//     // ========================================

//     const handleDownloadBillPdf = (
//         billData: Bill
//     ) => {
//         if (!billData) {
//             showMessage(
//                 "Bill not available",
//                 "danger"
//             );
//             return;
//         }

//         try {
//             const doc = new jsPDF();

//             const pageWidth =
//                 doc.internal.pageSize.getWidth();

//             let y = 20;

//             // --------------------------------
//             // HEADER
//             // --------------------------------

//             doc.setFont("helvetica", "bold");
//             doc.setFontSize(20);

//             doc.text(
//                 "RESTAURANT BILL",
//                 pageWidth / 2,
//                 y,
//                 {
//                     align: "center",
//                 }
//             );

//             y += 12;

//             doc.setFont("helvetica", "normal");
//             doc.setFontSize(10);

//             doc.text(
//                 `Bill ID: ${billData._id}`,
//                 15,
//                 y
//             );

//             y += 6;

//             doc.text(
//                 `Table Number: ${billData.tableNumber}`,
//                 15,
//                 y
//             );

//             y += 6;

//             doc.text(
//                 `Date: ${new Date(
//                     billData.createdAt
//                 ).toLocaleString()}`,
//                 15,
//                 y
//             );

//             y += 10;

//             // --------------------------------
//             // LINE
//             // --------------------------------

//             doc.line(
//                 15,
//                 y,
//                 pageWidth - 15,
//                 y
//             );

//             y += 10;

//             // --------------------------------
//             // TABLE HEADER
//             // --------------------------------

//             doc.setFont("helvetica", "bold");
//             doc.setFontSize(10);

//             doc.text(
//                 "Item",
//                 15,
//                 y
//             );

//             doc.text(
//                 "Qty",
//                 115,
//                 y,
//                 {
//                     align: "center",
//                 }
//             );

//             doc.text(
//                 "Price",
//                 145,
//                 y,
//                 {
//                     align: "right",
//                 }
//             );

//             doc.text(
//                 "Amount",
//                 pageWidth - 15,
//                 y,
//                 {
//                     align: "right",
//                 }
//             );

//             y += 7;

//             doc.line(
//                 15,
//                 y,
//                 pageWidth - 15,
//                 y
//             );

//             y += 8;

//             // --------------------------------
//             // ITEMS
//             // --------------------------------

//             doc.setFont("helvetica", "normal");

//             billData.items.forEach(
//                 item => {
//                     if (y > 270) {
//                         doc.addPage();
//                         y = 20;
//                     }

//                     doc.text(
//                         item.name.substring(
//                             0,
//                             35
//                         ),
//                         15,
//                         y
//                     );

//                     doc.text(
//                         String(item.quantity),
//                         115,
//                         y,
//                         {
//                             align: "center",
//                         }
//                     );

//                     doc.text(
//                         `Rs. ${item.price.toFixed(
//                             2
//                         )}`,
//                         145,
//                         y,
//                         {
//                             align: "right",
//                         }
//                     );

//                     doc.text(
//                         `Rs. ${item.amount.toFixed(
//                             2
//                         )}`,
//                         pageWidth - 15,
//                         y,
//                         {
//                             align: "right",
//                         }
//                     );

//                     y += 8;
//                 }
//             );

//             // --------------------------------
//             // TOTAL
//             // --------------------------------

//             y += 4;

//             doc.line(
//                 15,
//                 y,
//                 pageWidth - 15,
//                 y
//             );

//             y += 12;

//             doc.setFont("helvetica", "bold");
//             doc.setFontSize(13);

//             doc.text(
//                 "TOTAL AMOUNT",
//                 15,
//                 y
//             );

//             doc.text(
//                 `Rs. ${billData.totalAmount.toFixed(
//                     2
//                 )}`,
//                 pageWidth - 15,
//                 y,
//                 {
//                     align: "right",
//                 }
//             );

//             y += 15;

//             // --------------------------------
//             // FOOTER
//             // --------------------------------

//             doc.setFont("helvetica", "normal");
//             doc.setFontSize(10);

//             doc.text(
//                 "Thank you for dining with us!",
//                 pageWidth / 2,
//                 y,
//                 {
//                     align: "center",
//                 }
//             );

//             // --------------------------------
//             // SAVE PDF
//             // --------------------------------

//             doc.save(
//                 `Restaurant-Bill-Table-${billData.tableNumber}-${billData._id}.pdf`
//             );

//             showMessage(
//                 "Bill PDF downloaded successfully",
//                 "success"
//             );
//         } catch (error) {
//             console.error(
//                 "PDF download error:",
//                 error
//             );

//             showMessage(
//                 "Failed to download bill PDF",
//                 "danger"
//             );
//         }
//     };

//     // ========================================
//     // BILL GENERATED
//     // ========================================

//     const isBillGenerated = (
//         order: Order
//     ) => {
//         return (
//             order.status === "PAID" ||
//             generatedBillOrderIds.has(
//                 order._id
//             )
//         );
//     };

//     // ========================================
//     // ORDER COUNTS
//     // ========================================

//     const newOrders = orders.filter(
//         order =>
//             order.status === "NEW"
//     );

//     const preparingOrders =
//         orders.filter(
//             order =>
//                 order.status ===
//                 "PREPARING"
//         );

//     const readyOrders = orders.filter(
//         order =>
//             order.status === "READY"
//     );

//     const servedOrders = orders.filter(
//         order =>
//             order.status === "SERVED"
//     );

//     const paidOrders = orders.filter(
//         order =>
//             order.status === "PAID"
//     );

//     // ========================================
//     // SALES
//     // ========================================

//     const todaySales = useMemo(() => {
//         const today = new Date();

//         return orders
//             .filter(order => {
//                 if (
//                     order.status !==
//                     "PAID"
//                 ) {
//                     return false;
//                 }

//                 const orderDate =
//                     new Date(
//                         order.createdAt
//                     );

//                 return (
//                     orderDate.getDate() ===
//                         today.getDate() &&
//                     orderDate.getMonth() ===
//                         today.getMonth() &&
//                     orderDate.getFullYear() ===
//                         today.getFullYear()
//                 );
//             })
//             .reduce(
//                 (total, order) =>
//                     total +
//                     (order.totalAmount ||
//                         0),
//                 0
//             );
//     }, [orders]);

//     const totalSales = useMemo(() => {
//         return orders
//             .filter(
//                 order =>
//                     order.status ===
//                     "PAID"
//             )
//             .reduce(
//                 (total, order) =>
//                     total +
//                     (order.totalAmount ||
//                         0),
//                 0
//             );
//     }, [orders]);

//     // ========================================
//     // FILTER ORDERS
//     // ========================================

//     const filteredOrders =
//         useMemo(() => {
//             return [...orders]
//                 .sort(
//                     (a, b) =>
//                         new Date(
//                             b.createdAt
//                         ).getTime() -
//                         new Date(
//                             a.createdAt
//                         ).getTime()
//                 )
//                 .filter(order => {
//                     const matchesStatus =
//                         statusFilter ===
//                             "ALL" ||
//                         order.status ===
//                             statusFilter;

//                     const matchesTable =
//                         searchTable.trim() ===
//                             "" ||
//                         String(
//                             order.tableNumber
//                         ).includes(
//                             searchTable.trim()
//                         );

//                     return (
//                         matchesStatus &&
//                         matchesTable
//                     );
//                 });
//         }, [
//             orders,
//             statusFilter,
//             searchTable,
//         ]);

//     // ========================================
//     // STATUS CLASS
//     // ========================================

//     const getStatusClass = (
//         status: OrderStatus
//     ) => {
//         switch (status) {
//             case "NEW":
//                 return "text-primary";

//             case "PREPARING":
//                 return "text-warning";

//             case "READY":
//                 return "text-success";

//             case "SERVED":
//                 return "text-info";

//             case "PAID":
//                 return "text-secondary";

//             default:
//                 return "text-dark";
//         }
//     };

//     const getDisplayStatus = (
//         order: Order
//     ) => {
//         if (
//             isBillGenerated(order)
//         ) {
//             return "Bill Generated";
//         }

//         return order.status;
//     };

//     const getDisplayStatusClass = (
//         order: Order
//     ) => {
//         if (
//             isBillGenerated(order)
//         ) {
//             return "text-success";
//         }

//         return getStatusClass(
//             order.status
//         );
//     };

//     // ========================================
//     // BILLING ORDERS
//     // ========================================

//     const billingOrders =
//         orders.filter(
//             order =>
//                 order.status ===
//                     "SERVED" ||
//                 order.status === "PAID"
//         );

//     // ========================================
//     // STAFF COUNTS
//     // ========================================

//     const activeStaff =
//         staffList.filter(
//             staff => staff.isActive
//         );

//     const inactiveStaff =
//         staffList.filter(
//             staff => !staff.isActive
//         );

//     // ========================================
//     // UI
//     // ========================================

//     return (
//         <div className="container mt-4 mb-5">

//             {/* HEADER */}

//             <div className="mb-4">
//                 <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">

//                     <div>
//                         <h1 className="mb-1">
//                             Manager Dashboard
//                         </h1>

//                         <p className="text-muted mb-0">
//                             Manage menu, staff, orders
//                             and billing.
//                         </p>
//                     </div>

//                     <button
//                         type="button"
//                         className="btn btn-primary"
//                         onClick={handleRefresh}
//                         disabled={refreshing}
//                     >
//                         {refreshing
//                             ? "Refreshing..."
//                             : "🔄 Refresh"}
//                     </button>

//                 </div>

//                 <small className="text-muted">
//                     Click Refresh to get the latest
//                     orders, menu and staff data.
//                 </small>
//             </div>

//             {/* NAVIGATION */}

//             <div className="row g-4 mb-5">

//                 {/* DASHBOARD */}

//                 <div className="col-12 col-sm-6 col-lg-3">
//                     <div
//                         className={`card h-100 shadow-sm ${
//                             activeSection ===
//                             "dashboard"
//                                 ? "border border-primary border-2"
//                                 : "border-0"
//                         }`}
//                         style={{
//                             cursor: "pointer",
//                         }}
//                         onClick={() => {
//                             setActiveSection(
//                                 "dashboard"
//                             );
//                             setBill(null);
//                         }}
//                     >
//                         <div className="card-body text-center p-4">

//                             <div
//                                 className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
//                                 style={{
//                                     width: "70px",
//                                     height: "70px",
//                                 }}
//                             >
//                                 <span className="fs-2">
//                                     📊
//                                 </span>
//                             </div>

//                             <h4>
//                                 Dashboard
//                             </h4>

//                             <p className="text-muted mb-0">
//                                 Sales and order
//                                 summary
//                             </p>

//                         </div>
//                     </div>
//                 </div>

//                 {/* MENU */}

//                 <div className="col-12 col-sm-6 col-lg-3">
//                     <div
//                         className={`card h-100 shadow-sm ${
//                             activeSection ===
//                             "menu"
//                                 ? "border border-warning border-2"
//                                 : "border-0"
//                         }`}
//                         style={{
//                             cursor: "pointer",
//                         }}
//                         onClick={() => {
//                             setActiveSection(
//                                 "menu"
//                             );
//                             setBill(null);
//                         }}
//                     >
//                         <div className="card-body text-center p-4">

//                             <div
//                                 className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
//                                 style={{
//                                     width: "70px",
//                                     height: "70px",
//                                 }}
//                             >
//                                 <span className="fs-2">
//                                     🍽️
//                                 </span>
//                             </div>

//                             <h4>
//                                 Menu Management
//                             </h4>

//                             <p className="text-muted mb-0">
//                                 Manage menu
//                             </p>

//                         </div>
//                     </div>
//                 </div>

//                 {/* STAFF */}

//                 <div className="col-12 col-sm-6 col-lg-3">
//                     <div
//                         className={`card h-100 shadow-sm ${
//                             activeSection ===
//                             "staff"
//                                 ? "border border-danger border-2"
//                                 : "border-0"
//                         }`}
//                         style={{
//                             cursor: "pointer",
//                         }}
//                         onClick={() => {
//                             setActiveSection(
//                                 "staff"
//                             );
//                             setBill(null);
//                         }}
//                     >
//                         <div className="card-body text-center p-4">

//                             <div
//                                 className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
//                                 style={{
//                                     width: "70px",
//                                     height: "70px",
//                                 }}
//                             >
//                                 <span className="fs-2">
//                                     👨‍🍳
//                                 </span>
//                             </div>

//                             <h4>
//                                 Staff Management
//                             </h4>

//                             <p className="text-muted mb-0">
//                                 Manage restaurant
//                                 staff
//                             </p>

//                         </div>
//                     </div>
//                 </div>

//                 {/* BILLING */}

//                 <div className="col-12 col-sm-6 col-lg-3">
//                     <div
//                         className={`card h-100 shadow-sm ${
//                             activeSection ===
//                             "billing"
//                                 ? "border border-success border-2"
//                                 : "border-0"
//                         }`}
//                         style={{
//                             cursor: "pointer",
//                         }}
//                         onClick={() => {
//                             setActiveSection(
//                                 "billing"
//                             );
//                             setBill(null);
//                         }}
//                     >
//                         <div className="card-body text-center p-4">

//                             <div
//                                 className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
//                                 style={{
//                                     width: "70px",
//                                     height: "70px",
//                                 }}
//                             >
//                                 <span className="fs-2">
//                                     🧾
//                                 </span>
//                             </div>

//                             <h4>
//                                 Billing
//                             </h4>

//                             <p className="text-muted mb-0">
//                                 Generate bills
//                             </p>

//                         </div>
//                     </div>
//                 </div>

//             </div>

//             {/* ORDERS NAV */}

//             <div className="row g-4 mb-5">

//                 <div className="col-12 col-md-6">
//                     <div
//                         className={`card shadow-sm ${
//                             activeSection ===
//                             "orders"
//                                 ? "border border-info border-2"
//                                 : "border-0"
//                         }`}
//                         style={{
//                             cursor: "pointer",
//                         }}
//                         onClick={() => {
//                             setActiveSection(
//                                 "orders"
//                             );
//                             setBill(null);
//                         }}
//                     >
//                         <div className="card-body d-flex align-items-center">

//                             <div
//                                 className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center me-3"
//                                 style={{
//                                     width: "65px",
//                                     height: "65px",
//                                 }}
//                             >
//                                 <span className="fs-2">
//                                     📦
//                                 </span>
//                             </div>

//                             <div>
//                                 <h4 className="mb-1">
//                                     Orders
//                                 </h4>

//                                 <p className="text-muted mb-0">
//                                     Monitor orders
//                                 </p>
//                             </div>

//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-12 col-md-6">
//                     <div className="card shadow-sm border-0">
//                         <div className="card-body">

//                             <div className="d-flex justify-content-between">

//                                 <div>
//                                     <small className="text-muted">
//                                         Active Staff
//                                     </small>

//                                     <h3 className="mb-0">
//                                         {activeStaff.length}
//                                     </h3>
//                                 </div>

//                                 <div>
//                                     <small className="text-muted">
//                                         Inactive
//                                     </small>

//                                     <h3 className="mb-0 text-danger">
//                                         {inactiveStaff.length}
//                                     </h3>
//                                 </div>

//                                 <div>
//                                     <small className="text-muted">
//                                         Orders
//                                     </small>

//                                     <h3 className="mb-0 text-primary">
//                                         {orders.length}
//                                     </h3>
//                                 </div>

//                             </div>

//                         </div>
//                     </div>
//                 </div>

//             </div>

//             {/* MESSAGE */}

//             {message && (
//                 <div
//                     className={`alert alert-${messageType} d-flex justify-content-between align-items-center`}
//                 >
//                     <span>
//                         {message}
//                     </span>

//                     <button
//                         type="button"
//                         className="btn-close"
//                         onClick={() =>
//                             setMessage("")
//                         }
//                     />
//                 </div>
//             )}

//             {/* DASHBOARD */}

//             {activeSection ===
//                 "dashboard" && (
//                 <>
//                     <div className="row g-3 mb-5">

//                         <div className="col-12 col-sm-6 col-lg-3">
//                             <div className="card shadow-sm border-0 p-3 h-100">
//                                 <small className="text-muted">
//                                     Total Orders
//                                 </small>

//                                 <h2 className="mb-0">
//                                     {orders.length}
//                                 </h2>
//                             </div>
//                         </div>

//                         <div className="col-12 col-sm-6 col-lg-3">
//                             <div className="card shadow-sm border-0 p-3 h-100">
//                                 <small className="text-muted">
//                                     Active Orders
//                                 </small>

//                                 <h2 className="mb-0 text-primary">
//                                     {newOrders.length +
//                                         preparingOrders.length +
//                                         readyOrders.length}
//                                 </h2>
//                             </div>
//                         </div>

//                         <div className="col-12 col-sm-6 col-lg-3">
//                             <div className="card shadow-sm border-0 p-3 h-100">
//                                 <small className="text-muted">
//                                     Today's Sales
//                                 </small>

//                                 <h2 className="mb-0 text-success">
//                                     ₹{todaySales}
//                                 </h2>
//                             </div>
//                         </div>

//                         <div className="col-12 col-sm-6 col-lg-3">
//                             <div className="card shadow-sm border-0 p-3 h-100">
//                                 <small className="text-muted">
//                                     Total Sales
//                                 </small>

//                                 <h2 className="mb-0 text-success">
//                                     ₹{totalSales}
//                                 </h2>
//                             </div>
//                         </div>

//                     </div>

//                     <div className="card p-4 mb-5">

//                         <h2 className="mb-4">
//                             Order Summary
//                         </h2>

//                         <div className="row g-3">

//                             <div className="col-6 col-md">
//                                 <div className="bg-light rounded p-3 text-center">
//                                     <h5>New</h5>
//                                     <h3 className="text-primary">
//                                         {newOrders.length}
//                                     </h3>
//                                 </div>
//                             </div>

//                             <div className="col-6 col-md">
//                                 <div className="bg-light rounded p-3 text-center">
//                                     <h5>Preparing</h5>
//                                     <h3 className="text-warning">
//                                         {preparingOrders.length}
//                                     </h3>
//                                 </div>
//                             </div>

//                             <div className="col-6 col-md">
//                                 <div className="bg-light rounded p-3 text-center">
//                                     <h5>Ready</h5>
//                                     <h3 className="text-success">
//                                         {readyOrders.length}
//                                     </h3>
//                                 </div>
//                             </div>

//                             <div className="col-6 col-md">
//                                 <div className="bg-light rounded p-3 text-center">
//                                     <h5>Served</h5>
//                                     <h3 className="text-info">
//                                         {servedOrders.length}
//                                     </h3>
//                                 </div>
//                             </div>

//                             <div className="col-6 col-md">
//                                 <div className="bg-light rounded p-3 text-center">
//                                     <h5>Paid</h5>
//                                     <h3 className="text-secondary">
//                                         {paidOrders.length}
//                                     </h3>
//                                 </div>
//                             </div>

//                         </div>

//                     </div>
//                 </>
//             )}

//             {/* MENU */}

//             {activeSection ===
//                 "menu" && (
//                 <>
//                     <div className="card p-4 mb-5">

//                         <h2 className="mb-4">
//                             {editingId
//                                 ? "Edit Menu Item"
//                                 : "Add Menu Item"}
//                         </h2>

//                         <form
//                             onSubmit={
//                                 editingId
//                                     ? handleUpdateMenuItem
//                                     : handleAddMenuItem
//                             }
//                         >

//                             <div className="mb-3">
//                                 <label className="form-label">
//                                     Dish Name
//                                 </label>

//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     value={name}
//                                     onChange={e =>
//                                         setName(
//                                             e.target.value
//                                         )
//                                     }
//                                     placeholder="Enter dish name"
//                                     required
//                                 />
//                             </div>

//                             <div className="mb-3">
//                                 <label className="form-label">
//                                     Category
//                                 </label>

//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     value={category}
//                                     onChange={e =>
//                                         setCategory(
//                                             e.target.value
//                                         )
//                                     }
//                                     placeholder="Breakfast / Main Course / Starter"
//                                     required
//                                 />
//                             </div>

//                             <div className="mb-3">
//                                 <label className="form-label">
//                                     Price
//                                 </label>

//                                 <input
//                                     type="number"
//                                     className="form-control"
//                                     value={price}
//                                     onChange={e =>
//                                         setPrice(
//                                             e.target.value
//                                         )
//                                     }
//                                     min="0"
//                                     step="0.01"
//                                     required
//                                 />
//                             </div>

//                             <div className="mb-3">
//                                 <label className="form-label">
//                                     Image URL
//                                 </label>

//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     value={image}
//                                     onChange={e =>
//                                         setImage(
//                                             e.target.value
//                                         )
//                                     }
//                                     placeholder="Enter image URL"
//                                 />
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="btn btn-primary me-2"
//                             >
//                                 {editingId
//                                     ? "Update Menu Item"
//                                     : "Add Menu Item"}
//                             </button>

//                             {editingId && (
//                                 <button
//                                     type="button"
//                                     className="btn btn-secondary"
//                                     onClick={
//                                         clearForm
//                                     }
//                                 >
//                                     Cancel
//                                 </button>
//                             )}

//                         </form>

//                     </div>

//                     <div className="card p-4 mb-5">

//                         <h2 className="mb-4">
//                             Menu Management
//                         </h2>

//                         {menuLoading ? (
//                             <p>
//                                 Loading menu items...
//                             </p>
//                         ) : menuItems.length ===
//                           0 ? (
//                             <p>
//                                 No menu items available.
//                             </p>
//                         ) : (
//                             <div className="row">

//                                 {menuItems.map(item => (
//                                     <div
//                                         className="col-12 col-md-6 col-lg-4 mb-4"
//                                         key={
//                                             item._id
//                                         }
//                                     >
//                                         <div className="card h-100 shadow-sm">

//                                             {item.image && (
//                                                 <img
//                                                     src={
//                                                         item.image
//                                                     }
//                                                     alt={
//                                                         item.name
//                                                     }
//                                                     className="card-img-top"
//                                                     style={{
//                                                         height:
//                                                             "200px",
//                                                         objectFit:
//                                                             "cover",
//                                                     }}
//                                                     onError={e => {
//                                                         e.currentTarget.style.display =
//                                                             "none";
//                                                     }}
//                                                 />
//                                             )}

//                                             <div className="card-body">

//                                                 <h4>
//                                                     {
//                                                         item.name
//                                                     }
//                                                 </h4>

//                                                 <p>
//                                                     <strong>
//                                                         Category:
//                                                     </strong>{" "}
//                                                     {
//                                                         item.category
//                                                     }
//                                                 </p>

//                                                 <p>
//                                                     <strong>
//                                                         Price:
//                                                     </strong>{" "}
//                                                     ₹
//                                                     {
//                                                         item.price
//                                                     }
//                                                 </p>

//                                                 <p>
//                                                     <strong>
//                                                         Status:
//                                                     </strong>{" "}

//                                                     <span
//                                                         className={
//                                                             item.isAvailable
//                                                                 ? "text-success"
//                                                                 : "text-danger"
//                                                         }
//                                                     >
//                                                         {item.isAvailable
//                                                             ? "Available"
//                                                             : "Out of Stock"}
//                                                     </span>
//                                                 </p>

//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-warning me-2 mb-2"
//                                                     onClick={() =>
//                                                         handleEdit(
//                                                             item
//                                                         )
//                                                     }
//                                                 >
//                                                     Edit
//                                                 </button>

//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-danger me-2 mb-2"
//                                                     onClick={() =>
//                                                         handleDelete(
//                                                             item._id
//                                                         )
//                                                     }
//                                                 >
//                                                     Delete
//                                                 </button>

//                                                 <button
//                                                     type="button"
//                                                     className={
//                                                         item.isAvailable
//                                                             ? "btn btn-secondary mb-2"
//                                                             : "btn btn-success mb-2"
//                                                     }
//                                                     onClick={() =>
//                                                         handleAvailability(
//                                                             item
//                                                         )
//                                                     }
//                                                 >
//                                                     {item.isAvailable
//                                                         ? "Mark Out of Stock"
//                                                         : "Mark Available"}
//                                                 </button>

//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}

//                             </div>
//                         )}

//                     </div>
//                 </>
//             )}

//             {/* STAFF MANAGEMENT */}

//             {activeSection ===
//                 "staff" && (
//                 <>
//                     <div className="card p-4 mb-5">

//                         <h2 className="mb-4">
//                             {editingStaffId
//                                 ? "Edit Staff"
//                                 : "Add New Staff"}
//                         </h2>

//                         <form
//                             onSubmit={
//                                 editingStaffId
//                                     ? handleUpdateStaff
//                                     : handleAddStaff
//                             }
//                         >

//                             <div className="row">

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">
//                                         Staff Name
//                                     </label>

//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         value={
//                                             staffName
//                                         }
//                                         onChange={e =>
//                                             setStaffName(
//                                                 e.target.value
//                                             )
//                                         }
//                                         placeholder="Enter staff name"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">
//                                         Email
//                                     </label>

//                                     <input
//                                         type="email"
//                                         className="form-control"
//                                         value={
//                                             staffEmail
//                                         }
//                                         onChange={e =>
//                                             setStaffEmail(
//                                                 e.target.value
//                                             )
//                                         }
//                                         placeholder="staff@gmail.com"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">
//                                         Phone
//                                     </label>

//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         value={
//                                             staffPhone
//                                         }
//                                         onChange={e =>
//                                             setStaffPhone(
//                                                 e.target.value
//                                             )
//                                         }
//                                         placeholder="Enter phone number"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">
//                                         Staff Role
//                                     </label>

//                                     <select
//                                         className="form-select"
//                                         value={
//                                             staffRole
//                                         }
//                                         onChange={e =>
//                                             setStaffRole(
//                                                 e.target.value as
//                                                     | "WAITER"
//                                                     | "KITCHEN"
//                                             )
//                                         }
//                                     >
//                                         <option value="WAITER">
//                                             Waiter
//                                         </option>

//                                         <option value="KITCHEN">
//                                             Kitchen
//                                         </option>
//                                     </select>
//                                 </div>

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">
//                                         Password{" "}
//                                         {editingStaffId &&
//                                             " (leave empty to keep old password)"}
//                                     </label>

//                                     <input
//                                         type="password"
//                                         className="form-control"
//                                         value={
//                                             staffPassword
//                                         }
//                                         onChange={e =>
//                                             setStaffPassword(
//                                                 e.target.value
//                                             )
//                                         }
//                                         placeholder={
//                                             editingStaffId
//                                                 ? "New password"
//                                                 : "Enter password"
//                                         }
//                                         required={
//                                             !editingStaffId
//                                         }
//                                     />
//                                 </div>

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">
//                                         Staff Image URL
//                                     </label>

//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         value={
//                                             staffImage
//                                         }
//                                         onChange={e =>
//                                             setStaffImage(
//                                                 e.target.value
//                                             )
//                                         }
//                                         placeholder="Enter image URL"
//                                     />
//                                 </div>

//                             </div>

//                             {staffImage && (
//                                 <div className="mb-3">

//                                     <p className="mb-2">
//                                         Image Preview
//                                     </p>

//                                     <img
//                                         src={
//                                             staffImage
//                                         }
//                                         alt="Staff preview"
//                                         style={{
//                                             width:
//                                                 "120px",
//                                             height:
//                                                 "120px",
//                                             objectFit:
//                                                 "cover",
//                                             borderRadius:
//                                                 "50%",
//                                             border:
//                                                 "3px solid #ddd",
//                                         }}
//                                         onError={e => {
//                                             e.currentTarget.style.display =
//                                                 "none";
//                                         }}
//                                     />

//                                 </div>
//                             )}

//                             <button
//                                 type="submit"
//                                 className="btn btn-danger me-2"
//                                 disabled={
//                                     staffLoading
//                                 }
//                             >
//                                 {staffLoading
//                                     ? "Saving..."
//                                     : editingStaffId
//                                     ? "Update Staff"
//                                     : "Add Staff"}
//                             </button>

//                             {editingStaffId && (
//                                 <button
//                                     type="button"
//                                     className="btn btn-secondary"
//                                     onClick={
//                                         clearStaffForm
//                                     }
//                                 >
//                                     Cancel
//                                 </button>
//                             )}

//                         </form>

//                     </div>

//                     <div className="card p-4 mb-5">

//                         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">

//                             <div>
//                                 <h2 className="mb-1">
//                                     Staff Management
//                                 </h2>

//                                 <small className="text-muted">
//                                     Manage waiters and
//                                     kitchen staff.
//                                 </small>
//                             </div>

//                             <div className="mt-2">

//                                 <span className="badge bg-success me-2">
//                                     Active:{" "}
//                                     {
//                                         activeStaff.length
//                                     }
//                                 </span>

//                                 <span className="badge bg-secondary">
//                                     Inactive:{" "}
//                                     {
//                                         inactiveStaff.length
//                                     }
//                                 </span>

//                             </div>

//                         </div>

//                         {staffLoading ? (
//                             <p>
//                                 Loading staff...
//                             </p>
//                         ) : staffList.length ===
//                           0 ? (
//                             <div className="alert alert-info">
//                                 No staff members
//                                 found.
//                             </div>
//                         ) : (
//                             <div className="row">

//                                 {staffList.map(
//                                     staff => (
//                                         <div
//                                             className="col-12 col-md-6 col-lg-4 mb-4"
//                                             key={
//                                                 staff._id
//                                             }
//                                         >

//                                             <div className="card h-100 shadow-sm">

//                                                 <div className="text-center pt-4">

//                                                     {staff.image ? (
//                                                         <img
//                                                             src={
//                                                                 staff.image
//                                                             }
//                                                             alt={
//                                                                 staff.name
//                                                             }
//                                                             style={{
//                                                                 width:
//                                                                     "120px",
//                                                                 height:
//                                                                     "120px",
//                                                                 objectFit:
//                                                                     "cover",
//                                                                 borderRadius:
//                                                                     "50%",
//                                                                 border:
//                                                                     "4px solid #eee",
//                                                             }}
//                                                             onError={e => {
//                                                                 e.currentTarget.style.display =
//                                                                     "none";
//                                                             }}
//                                                         />
//                                                     ) : (
//                                                         <div
//                                                             className="bg-light d-inline-flex align-items-center justify-content-center"
//                                                             style={{
//                                                                 width:
//                                                                     "120px",
//                                                                 height:
//                                                                     "120px",
//                                                                 borderRadius:
//                                                                     "50%",
//                                                             }}
//                                                         >
//                                                             <span className="fs-1">
//                                                                 👤
//                                                             </span>
//                                                         </div>
//                                                     )}

//                                                 </div>

//                                                 <div className="card-body text-center">

//                                                     <h4 className="mb-1">
//                                                         {
//                                                             staff.name
//                                                         }
//                                                     </h4>

//                                                     <span
//                                                         className={`badge mb-3 ${
//                                                             staff.role ===
//                                                             "WAITER"
//                                                                 ? "bg-primary"
//                                                                 : "bg-warning text-dark"
//                                                         }`}
//                                                     >
//                                                         {
//                                                             staff.role
//                                                         }
//                                                     </span>

//                                                     <p className="mb-1">
//                                                         <strong>
//                                                             Email:
//                                                         </strong>
//                                                         <br />
//                                                         {
//                                                             staff.email
//                                                         }
//                                                     </p>

//                                                     <p className="mb-2">
//                                                         <strong>
//                                                             Phone:
//                                                         </strong>{" "}
//                                                         {
//                                                             staff.phone
//                                                         }
//                                                     </p>

//                                                     <p>
//                                                         <strong>
//                                                             Status:
//                                                         </strong>{" "}

//                                                         <span
//                                                             className={
//                                                                 staff.isActive
//                                                                     ? "text-success fw-bold"
//                                                                     : "text-danger fw-bold"
//                                                             }
//                                                         >
//                                                             {staff.isActive
//                                                                 ? "Active"
//                                                                 : "Inactive"}
//                                                         </span>
//                                                     </p>

//                                                     <hr />

//                                                     <button
//                                                         type="button"
//                                                         className="btn btn-warning btn-sm me-2 mb-2"
//                                                         onClick={() =>
//                                                             handleEditStaff(
//                                                                 staff
//                                                             )
//                                                         }
//                                                     >
//                                                         Edit
//                                                     </button>

//                                                     <button
//                                                         type="button"
//                                                         className={
//                                                             staff.isActive
//                                                                 ? "btn btn-secondary btn-sm me-2 mb-2"
//                                                                 : "btn btn-success btn-sm me-2 mb-2"
//                                                         }
//                                                         onClick={() =>
//                                                             handleStaffStatus(
//                                                                 staff
//                                                             )
//                                                         }
//                                                     >
//                                                         {staff.isActive
//                                                             ? "Deactivate"
//                                                             : "Activate"}
//                                                     </button>

//                                                     <button
//                                                         type="button"
//                                                         className="btn btn-danger btn-sm mb-2"
//                                                         onClick={() =>
//                                                             handleDeleteStaff(
//                                                                 staff._id
//                                                             )
//                                                         }
//                                                     >
//                                                         Delete
//                                                     </button>

//                                                 </div>

//                                             </div>

//                                         </div>
//                                     )
//                                 )}

//                             </div>
//                         )}

//                     </div>
//                 </>
//             )}

//             {/* BILLING */}

//             {activeSection ===
//                 "billing" && (
//                 <div className="card p-4 mb-5">

//                     <h2 className="mb-1">
//                         Billing
//                     </h2>

//                     <small className="text-muted">
//                         Generate bills for served
//                         orders.
//                     </small>

//                     <hr />

//                     {orderLoading ? (
//                         <p>
//                             Loading billing
//                             orders...
//                         </p>
//                     ) : billingOrders.length ===
//                       0 ? (
//                         <div className="alert alert-info">
//                             No served or paid
//                             orders available.
//                         </div>
//                     ) : (
//                         billingOrders.map(
//                             order => {

//                                 const billGenerated =
//                                     isBillGenerated(
//                                         order
//                                     );

//                                 return (
//                                     <div
//                                         className="card mb-3 p-3 shadow-sm"
//                                         key={
//                                             order._id
//                                         }
//                                     >

//                                         <div className="d-flex justify-content-between align-items-center flex-wrap">

//                                             <h4>
//                                                 Table{" "}
//                                                 {
//                                                     order.tableNumber
//                                                 }
//                                             </h4>

//                                             <span
//                                                 className={`fw-bold ${getDisplayStatusClass(
//                                                     order
//                                                 )}`}
//                                             >
//                                                 {
//                                                     getDisplayStatus(
//                                                         order
//                                                     )
//                                                 }
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
//                                                     className="mb-2"
//                                                 >
//                                                     <strong>
//                                                         {
//                                                             item.name
//                                                         }
//                                                     </strong>{" "}
//                                                     ×{" "}
//                                                     {
//                                                         item.quantity
//                                                     }

//                                                     {item.price !==
//                                                         undefined && (
//                                                         <span className="text-muted">
//                                                             {" "}
//                                                             — ₹
//                                                             {
//                                                                 item.price
//                                                             }
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             )
//                                         )}

//                                         {order.totalAmount !==
//                                             undefined && (
//                                             <p>
//                                                 <strong>
//                                                     Total: ₹
//                                                     {
//                                                         order.totalAmount
//                                                     }
//                                                 </strong>
//                                             </p>
//                                         )}

//                                         <small className="text-muted">
//                                             Created:{" "}
//                                             {new Date(
//                                                 order.createdAt
//                                             ).toLocaleString()}
//                                         </small>

//                                         {order.status ===
//                                             "SERVED" &&
//                                             !billGenerated && (
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-success mt-3"
//                                                     onClick={() =>
//                                                         handleGenerateBill(
//                                                             order._id
//                                                         )
//                                                     }
//                                                     disabled={
//                                                         billLoading !==
//                                                         null
//                                                     }
//                                                 >
//                                                     {billLoading ===
//                                                     order._id
//                                                         ? "Generating Bill..."
//                                                         : "Generate Bill"}
//                                                 </button>
//                                             )}

//                                         {billGenerated && (
//                                             <div className="mt-3">

//                                                 <span className="badge bg-success fs-6 me-2">
//                                                     ✓ Bill
//                                                     Generated
//                                                 </span>

//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-outline-success btn-sm"
//                                                     onClick={() =>
//                                                         handleViewBill(
//                                                             order._id
//                                                         )
//                                                     }
//                                                     disabled={
//                                                         billLoading !==
//                                                         null
//                                                     }
//                                                 >
//                                                     {billLoading ===
//                                                     order._id
//                                                         ? "Loading..."
//                                                         : "View Bill"}
//                                                 </button>

//                                             </div>
//                                         )}

//                                     </div>
//                                 );
//                             }
//                         )
//                     )}

//                     {/* BILL DISPLAY */}

//                     {bill && (
//                         <div className="card mt-4 border-success">

//                             <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

//                                 <h3 className="mb-0">
//                                     Bill
//                                 </h3>

//                                 <button
//                                     type="button"
//                                     className="btn btn-light btn-sm"
//                                     onClick={() =>
//                                         setBill(
//                                             null
//                                         )
//                                     }
//                                 >
//                                     Close
//                                 </button>

//                             </div>

//                             <div className="card-body">

//                                 <p>
//                                     <strong>
//                                         Table:
//                                     </strong>{" "}
//                                     {
//                                         bill.tableNumber
//                                     }
//                                 </p>

//                                 <p>
//                                     <strong>
//                                         Bill ID:
//                                     </strong>{" "}
//                                     {
//                                         bill._id
//                                     }
//                                 </p>

//                                 <hr />

//                                 {bill.items.map(
//                                     (
//                                         item,
//                                         index
//                                     ) => (
//                                         <div
//                                             key={
//                                                 index
//                                             }
//                                             className="d-flex justify-content-between mb-3"
//                                         >

//                                             <div>
//                                                 <strong>
//                                                     {
//                                                         item.name
//                                                     }
//                                                 </strong>

//                                                 <div className="text-muted small">
//                                                     ₹
//                                                     {
//                                                         item.price
//                                                     }{" "}
//                                                     ×{" "}
//                                                     {
//                                                         item.quantity
//                                                     }
//                                                 </div>
//                                             </div>

//                                             <strong>
//                                                 ₹
//                                                 {
//                                                     item.amount
//                                                 }
//                                             </strong>

//                                         </div>
//                                     )
//                                 )}

//                                 <hr />

//                                 <div className="d-flex justify-content-between">

//                                     <h4>
//                                         Total Amount
//                                     </h4>

//                                     <h4 className="text-success">
//                                         ₹
//                                         {
//                                             bill.totalAmount
//                                         }
//                                     </h4>

//                                 </div>

//                                 {/* PDF BUTTON */}

//                                 <div className="mt-4 d-flex gap-2 flex-wrap">

//                                     <button
//                                         type="button"
//                                         className="btn btn-danger"
//                                         onClick={() =>
//                                             handleDownloadBillPdf(
//                                                 bill
//                                             )
//                                         }
//                                     >
//                                         📄 Download Bill PDF
//                                     </button>

//                                     <button
//                                         type="button"
//                                         className="btn btn-secondary"
//                                         onClick={() =>
//                                             setBill(
//                                                 null
//                                             )
//                                         }
//                                     >
//                                         Close
//                                     </button>

//                                 </div>

//                             </div>

//                         </div>
//                     )}

//                 </div>
//             )}

//             {/* ORDERS */}

//             {activeSection ===
//                 "orders" && (
//                 <div className="card p-4 mb-5">

//                     <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

//                         <div>
//                             <h2 className="mb-1">
//                                 Orders Overview
//                             </h2>

//                             <small className="text-muted">
//                                 Manual refresh mode
//                             </small>
//                         </div>

//                     </div>

//                     <hr />

//                     {/* SEARCH */}

//                     <div className="row g-3 mb-4">

//                         <div className="col-md-6">

//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Search by table number..."
//                                 value={
//                                     searchTable
//                                 }
//                                 onChange={e =>
//                                     setSearchTable(
//                                         e.target
//                                             .value
//                                     )
//                                 }
//                             />

//                         </div>

//                         <div className="col-md-6">

//                             <select
//                                 className="form-select"
//                                 value={
//                                     statusFilter
//                                 }
//                                 onChange={e =>
//                                     setStatusFilter(
//                                         e.target
//                                             .value as
//                                             | "ALL"
//                                             | OrderStatus
//                                     )
//                                 }
//                             >

//                                 <option value="ALL">
//                                     All Orders
//                                 </option>

//                                 <option value="NEW">
//                                     New
//                                 </option>

//                                 <option value="PREPARING">
//                                     Preparing
//                                 </option>

//                                 <option value="READY">
//                                     Ready
//                                 </option>

//                                 <option value="SERVED">
//                                     Served
//                                 </option>

//                                 <option value="PAID">
//                                     Paid
//                                 </option>

//                             </select>

//                         </div>

//                     </div>

//                     {orderLoading ? (
//                         <p>
//                             Loading orders...
//                         </p>
//                     ) : filteredOrders.length ===
//                       0 ? (
//                         <p>
//                             No matching orders.
//                         </p>
//                     ) : (
//                         filteredOrders.map(
//                             order => {

//                                 const billGenerated =
//                                     isBillGenerated(
//                                         order
//                                     );

//                                 return (
//                                     <div
//                                         className="card mb-3 p-3 shadow-sm"
//                                         key={
//                                             order._id
//                                         }
//                                     >

//                                         <div className="d-flex justify-content-between align-items-center flex-wrap">

//                                             <h4>
//                                                 Table{" "}
//                                                 {
//                                                     order.tableNumber
//                                                 }
//                                             </h4>

//                                             <span
//                                                 className={`fw-bold ${getDisplayStatusClass(
//                                                     order
//                                                 )}`}
//                                             >
//                                                 {
//                                                     getDisplayStatus(
//                                                         order
//                                                     )
//                                                 }
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
//                                                     className="mb-2"
//                                                 >

//                                                     <strong>
//                                                         {
//                                                             item.name
//                                                         }
//                                                     </strong>{" "}
//                                                     ×{" "}
//                                                     {
//                                                         item.quantity
//                                                     }

//                                                     {item.instructions && (
//                                                         <div className="small text-muted">
//                                                             Note:{" "}
//                                                             {
//                                                                 item.instructions
//                                                             }
//                                                         </div>
//                                                     )}

//                                                 </div>
//                                             )
//                                         )}

//                                         {order.totalAmount !==
//                                             undefined && (
//                                             <p>
//                                                 <strong>
//                                                     Total: ₹
//                                                     {
//                                                         order.totalAmount
//                                                     }
//                                                 </strong>
//                                             </p>
//                                         )}

//                                         <small className="text-muted">
//                                             Created:{" "}
//                                             {new Date(
//                                                 order.createdAt
//                                             ).toLocaleString()}
//                                         </small>

//                                         {order.status ===
//                                             "SERVED" &&
//                                             !billGenerated && (
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-success mt-3"
//                                                     onClick={() =>
//                                                         handleGenerateBill(
//                                                             order._id
//                                                         )
//                                                     }
//                                                     disabled={
//                                                         billLoading !==
//                                                         null
//                                                     }
//                                                 >
//                                                     {billLoading ===
//                                                     order._id
//                                                         ? "Generating Bill..."
//                                                         : "Generate Bill"}
//                                                 </button>
//                                             )}

//                                         {billGenerated && (
//                                             <div className="mt-3">

//                                                 <span className="badge bg-success fs-6 me-2">
//                                                     ✓ Bill
//                                                     Generated
//                                                 </span>

//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-outline-success btn-sm"
//                                                     onClick={() =>
//                                                         handleViewBill(
//                                                             order._id
//                                                         )
//                                                     }
//                                                     disabled={
//                                                         billLoading !==
//                                                         null
//                                                     }
//                                                 >
//                                                     {billLoading ===
//                                                     order._id
//                                                         ? "Loading..."
//                                                         : "View Bill"}
//                                                 </button>

//                                             </div>
//                                         )}

//                                     </div>
//                                 );
//                             }
//                         )
//                     )}

//                     {/* SHOW BILL FROM ORDERS */}

//                     {bill && (
//                         <div className="card mt-4 border-success">

//                             <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

//                                 <h3 className="mb-0">
//                                     Bill
//                                 </h3>

//                                 <button
//                                     type="button"
//                                     className="btn btn-light btn-sm"
//                                     onClick={() =>
//                                         setBill(
//                                             null
//                                         )
//                                     }
//                                 >
//                                     Close
//                                 </button>

//                             </div>

//                             <div className="card-body">

//                                 <p>
//                                     <strong>
//                                         Table:
//                                     </strong>{" "}
//                                     {
//                                         bill.tableNumber
//                                     }
//                                 </p>

//                                 <p>
//                                     <strong>
//                                         Bill ID:
//                                     </strong>{" "}
//                                     {
//                                         bill._id
//                                     }
//                                 </p>

//                                 <hr />

//                                 {bill.items.map(
//                                     (
//                                         item,
//                                         index
//                                     ) => (
//                                         <div
//                                             key={
//                                                 index
//                                             }
//                                             className="d-flex justify-content-between mb-3"
//                                         >

//                                             <div>

//                                                 <strong>
//                                                     {
//                                                         item.name
//                                                     }
//                                                 </strong>

//                                                 <div className="text-muted small">
//                                                     ₹
//                                                     {
//                                                         item.price
//                                                     }{" "}
//                                                     ×{" "}
//                                                     {
//                                                         item.quantity
//                                                     }
//                                                 </div>

//                                             </div>

//                                             <strong>
//                                                 ₹
//                                                 {
//                                                     item.amount
//                                                 }
//                                             </strong>

//                                         </div>
//                                     )
//                                 )}

//                                 <hr />

//                                 <div className="d-flex justify-content-between">

//                                     <h4>
//                                         Total Amount
//                                     </h4>

//                                     <h4 className="text-success">
//                                         ₹
//                                         {
//                                             bill.totalAmount
//                                         }
//                                     </h4>

//                                 </div>

//                                 {/* PDF BUTTON */}

//                                 <div className="mt-4 d-flex gap-2 flex-wrap">

//                                     <button
//                                         type="button"
//                                         className="btn btn-danger"
//                                         onClick={() =>
//                                             handleDownloadBillPdf(
//                                                 bill
//                                             )
//                                         }
//                                     >
//                                         📄 Download Bill PDF
//                                     </button>

//                                     <button
//                                         type="button"
//                                         className="btn btn-secondary"
//                                         onClick={() =>
//                                             setBill(
//                                                 null
//                                             )
//                                         }
//                                     >
//                                         Close
//                                     </button>

//                                 </div>

//                             </div>

//                         </div>
//                     )}

//                 </div>
//             )}

//         </div>
//     );
// };

// export default Manager;
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import jsPDF from "jspdf";

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

interface Staff {
    _id: string;
    name: string;
    image: string;
    email: string;
    phone: string;
    role: "WAITER" | "KITCHEN";
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
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
    orderIds?: string[];
    orderId?: string;
    tableId: string;
    tableNumber: number;
    items: BillItem[];
    totalAmount: number;
    createdAt: string;
}

// ========================================
// MANAGER
// ========================================

const Manager = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login", { replace: true });
    };
    const [activeSection, setActiveSection] = useState<
        "dashboard" | "menu" | "staff" | "billing" | "orders"
    >("dashboard");

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
    // STAFF STATE
    // ========================================

    const [staffList, setStaffList] = useState<Staff[]>([]);

    const [staffName, setStaffName] = useState("");
    const [staffImage, setStaffImage] = useState("");
    const [staffEmail, setStaffEmail] = useState("");
    const [staffPhone, setStaffPhone] = useState("");
    const [staffPassword, setStaffPassword] = useState("");

    const [staffRole, setStaffRole] =
        useState<"WAITER" | "KITCHEN">("WAITER");

    const [editingStaffId, setEditingStaffId] =
        useState<string | null>(null);

    const [staffLoading, setStaffLoading] = useState(false);

    // ========================================
    // ORDER STATE
    // ========================================

    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTable, setSearchTable] = useState("");

    const [statusFilter, setStatusFilter] =
        useState<"ALL" | OrderStatus>("ALL");

    // ========================================
    // BILL STATE
    // ========================================

    const [bill, setBill] = useState<Bill | null>(null);
    const [billLoading, setBillLoading] = useState<string | null>(null);

    const [generatedBillOrderIds, setGeneratedBillOrderIds] =
        useState<Set<string>>(new Set());

    // ========================================
    // MESSAGE
    // ========================================

    const [message, setMessage] = useState("");

    const [messageType, setMessageType] =
        useState<"success" | "danger" | "info">("info");

    // ========================================
    // LOADING
    // ========================================

    const [menuLoading, setMenuLoading] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);

    // ========================================
    // MANUAL REFRESH
    // ========================================

    const [refreshing, setRefreshing] = useState(false);

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
    // FETCH MENU
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
    // FETCH STAFF
    // ========================================

    const fetchStaff = async () => {
        try {
            setStaffLoading(true);

            const response = await api.get("/staff");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.staff || [];

            setStaffList(data);
        } catch (error: any) {
            console.error("Fetch staff error:", error);

            showMessage(
                error.response?.data?.message ||
                    "Failed to fetch staff",
                "danger"
            );
        } finally {
            setStaffLoading(false);
        }
    };

    // ========================================
    // FETCH ORDERS
    // ========================================

    const fetchOrders = async () => {
        try {
            setOrderLoading(true);

            const response = await api.get("/orders/all");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.orders || [];

            setOrders(data);

            const paidOrderIds = data
                .filter(
                    (order: Order) =>
                        order.status === "PAID"
                )
                .map(
                    (order: Order) =>
                        order._id
                );

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
    // MANUAL REFRESH ALL
    // ========================================

    const handleRefresh = async () => {
        if (refreshing) return;

        try {
            setRefreshing(true);
            setMessage("");

            await Promise.all([
                fetchOrders(),
                fetchMenuItems(),
                fetchStaff(),
            ]);

            showMessage(
                "Dashboard refreshed successfully",
                "success"
            );
        } catch (error) {
            console.error("Refresh error:", error);

            showMessage(
                "Failed to refresh dashboard",
                "danger"
            );
        } finally {
            setRefreshing(false);
        }
    };

    // ========================================
    // INITIAL LOAD ONLY
    // ========================================

    useEffect(() => {
        fetchMenuItems();
        fetchStaff();
        fetchOrders();
    }, []);

    // ========================================
    // CLEAR MENU FORM
    // ========================================

    const clearForm = () => {
        setEditingId(null);
        setName("");
        setCategory("");
        setPrice("");
        setImage("");
    };

    // ========================================
    // ADD MENU
    // ========================================

    const handleAddMenuItem = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!name.trim()) {
            showMessage(
                "Dish name is required",
                "danger"
            );
            return;
        }

        if (!category.trim()) {
            showMessage(
                "Category is required",
                "danger"
            );
            return;
        }

        if (!price || Number(price) < 0) {
            showMessage(
                "Please enter a valid price",
                "danger"
            );
            return;
        }

        try {
            const response = await api.post(
                "/menu-items",
                {
                    name: name.trim(),
                    category: category.trim(),
                    price: Number(price),
                    image: image.trim(),
                    isAvailable: true,
                }
            );

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
    // EDIT MENU
    // ========================================

    const handleEdit = (item: MenuItem) => {
        setEditingId(item._id);

        setName(item.name);
        setCategory(item.category);
        setPrice(String(item.price));
        setImage(item.image || "");

        setActiveSection("menu");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ========================================
    // UPDATE MENU
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

        if (!name.trim() || !category.trim()) {
            showMessage(
                "Dish name and category are required",
                "danger"
            );
            return;
        }

        if (!price || Number(price) < 0) {
            showMessage(
                "Please enter a valid price",
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
            console.error(
                "Update menu error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                    "Failed to update menu item",
                "danger"
            );
        }
    };

    // ========================================
    // DELETE MENU
    // ========================================

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this menu item?"
        );

        if (!confirmDelete) return;

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
            console.error(
                "Delete menu error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                    "Failed to delete menu item",
                "danger"
            );
        }
    };

    // ========================================
    // MENU AVAILABILITY
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
                    isAvailable:
                        newAvailability,
                }
            );

            showMessage(
                response.data.message ||
                    "Availability updated",
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
    // CLEAR STAFF FORM
    // ========================================

    const clearStaffForm = () => {
        setEditingStaffId(null);
        setStaffName("");
        setStaffImage("");
        setStaffEmail("");
        setStaffPhone("");
        setStaffPassword("");
        setStaffRole("WAITER");
    };

    // ========================================
    // ADD STAFF
    // ========================================

    const handleAddStaff = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!staffName.trim()) {
            showMessage(
                "Staff name is required",
                "danger"
            );
            return;
        }

        if (!staffEmail.trim()) {
            showMessage(
                "Staff email is required",
                "danger"
            );
            return;
        }

        if (!staffPhone.trim()) {
            showMessage(
                "Staff phone is required",
                "danger"
            );
            return;
        }

        if (!staffPassword) {
            showMessage(
                "Password is required",
                "danger"
            );
            return;
        }

        if (staffPassword.length < 6) {
            showMessage(
                "Password must be at least 6 characters",
                "danger"
            );
            return;
        }

        try {
            setStaffLoading(true);

            const response = await api.post(
                "/staff",
                {
                    name: staffName.trim(),
                    image: staffImage.trim(),
                    email: staffEmail.trim(),
                    phone: staffPhone.trim(),
                    password: staffPassword,
                    role: staffRole,
                }
            );

            showMessage(
                response.data.message ||
                    "Staff created successfully",
                "success"
            );

            clearStaffForm();

            await fetchStaff();
        } catch (error: any) {
            console.error(
                "Create staff error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                    "Failed to create staff",
                "danger"
            );
        } finally {
            setStaffLoading(false);
        }
    };

    // ========================================
    // EDIT STAFF
    // ========================================

    const handleEditStaff = (
        staff: Staff
    ) => {
        setEditingStaffId(staff._id);

        setStaffName(staff.name);
        setStaffImage(staff.image || "");
        setStaffEmail(staff.email);
        setStaffPhone(staff.phone);
        setStaffPassword("");
        setStaffRole(staff.role);

        setActiveSection("staff");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ========================================
    // UPDATE STAFF
    // ========================================

    const handleUpdateStaff = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!editingStaffId) {
            showMessage(
                "Please select staff to edit",
                "danger"
            );
            return;
        }

        if (!staffName.trim()) {
            showMessage(
                "Staff name is required",
                "danger"
            );
            return;
        }

        if (!staffEmail.trim()) {
            showMessage(
                "Staff email is required",
                "danger"
            );
            return;
        }

        if (!staffPhone.trim()) {
            showMessage(
                "Staff phone is required",
                "danger"
            );
            return;
        }

        if (
            staffPassword &&
            staffPassword.length < 6
        ) {
            showMessage(
                "Password must be at least 6 characters",
                "danger"
            );
            return;
        }

        try {
            setStaffLoading(true);

            const updateData: {
                name: string;
                image: string;
                email: string;
                phone: string;
                role: "WAITER" | "KITCHEN";
                password?: string;
            } = {
                name: staffName.trim(),
                image: staffImage.trim(),
                email: staffEmail.trim(),
                phone: staffPhone.trim(),
                role: staffRole,
            };

            if (staffPassword) {
                updateData.password =
                    staffPassword;
            }

            const response = await api.patch(
                `/staff/${editingStaffId}`,
                updateData
            );

            showMessage(
                response.data.message ||
                    "Staff updated successfully",
                "success"
            );

            clearStaffForm();

            await fetchStaff();
        } catch (error: any) {
            console.error(
                "Update staff error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                    "Failed to update staff",
                "danger"
            );
        } finally {
            setStaffLoading(false);
        }
    };

    // ========================================
    // ACTIVATE / DEACTIVATE STAFF
    // ========================================

    const handleStaffStatus = async (
        staff: Staff
    ) => {
        try {
            const endpoint = staff.isActive
                ? `/staff/${staff._id}/deactivate`
                : `/staff/${staff._id}/activate`;

            const response = await api.patch(
                endpoint
            );

            showMessage(
                response.data.message ||
                    "Staff status updated",
                "success"
            );

            await fetchStaff();
        } catch (error: any) {
            console.error(
                "Staff status error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                    "Failed to update staff status",
                "danger"
            );
        }
    };

    // ========================================
    // DELETE STAFF
    // ========================================

    const handleDeleteStaff = async (
        staffId: string
    ) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to permanently delete this staff?"
            );

        if (!confirmDelete) return;

        try {
            setStaffLoading(true);

            const response =
                await api.delete(
                    `/staff/${staffId}`
                );

            showMessage(
                response.data.message ||
                    "Staff deleted successfully",
                "success"
            );

            if (
                editingStaffId ===
                staffId
            ) {
                clearStaffForm();
            }

            await fetchStaff();
        } catch (error: any) {
            console.error(
                "Delete staff error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                    "Failed to delete staff",
                "danger"
            );
        } finally {
            setStaffLoading(false);
        }
    };

    // ========================================
    // GET EXISTING BILL
    // ========================================

    const getExistingBill = async (
        orderId: string
    ) => {
        try {
            const response =
                await api.get(
                    `/billing/${orderId}`
                );

            const existingBill =
                response.data.bill ||
                response.data;

            if (existingBill?._id) {
                setBill(existingBill);

                setGeneratedBillOrderIds(
                    previous => {
                        const next =
                            new Set(previous);

                        next.add(orderId);

                        return next;
                    }
                );
            }

            return existingBill;
        } catch (error) {
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
        if (billLoading) return;

        if (
            generatedBillOrderIds.has(
                orderId
            )
        ) {
            await handleViewBill(
                orderId
            );

            return;
        }

        try {
            setBillLoading(orderId);
            setMessage("");

            const response =
                await api.post(
                    `/billing/${orderId}`
                );

            const generatedBill =
                response.data.bill ||
                response.data;

            if (generatedBill?._id) {
                setBill(generatedBill);

                setGeneratedBillOrderIds(
                    previous => {
                        const next =
                            new Set(previous);

                        next.add(orderId);

                        return next;
                    }
                );
            }

            setOrders(
                previousOrders =>
                    previousOrders.map(
                        order =>
                            order._id ===
                            orderId
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

            await fetchOrders();
        } catch (error: any) {
            console.error(
                "Generate bill error:",
                error
            );

            if (
                error.response?.data?.bill
            ) {
                const existingBill =
                    error.response.data.bill;

                setBill(existingBill);

                setGeneratedBillOrderIds(
                    previous => {
                        const next =
                            new Set(previous);

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

            if (
                error.response?.data
                    ?.message ===
                "Bill already generated"
            ) {
                await getExistingBill(
                    orderId
                );

                showMessage(
                    "Bill already generated",
                    "info"
                );

                return;
            }

            showMessage(
                error.response?.data
                    ?.error ||
                    error.response?.data
                        ?.message ||
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
                await getExistingBill(
                    orderId
                );

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
    // DOWNLOAD BILL PDF
    // ========================================

    const handleDownloadBillPdf = (
        billData: Bill
    ) => {
        if (!billData) {
            showMessage(
                "Bill not available",
                "danger"
            );
            return;
        }

        try {
            const doc = new jsPDF();

            const pageWidth =
                doc.internal.pageSize.getWidth();

            let y = 20;

            // --------------------------------
            // HEADER
            // --------------------------------

            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);

            doc.text(
                "RESTAURANT BILL",
                pageWidth / 2,
                y,
                {
                    align: "center",
                }
            );

            y += 12;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            doc.text(
                `Bill ID: ${billData._id}`,
                15,
                y
            );

            y += 6;

            doc.text(
                `Table Number: ${billData.tableNumber}`,
                15,
                y
            );

            y += 6;

            doc.text(
                `Date: ${new Date(
                    billData.createdAt
                ).toLocaleString()}`,
                15,
                y
            );

            y += 10;

            // --------------------------------
            // LINE
            // --------------------------------

            doc.line(
                15,
                y,
                pageWidth - 15,
                y
            );

            y += 10;

            // --------------------------------
            // TABLE HEADER
            // --------------------------------

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);

            doc.text(
                "Item",
                15,
                y
            );

            doc.text(
                "Qty",
                115,
                y,
                {
                    align: "center",
                }
            );

            doc.text(
                "Price",
                145,
                y,
                {
                    align: "right",
                }
            );

            doc.text(
                "Amount",
                pageWidth - 15,
                y,
                {
                    align: "right",
                }
            );

            y += 7;

            doc.line(
                15,
                y,
                pageWidth - 15,
                y
            );

            y += 8;

            // --------------------------------
            // ITEMS
            // --------------------------------

            doc.setFont("helvetica", "normal");

            billData.items.forEach(
                item => {
                    if (y > 270) {
                        doc.addPage();
                        y = 20;
                    }

                    doc.text(
                        item.name.substring(
                            0,
                            35
                        ),
                        15,
                        y
                    );

                    doc.text(
                        String(item.quantity),
                        115,
                        y,
                        {
                            align: "center",
                        }
                    );

                    doc.text(
                        `Rs. ${item.price.toFixed(
                            2
                        )}`,
                        145,
                        y,
                        {
                            align: "right",
                        }
                    );

                    doc.text(
                        `Rs. ${item.amount.toFixed(
                            2
                        )}`,
                        pageWidth - 15,
                        y,
                        {
                            align: "right",
                        }
                    );

                    y += 8;
                }
            );

            // --------------------------------
            // TOTAL
            // --------------------------------

            y += 4;

            doc.line(
                15,
                y,
                pageWidth - 15,
                y
            );

            y += 12;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);

            doc.text(
                "TOTAL AMOUNT",
                15,
                y
            );

            doc.text(
                `Rs. ${billData.totalAmount.toFixed(
                    2
                )}`,
                pageWidth - 15,
                y,
                {
                    align: "right",
                }
            );

            y += 15;

            // --------------------------------
            // FOOTER
            // --------------------------------

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            doc.text(
                "Thank you for dining with us!",
                pageWidth / 2,
                y,
                {
                    align: "center",
                }
            );

            // --------------------------------
            // SAVE PDF
            // --------------------------------

            doc.save(
                `Restaurant-Bill-Table-${billData.tableNumber}-${billData._id}.pdf`
            );

            showMessage(
                "Bill PDF downloaded successfully",
                "success"
            );
        } catch (error) {
            console.error(
                "PDF download error:",
                error
            );

            showMessage(
                "Failed to download bill PDF",
                "danger"
            );
        }
    };

    // ========================================
    // BILL GENERATED
    // ========================================

    const isBillGenerated = (
        order: Order
    ) => {
        return (
            order.status === "PAID" ||
            generatedBillOrderIds.has(
                order._id
            )
        );
    };

    // ========================================
    // ORDER COUNTS
    // ========================================

    const newOrders = orders.filter(
        order =>
            order.status === "NEW"
    );

    const preparingOrders =
        orders.filter(
            order =>
                order.status ===
                "PREPARING"
        );

    const readyOrders = orders.filter(
        order =>
            order.status === "READY"
    );

    const servedOrders = orders.filter(
        order =>
            order.status === "SERVED"
    );

    const paidOrders = orders.filter(
        order =>
            order.status === "PAID"
    );

    // ========================================
    // SALES
    // ========================================

    const todaySales = useMemo(() => {
        const today = new Date();

        return orders
            .filter(order => {
                if (
                    order.status !==
                    "PAID"
                ) {
                    return false;
                }

                const orderDate =
                    new Date(
                        order.createdAt
                    );

                return (
                    orderDate.getDate() ===
                        today.getDate() &&
                    orderDate.getMonth() ===
                        today.getMonth() &&
                    orderDate.getFullYear() ===
                        today.getFullYear()
                );
            })
            .reduce(
                (total, order) =>
                    total +
                    (order.totalAmount ||
                        0),
                0
            );
    }, [orders]);

    const totalSales = useMemo(() => {
        return orders
            .filter(
                order =>
                    order.status ===
                    "PAID"
            )
            .reduce(
                (total, order) =>
                    total +
                    (order.totalAmount ||
                        0),
                0
            );
    }, [orders]);

    // ========================================
    // FILTER ORDERS
    // ========================================

    const filteredOrders =
        useMemo(() => {
            return [...orders]
                .sort(
                    (a, b) =>
                        new Date(
                            b.createdAt
                        ).getTime() -
                        new Date(
                            a.createdAt
                        ).getTime()
                )
                .filter(order => {
                    const matchesStatus =
                        statusFilter ===
                            "ALL" ||
                        order.status ===
                            statusFilter;

                    const matchesTable =
                        searchTable.trim() ===
                            "" ||
                        String(
                            order.tableNumber
                        ).includes(
                            searchTable.trim()
                        );

                    return (
                        matchesStatus &&
                        matchesTable
                    );
                });
        }, [
            orders,
            statusFilter,
            searchTable,
        ]);

    // ========================================
    // STATUS CLASS
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

    const getDisplayStatus = (
        order: Order
    ) => {
        if (
            isBillGenerated(order)
        ) {
            return "Bill Generated";
        }

        return order.status;
    };

    const getDisplayStatusClass = (
        order: Order
    ) => {
        if (
            isBillGenerated(order)
        ) {
            return "text-success";
        }

        return getStatusClass(
            order.status
        );
    };

    // ========================================
    // BILLING ORDERS
    // ========================================

    const billingOrders =
        orders.filter(
            order =>
                order.status ===
                    "SERVED" ||
                order.status === "PAID"
        );

    // ========================================
    // STAFF COUNTS
    // ========================================

    const activeStaff =
        staffList.filter(
            staff => staff.isActive
        );

    const inactiveStaff =
        staffList.filter(
            staff => !staff.isActive
        );

    // ========================================
    // UI
    // ========================================

    return (
        <div className="min-vh-100 d-flex flex-column bg-light">
            <header className="bg-dark text-white shadow-sm sticky-top">
                <div className="container-fluid px-3 px-lg-4 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-warning text-dark rounded-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: 46, height: 46 }}>KF</div>
                            <div>
                                <div className="fw-bold fs-4 lh-1">KitchenFlow</div>
                                <div className="small text-white-50 mt-1">Restaurant Management System</div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <button type="button" className="btn btn-outline-light btn-sm" onClick={handleRefresh} disabled={refreshing}>
                                {refreshing ? "Refreshing..." : "↻ Refresh"}
                            </button>
                            <button type="button" className="btn btn-warning btn-sm fw-semibold" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <style>{`
                .manager-sidebar-card { scrollbar-width: thin; }
                .manager-sidebar-card::-webkit-scrollbar { width: 6px; }
                .manager-sidebar-card::-webkit-scrollbar-thumb { border-radius: 10px; background: #c9c9c9; }
                @media (max-width: 1199.98px) {
                    .manager-sidebar-card { position: static !important; max-height: none !important; overflow: visible !important; }
                }
                @media (max-width: 575.98px) {
                    .manager-nav-label { white-space: normal !important; }
                }
            `}</style>

            <main className="container-fluid px-3 px-lg-4 py-4 flex-grow-1">
                <div className="row g-4">
                    <aside className="col-12 col-lg-3 col-xl-3">
                        <div
                            className="card border-0 shadow-sm rounded-4 manager-sidebar-card"
                            style={{
                                position: "sticky",
                                top: 90,
                                maxHeight: "calc(100vh - 110px)",
                                overflowY: "auto",
                            }}
                        >
                            <div className="card-body p-3 p-xl-4">
                                <div
                                    className="small text-uppercase fw-bold text-muted px-2 mb-3"
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    Management
                                </div>

                                {[
                                    ["dashboard", "▦", "Dashboard"],
                                    ["menu", "🍽", "Menu Management"],
                                    ["staff", "♟", "Staff Management"],
                                    ["orders", "▤", "Orders"],
                                    ["billing", "▣", "Billing"],
                                ].map(([key, icon, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => { setActiveSection(key as typeof activeSection); setBill(null); }}
                                        className={`btn w-100 text-start d-flex align-items-center gap-3 px-3 py-3 mb-2 rounded-3 ${activeSection === key ? "btn-dark" : "btn-light"}`}
                                        style={{ minHeight: 58 }}
                                    >
                                        <span
                                            className="fs-5 flex-shrink-0 text-center"
                                            style={{ width: 28 }}
                                        >
                                            {icon}
                                        </span>
                                        <span
                                            className="fw-semibold manager-nav-label"
                                            style={{ whiteSpace: "nowrap" }}
                                        >
                                            {label}
                                        </span>
                                    </button>
                                ))}

                                <hr className="my-3" />
                                <div className="small text-muted px-2">
                                    <div className="fw-semibold text-dark mb-2">Quick overview</div>
                                    <div className="d-flex justify-content-between mb-2"><span>Menu items</span><strong>{menuItems.length}</strong></div>
                                    <div className="d-flex justify-content-between mb-2"><span>Active staff</span><strong>{activeStaff.length}</strong></div>
                                    <div className="d-flex justify-content-between"><span>Orders</span><strong>{orders.length}</strong></div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <section className="col-12 col-lg-9 col-xl-9">
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
                                <div>
                                    <div className="text-warning fw-bold small text-uppercase">Manager Panel</div>
                                    <h1 className="fw-bold mb-1">{activeSection === "dashboard" ? "Dashboard" : activeSection === "menu" ? "Menu Management" : activeSection === "staff" ? "Staff Management" : activeSection === "orders" ? "Orders" : "Billing"}</h1>
                                    <p className="text-muted mb-0">Manage your restaurant operations from one place.</p>
                                </div>
                                <div className="text-end">
                                    <div className="small text-muted">Today</div>
                                    <div className="fw-semibold">{new Date().toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>

            {/* MESSAGE */}

            {message && (
                <div
                    className={`alert alert-${messageType} d-flex justify-content-between align-items-center`}
                >
                    <span>
                        {message}
                    </span>

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() =>
                            setMessage("")
                        }
                    />
                </div>
            )}

            {/* DASHBOARD */}

            {activeSection ===
                "dashboard" && (
                <>
                    <div className="row g-3 mb-5">

                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card shadow-sm border-0 p-3 h-100">
                                <small className="text-muted">
                                    Total Orders
                                </small>

                                <h2 className="mb-0">
                                    {orders.length}
                                </h2>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card shadow-sm border-0 p-3 h-100">
                                <small className="text-muted">
                                    Active Orders
                                </small>

                                <h2 className="mb-0 text-primary">
                                    {newOrders.length +
                                        preparingOrders.length +
                                        readyOrders.length}
                                </h2>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card shadow-sm border-0 p-3 h-100">
                                <small className="text-muted">
                                    Today's Sales
                                </small>

                                <h2 className="mb-0 text-success">
                                    ₹{todaySales}
                                </h2>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card shadow-sm border-0 p-3 h-100">
                                <small className="text-muted">
                                    Total Sales
                                </small>

                                <h2 className="mb-0 text-success">
                                    ₹{totalSales}
                                </h2>
                            </div>
                        </div>

                    </div>

                    <div className="card p-4 mb-5">

                        <h2 className="mb-4">
                            Order Summary
                        </h2>

                        <div className="row g-3">

                            <div className="col-6 col-md">
                                <div className="bg-light rounded p-3 text-center">
                                    <h5>New</h5>
                                    <h3 className="text-primary">
                                        {newOrders.length}
                                    </h3>
                                </div>
                            </div>

                            <div className="col-6 col-md">
                                <div className="bg-light rounded p-3 text-center">
                                    <h5>Preparing</h5>
                                    <h3 className="text-warning">
                                        {preparingOrders.length}
                                    </h3>
                                </div>
                            </div>

                            <div className="col-6 col-md">
                                <div className="bg-light rounded p-3 text-center">
                                    <h5>Ready</h5>
                                    <h3 className="text-success">
                                        {readyOrders.length}
                                    </h3>
                                </div>
                            </div>

                            <div className="col-6 col-md">
                                <div className="bg-light rounded p-3 text-center">
                                    <h5>Served</h5>
                                    <h3 className="text-info">
                                        {servedOrders.length}
                                    </h3>
                                </div>
                            </div>

                            <div className="col-6 col-md">
                                <div className="bg-light rounded p-3 text-center">
                                    <h5>Paid</h5>
                                    <h3 className="text-secondary">
                                        {paidOrders.length}
                                    </h3>
                                </div>
                            </div>

                        </div>

                    </div>
                </>
            )}

            {/* MENU */}

            {activeSection ===
                "menu" && (
                <>
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
                                    onChange={e =>
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
                                    onChange={e =>
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
                                    onChange={e =>
                                        setPrice(
                                            e.target.value
                                        )
                                    }
                                    min="0"
                                    step="0.01"
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
                                    onChange={e =>
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
                                    onClick={
                                        clearForm
                                    }
                                >
                                    Cancel
                                </button>
                            )}

                        </form>

                    </div>

                    <div className="card p-4 mb-5">

                        <h2 className="mb-4">
                            Menu Management
                        </h2>

                        {menuLoading ? (
                            <p>
                                Loading menu items...
                            </p>
                        ) : menuItems.length ===
                          0 ? (
                            <p>
                                No menu items available.
                            </p>
                        ) : (
                            <div className="row">

                                {menuItems.map(item => (
                                    <div
                                        className="col-12 col-md-6 col-lg-4 mb-4"
                                        key={
                                            item._id
                                        }
                                    >
                                        <div className="card h-100 shadow-sm">

                                            {item.image && (
                                                <img
                                                    src={
                                                        item.image
                                                    }
                                                    alt={
                                                        item.name
                                                    }
                                                    className="card-img-top"
                                                    style={{
                                                        height:
                                                            "200px",
                                                        objectFit:
                                                            "cover",
                                                    }}
                                                    onError={e => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />
                                            )}

                                            <div className="card-body">

                                                <h4>
                                                    {
                                                        item.name
                                                    }
                                                </h4>

                                                <p>
                                                    <strong>
                                                        Category:
                                                    </strong>{" "}
                                                    {
                                                        item.category
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Price:
                                                    </strong>{" "}
                                                    ₹
                                                    {
                                                        item.price
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Status:
                                                    </strong>{" "}

                                                    <span
                                                        className={
                                                            item.isAvailable
                                                                ? "text-success"
                                                                : "text-danger"
                                                        }
                                                    >
                                                        {item.isAvailable
                                                            ? "Available"
                                                            : "Out of Stock"}
                                                    </span>
                                                </p>

                                                <button
                                                    type="button"
                                                    className="btn btn-warning me-2 mb-2"
                                                    onClick={() =>
                                                        handleEdit(
                                                            item
                                                        )
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
                </>
            )}

            {/* STAFF MANAGEMENT */}

            {activeSection ===
                "staff" && (
                <>
                    <div className="card p-4 mb-5">

                        <h2 className="mb-4">
                            {editingStaffId
                                ? "Edit Staff"
                                : "Add New Staff"}
                        </h2>

                        <form
                            onSubmit={
                                editingStaffId
                                    ? handleUpdateStaff
                                    : handleAddStaff
                            }
                        >

                            <div className="row">

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Staff Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            staffName
                                        }
                                        onChange={e =>
                                            setStaffName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter staff name"
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={
                                            staffEmail
                                        }
                                        onChange={e =>
                                            setStaffEmail(
                                                e.target.value
                                            )
                                        }
                                        placeholder="staff@gmail.com"
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            staffPhone
                                        }
                                        onChange={e =>
                                            setStaffPhone(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Staff Role
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            staffRole
                                        }
                                        onChange={e =>
                                            setStaffRole(
                                                e.target.value as
                                                    | "WAITER"
                                                    | "KITCHEN"
                                            )
                                        }
                                    >
                                        <option value="WAITER">
                                            Waiter
                                        </option>

                                        <option value="KITCHEN">
                                            Kitchen
                                        </option>
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Password{" "}
                                        {editingStaffId &&
                                            " (leave empty to keep old password)"}
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={
                                            staffPassword
                                        }
                                        onChange={e =>
                                            setStaffPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder={
                                            editingStaffId
                                                ? "New password"
                                                : "Enter password"
                                        }
                                        required={
                                            !editingStaffId
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Staff Image URL
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            staffImage
                                        }
                                        onChange={e =>
                                            setStaffImage(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter image URL"
                                    />
                                </div>

                            </div>

                            {staffImage && (
                                <div className="mb-3">

                                    <p className="mb-2">
                                        Image Preview
                                    </p>

                                    <img
                                        src={
                                            staffImage
                                        }
                                        alt="Staff preview"
                                        style={{
                                            width:
                                                "120px",
                                            height:
                                                "120px",
                                            objectFit:
                                                "cover",
                                            borderRadius:
                                                "50%",
                                            border:
                                                "3px solid #ddd",
                                        }}
                                        onError={e => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-danger me-2"
                                disabled={
                                    staffLoading
                                }
                            >
                                {staffLoading
                                    ? "Saving..."
                                    : editingStaffId
                                    ? "Update Staff"
                                    : "Add Staff"}
                            </button>

                            {editingStaffId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={
                                        clearStaffForm
                                    }
                                >
                                    Cancel
                                </button>
                            )}

                        </form>

                    </div>

                    <div className="card p-4 mb-5">

                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">

                            <div>
                                <h2 className="mb-1">
                                    Staff Management
                                </h2>

                                <small className="text-muted">
                                    Manage waiters and
                                    kitchen staff.
                                </small>
                            </div>

                            <div className="mt-2">

                                <span className="badge bg-success me-2">
                                    Active:{" "}
                                    {
                                        activeStaff.length
                                    }
                                </span>

                                <span className="badge bg-secondary">
                                    Inactive:{" "}
                                    {
                                        inactiveStaff.length
                                    }
                                </span>

                            </div>

                        </div>

                        {staffLoading ? (
                            <p>
                                Loading staff...
                            </p>
                        ) : staffList.length ===
                          0 ? (
                            <div className="alert alert-info">
                                No staff members
                                found.
                            </div>
                        ) : (
                            <div className="row">

                                {staffList.map(
                                    staff => (
                                        <div
                                            className="col-12 col-md-6 col-lg-4 mb-4"
                                            key={
                                                staff._id
                                            }
                                        >

                                            <div className="card h-100 shadow-sm">

                                                <div className="text-center pt-4">

                                                    {staff.image ? (
                                                        <img
                                                            src={
                                                                staff.image
                                                            }
                                                            alt={
                                                                staff.name
                                                            }
                                                            style={{
                                                                width:
                                                                    "120px",
                                                                height:
                                                                    "120px",
                                                                objectFit:
                                                                    "cover",
                                                                borderRadius:
                                                                    "50%",
                                                                border:
                                                                    "4px solid #eee",
                                                            }}
                                                            onError={e => {
                                                                e.currentTarget.style.display =
                                                                    "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="bg-light d-inline-flex align-items-center justify-content-center"
                                                            style={{
                                                                width:
                                                                    "120px",
                                                                height:
                                                                    "120px",
                                                                borderRadius:
                                                                    "50%",
                                                            }}
                                                        >
                                                            <span className="fs-1">
                                                                👤
                                                            </span>
                                                        </div>
                                                    )}

                                                </div>

                                                <div className="card-body text-center">

                                                    <h4 className="mb-1">
                                                        {
                                                            staff.name
                                                        }
                                                    </h4>

                                                    <span
                                                        className={`badge mb-3 ${
                                                            staff.role ===
                                                            "WAITER"
                                                                ? "bg-primary"
                                                                : "bg-warning text-dark"
                                                        }`}
                                                    >
                                                        {
                                                            staff.role
                                                        }
                                                    </span>

                                                    <p className="mb-1">
                                                        <strong>
                                                            Email:
                                                        </strong>
                                                        <br />
                                                        {
                                                            staff.email
                                                        }
                                                    </p>

                                                    <p className="mb-2">
                                                        <strong>
                                                            Phone:
                                                        </strong>{" "}
                                                        {
                                                            staff.phone
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Status:
                                                        </strong>{" "}

                                                        <span
                                                            className={
                                                                staff.isActive
                                                                    ? "text-success fw-bold"
                                                                    : "text-danger fw-bold"
                                                            }
                                                        >
                                                            {staff.isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </p>

                                                    <hr />

                                                    <button
                                                        type="button"
                                                        className="btn btn-warning btn-sm me-2 mb-2"
                                                        onClick={() =>
                                                            handleEditStaff(
                                                                staff
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={
                                                            staff.isActive
                                                                ? "btn btn-secondary btn-sm me-2 mb-2"
                                                                : "btn btn-success btn-sm me-2 mb-2"
                                                        }
                                                        onClick={() =>
                                                            handleStaffStatus(
                                                                staff
                                                            )
                                                        }
                                                    >
                                                        {staff.isActive
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm mb-2"
                                                        onClick={() =>
                                                            handleDeleteStaff(
                                                                staff._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>
                </>
            )}

            {/* BILLING */}

            {activeSection ===
                "billing" && (
                <div className="card p-4 mb-5">

                    <h2 className="mb-1">
                        Billing
                    </h2>

                    <small className="text-muted">
                        Generate bills for served
                        orders.
                    </small>

                    <hr />

                    {orderLoading ? (
                        <p>
                            Loading billing
                            orders...
                        </p>
                    ) : billingOrders.length ===
                      0 ? (
                        <div className="alert alert-info">
                            No served or paid
                            orders available.
                        </div>
                    ) : (
                        billingOrders.map(
                            order => {

                                const billGenerated =
                                    isBillGenerated(
                                        order
                                    );

                                return (
                                    <div
                                        className="card mb-3 p-3 shadow-sm"
                                        key={
                                            order._id
                                        }
                                    >

                                        <div className="d-flex justify-content-between align-items-center flex-wrap">

                                            <h4>
                                                Table{" "}
                                                {
                                                    order.tableNumber
                                                }
                                            </h4>

                                            <span
                                                className={`fw-bold ${getDisplayStatusClass(
                                                    order
                                                )}`}
                                            >
                                                {
                                                    getDisplayStatus(
                                                        order
                                                    )
                                                }
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
                                                    className="mb-2"
                                                >
                                                    <strong>
                                                        {
                                                            item.name
                                                        }
                                                    </strong>{" "}
                                                    ×{" "}
                                                    {
                                                        item.quantity
                                                    }

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
                                                </div>
                                            )
                                        )}

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

                                        <small className="text-muted">
                                            Created:{" "}
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </small>

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

                                        {billGenerated && (
                                            <div className="mt-3">

                                                <span className="badge bg-success fs-6 me-2">
                                                    ✓ Bill
                                                    Generated
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
                                                        ? "Loading..."
                                                        : "View Bill"}
                                                </button>

                                            </div>
                                        )}

                                    </div>
                                );
                            }
                        )
                    )}

                    {/* BILL DISPLAY */}

                    {bill && (
                        <div className="card mt-4 border-success">

                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

                                <h3 className="mb-0">
                                    Bill
                                </h3>

                                <button
                                    type="button"
                                    className="btn btn-light btn-sm"
                                    onClick={() =>
                                        setBill(
                                            null
                                        )
                                    }
                                >
                                    Close
                                </button>

                            </div>

                            <div className="card-body">

                                <p>
                                    <strong>
                                        Table:
                                    </strong>{" "}
                                    {
                                        bill.tableNumber
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Bill ID:
                                    </strong>{" "}
                                    {
                                        bill._id
                                    }
                                </p>

                                <hr />

                                {bill.items.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="d-flex justify-content-between mb-3"
                                        >

                                            <div>
                                                <strong>
                                                    {
                                                        item.name
                                                    }
                                                </strong>

                                                <div className="text-muted small">
                                                    ₹
                                                    {
                                                        item.price
                                                    }{" "}
                                                    ×{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </div>
                                            </div>

                                            <strong>
                                                ₹
                                                {
                                                    item.amount
                                                }
                                            </strong>

                                        </div>
                                    )
                                )}

                                <hr />

                                <div className="d-flex justify-content-between">

                                    <h4>
                                        Total Amount
                                    </h4>

                                    <h4 className="text-success">
                                        ₹
                                        {
                                            bill.totalAmount
                                        }
                                    </h4>

                                </div>

                                {/* PDF BUTTON */}

                                <div className="mt-4 d-flex gap-2 flex-wrap">

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() =>
                                            handleDownloadBillPdf(
                                                bill
                                            )
                                        }
                                    >
                                        📄 Download Bill PDF
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setBill(
                                                null
                                            )
                                        }
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

                </div>
            )}

            {/* ORDERS */}

            {activeSection ===
                "orders" && (
                <div className="card p-4 mb-5">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                        <div>
                            <h2 className="mb-1">
                                Orders Overview
                            </h2>

                            <small className="text-muted">
                                Manual refresh mode
                            </small>
                        </div>

                    </div>

                    <hr />

                    {/* SEARCH */}

                    <div className="row g-3 mb-4">

                        <div className="col-md-6">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by table number..."
                                value={
                                    searchTable
                                }
                                onChange={e =>
                                    setSearchTable(
                                        e.target
                                            .value
                                    )
                                }
                            />

                        </div>

                        <div className="col-md-6">

                            <select
                                className="form-select"
                                value={
                                    statusFilter
                                }
                                onChange={e =>
                                    setStatusFilter(
                                        e.target
                                            .value as
                                            | "ALL"
                                            | OrderStatus
                                    )
                                }
                            >

                                <option value="ALL">
                                    All Orders
                                </option>

                                <option value="NEW">
                                    New
                                </option>

                                <option value="PREPARING">
                                    Preparing
                                </option>

                                <option value="READY">
                                    Ready
                                </option>

                                <option value="SERVED">
                                    Served
                                </option>

                                <option value="PAID">
                                    Paid
                                </option>

                            </select>

                        </div>

                    </div>

                    {orderLoading ? (
                        <p>
                            Loading orders...
                        </p>
                    ) : filteredOrders.length ===
                      0 ? (
                        <p>
                            No matching orders.
                        </p>
                    ) : (
                        filteredOrders.map(
                            order => {

                                const billGenerated =
                                    isBillGenerated(
                                        order
                                    );

                                return (
                                    <div
                                        className="card mb-3 p-3 shadow-sm"
                                        key={
                                            order._id
                                        }
                                    >

                                        <div className="d-flex justify-content-between align-items-center flex-wrap">

                                            <h4>
                                                Table{" "}
                                                {
                                                    order.tableNumber
                                                }
                                            </h4>

                                            <span
                                                className={`fw-bold ${getDisplayStatusClass(
                                                    order
                                                )}`}
                                            >
                                                {
                                                    getDisplayStatus(
                                                        order
                                                    )
                                                }
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
                                                    className="mb-2"
                                                >

                                                    <strong>
                                                        {
                                                            item.name
                                                        }
                                                    </strong>{" "}
                                                    ×{" "}
                                                    {
                                                        item.quantity
                                                    }

                                                    {item.instructions && (
                                                        <div className="small text-muted">
                                                            Note:{" "}
                                                            {
                                                                item.instructions
                                                            }
                                                        </div>
                                                    )}

                                                </div>
                                            )
                                        )}

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

                                        <small className="text-muted">
                                            Created:{" "}
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </small>

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

                                        {billGenerated && (
                                            <div className="mt-3">

                                                <span className="badge bg-success fs-6 me-2">
                                                    ✓ Bill
                                                    Generated
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
                                                        ? "Loading..."
                                                        : "View Bill"}
                                                </button>

                                            </div>
                                        )}

                                    </div>
                                );
                            }
                        )
                    )}

                    {/* SHOW BILL FROM ORDERS */}

                    {bill && (
                        <div className="card mt-4 border-success">

                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">

                                <h3 className="mb-0">
                                    Bill
                                </h3>

                                <button
                                    type="button"
                                    className="btn btn-light btn-sm"
                                    onClick={() =>
                                        setBill(
                                            null
                                        )
                                    }
                                >
                                    Close
                                </button>

                            </div>

                            <div className="card-body">

                                <p>
                                    <strong>
                                        Table:
                                    </strong>{" "}
                                    {
                                        bill.tableNumber
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Bill ID:
                                    </strong>{" "}
                                    {
                                        bill._id
                                    }
                                </p>

                                <hr />

                                {bill.items.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="d-flex justify-content-between mb-3"
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        item.name
                                                    }
                                                </strong>

                                                <div className="text-muted small">
                                                    ₹
                                                    {
                                                        item.price
                                                    }{" "}
                                                    ×{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </div>

                                            </div>

                                            <strong>
                                                ₹
                                                {
                                                    item.amount
                                                }
                                            </strong>

                                        </div>
                                    )
                                )}

                                <hr />

                                <div className="d-flex justify-content-between">

                                    <h4>
                                        Total Amount
                                    </h4>

                                    <h4 className="text-success">
                                        ₹
                                        {
                                            bill.totalAmount
                                        }
                                    </h4>

                                </div>

                                {/* PDF BUTTON */}

                                <div className="mt-4 d-flex gap-2 flex-wrap">

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() =>
                                            handleDownloadBillPdf(
                                                bill
                                            )
                                        }
                                    >
                                        📄 Download Bill PDF
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setBill(
                                                null
                                            )
                                        }
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

                </div>
            )}

                    </section>
                </div>
            </main>

            <footer className="bg-dark text-white mt-auto">
                <div className="container py-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <strong>KitchenFlow</strong>
                            <span className="text-white-50 ms-2">Manager Dashboard</span>
                        </div>
                        <small className="text-white-50">
                            © {new Date().getFullYear()} KitchenFlow. All rights reserved.
                        </small>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Manager;