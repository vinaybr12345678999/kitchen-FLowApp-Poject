// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// function App() {
//     return (
//         <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//         </Routes>
//     );
// }

// export default App;
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Waiter from "./pages/waiter";
import Kitchen from "./pages/kitchen";
import Manager from "./pages/manager";
function App() {
    return (
        <Routes>

          

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />
            <Route
                path="/waiter"
                element={<Waiter />} />
            
            <Route
                path="/kitchen"
                element={<Kitchen />} />
            
            <Route
                path="/manager"
                element={<Manager />} />
            

        </Routes>
    );
}

export default App;