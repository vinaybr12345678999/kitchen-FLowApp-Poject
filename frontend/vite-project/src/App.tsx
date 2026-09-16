// import { Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Waiter from "./pages/Waiter";
// import Kitchen from "./pages/Kitchen";
// import Manager from "./pages/Manager";
// import Menu from "./pages/Menu";

// import ProtectedRoute from "./protectedRoute";

// function App() {
//     return (
//         <Routes>

//             {/* Public routes */}

//             <Route
//                 path="/login"
//                 element={<Login />}
//             />

//             <Route
//                 path="/register"
//                 element={<Register />}
//             />

//             {/* WAITER */}

//             <Route
//                 path="/waiter"
//                 element={
//                     <ProtectedRoute allowedRole="WAITER">
//                         <Waiter />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* KITCHEN */}

//             <Route
//                 path="/kitchen"
//                 element={
//                     <ProtectedRoute allowedRole="KITCHEN">
//                         <Kitchen />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* MANAGER */}

//             <Route
//                 path="/manager"
//                 element={
//                     <ProtectedRoute allowedRole="MANAGER">
//                         <Manager />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* MENU - waiter only */}

//             <Route
//                 path="/menu"
//                 element={
//                     <ProtectedRoute allowedRole="WAITER">
//                         <Menu />
//                     </ProtectedRoute>
//                 }
//             />

//         </Routes>
//     );
// }

// export default App;
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import Waiter from "./pages/Waiter";
import Kitchen from "./pages/Kitchen";
import Manager from "./pages/Manager";
import Menu from "./pages/Menu";

import ProtectedRoute from "./ProtectedRoute";
function App() {
    return (
        <Routes>

            {/* ========================================
                ROOT
                / -> /login
            ======================================== */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* ========================================
                PUBLIC ROUTES
            ======================================== */}

            <Route
                path="/login"
                element={<Login />}
            />

          
            {/* ========================================
                WAITER
            ======================================== */}

            <Route
                path="/waiter"
                element={
                    <ProtectedRoute allowedRole="WAITER">
                        <Waiter />
                    </ProtectedRoute>
                }
            />

            {/* ========================================
                KITCHEN
            ======================================== */}

            <Route
                path="/kitchen"
                element={
                    <ProtectedRoute allowedRole="KITCHEN">
                        <Kitchen />
                    </ProtectedRoute>
                }
            />

            {/* ========================================
                MANAGER
            ======================================== */}

            <Route
                path="/manager"
                element={
                    <ProtectedRoute allowedRole="MANAGER">
                        <Manager />
                    </ProtectedRoute>
                }
            />

            {/* ========================================
                MENU
            ======================================== */}

            <Route
    path="/menu"
    element={<Menu />}
/>

        </Routes>
    );
}

export default App;