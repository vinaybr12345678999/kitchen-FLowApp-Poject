// import { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/Tables.css";

// interface Table {
//     _id: string;
//     tableNumber: number;
//     status: "AVAILABLE" | "OCCUPIED";
// }

// const Tables = () => {
//     const [tables, setTables] = useState<Table[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     // Fetch tables from backend
//     const fetchTables = async () => {
//         console.log("Fetching tables...");

//         try {
//             setLoading(true);
//             setError("");

//             const response = await axios.get(
//                 "http://localhost:5000/api/tables"
//             );

//             console.log("Tables received:", response.data);

//             setTables(response.data);

//         } catch (error) {
//             console.error("Error fetching tables:", error);

//             setError("Unable to load tables.");

//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch tables when page loads
//     useEffect(() => {
//         fetchTables();
//     }, []);

//     // Loading state
//     if (loading) {
//         return (
//             <div className="tables-page">
//                 <p>Loading tables...</p>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="tables-page">
//                 <p className="error-message">{error}</p>

//                 <button
//                     type="button"
//                     onClick={fetchTables}
//                 >
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="tables-page">

//             {/* Header */}
//             <div className="tables-header">

//                 <div>
//                     <h1>Restaurant Tables</h1>
//                     <p>Select a table to start an order</p>
//                 </div>

//                 <button
//                     type="button"
//                     onClick={fetchTables}
//                 >
//                     Refresh
//                 </button>

//             </div>

//             {/* Empty state */}
//             {tables.length === 0 ? (
//                 <div className="empty-state">
//                     <p>No tables available.</p>
//                 </div>
//             ) : (

//                 /* Tables */
//                 <div className="tables-grid">

//                     {tables.map((table) => (

//                         <div
//                             key={table._id}
//                             className={`table-card ${table.status.toLowerCase()}`}
//                         >

//                             <div className="table-number">
//                                 Table {table.tableNumber}
//                             </div>

//                             <div className="table-status">
//                                 <span className="status-dot"></span>

//                                 {table.status}
//                             </div>

//                         </div>

//                     ))}

//                 </div>
//             )}

//         </div>
//     );
// };

// export default Tables;