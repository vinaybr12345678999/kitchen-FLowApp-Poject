import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole: "WAITER" | "KITCHEN" | "MANAGER";
}

const ProtectedRoute = ({
    children,
    allowedRole,
}: ProtectedRouteProps) => {

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Not logged in
    if (!token || !userData) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {
        console.error("Invalid user data");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    // Role doesn't match
    if (user.role !== allowedRole) {

        if (user.role === "WAITER") {
            return <Navigate to="/waiter" replace />;
        }

        if (user.role === "KITCHEN") {
            return <Navigate to="/kitchen" replace />;
        }

        if (user.role === "MANAGER") {
            return <Navigate to="/manager" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;