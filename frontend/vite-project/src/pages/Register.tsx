import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/colors.css";
import "../styles/Register.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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
        <div className="register-page">

            <div className="register-card">

                {/* Header */}
                <div className="register-header">
                    <div className="register-logo">
                        KF
                    </div>

                    <h1 className="register-title">
                        Create Account
                    </h1>

                    <p className="register-subtitle">
                        Join KitchenFlow and manage restaurant operations
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Error Message */}
                    {error && (
                        <div className="register-error">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="register-field">
                        <label
                            htmlFor="name"
                            className="register-label"
                        >
                            Full Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="register-input"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    {/* Email */}
                    <div className="register-field">
                        <label
                            htmlFor="email"
                            className="register-label"
                        >
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="register-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div className="register-field">
                        <label
                            htmlFor="password"
                            className="register-label"
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="register-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="register-field">
                        <label
                            htmlFor="confirmPassword"
                            className="register-label"
                        >
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="register-input"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    {/* Role */}
                    <div className="register-field">
                        <label
                            htmlFor="role"
                            className="register-label"
                        >
                            Staff Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            className="register-select"
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                setError("");
                            }}
                        >
                            <option value="">
                                Select your role
                            </option>

                            <option value="WAITER">
                                Waiter
                            </option>

                            <option value="KITCHEN">
                                Kitchen Staff
                            </option>

                            <option value="MANAGER">
                                Manager
                            </option>
                        </select>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* Login Link */}
                <div className="register-login-text">
                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="register-login-link"
                    >
                        Login
                    </Link>
                </div>

            </div>

        </div>
    );
};

export default Register;