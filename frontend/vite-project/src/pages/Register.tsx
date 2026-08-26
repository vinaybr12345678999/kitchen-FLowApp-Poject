import { useState, } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        // Validation
        if (!name) {
            setError("Name is required");
            return;
        }

        if (!email) {
            setError("Email is required");
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email");
            return;
        }

        if (!password) {
            setError("Password is required");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!confirmPassword) {
            setError("Please confirm your password");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!role) {
            setError("Please select a role");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    email,
                    password,
                    role,
                }
            );

            const data = response.data;

            console.log("Registration successful:", data);

            alert("Registration successful!");

        } catch (error: any) {
            console.error("Registration error:", error);

            if (error.response) {
                setError(
                    error.response.data.message || "Registration failed"
                );
            } else {
                setError("Unable to connect to the server");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center">
            <div className="row justify-content-center w-100">
                <div className="col-md-5">

                    <h2 className="text-center mb-4">
                        KitchenFlow Register
                    </h2>

                    <form onSubmit={handleSubmit}>

                       
                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        
                        <div className="mb-3">
                            <label
                                htmlFor="name"
                                className="form-label text-start d-block"
                            >
                                Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>

                        
                        <div className="mb-3">
                            <label
                                htmlFor="email"
                                className="form-label text-start d-block"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>

                
                        <div className="mb-3">
                            <label
                                htmlFor="password"
                                className="form-label text-start d-block"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-3">
                            <label
                                htmlFor="confirmPassword"
                                className="form-label text-start d-block"
                            >
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>

                        {/* Role */}
                        <div className="mb-3">
                            <label
                                htmlFor="role"
                                className="form-label text-start d-block"
                            >
                                Role
                            </label>

                            <select
                                id="role"
                                name="role"
                                className="form-select"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    setError("");
                                }}
                            >
                                <option value="">Select Role</option>
                                <option value="WAITER">Waiter</option>
                                <option value="KITCHEN">Kitchen</option>
                                <option value="MANAGER">Manager</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>

                        <div className="text-center mt-3">
                            Already have an account?{" "}
                            <Link to="/login">Login in</Link>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Register;