// import { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import type { AppDispatch } from "../store/store";
// import { loginSuccess } from "../store/authSlice";

// import "../styles/colors.css";
// import "../styles/Login.css";

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState("");

//     const navigate = useNavigate();

//     // Redux dispatch
//     const dispatch = useDispatch<AppDispatch>();

//     const handleSubmit = async (
//         e: React.FormEvent<HTMLFormElement>
//     ) => {
//         e.preventDefault();

//         // Validation
//         if (!email) {
//             setError("Email is required");
//             return;
//         }

//         if (!email.includes("@")) {
//             setError("Please enter a valid email");
//             return;
//         }

//         if (!password) {
//             setError("Password is required");
//             return;
//         }

//         setError("");
//         setLoading(true);

//         try {
//             const response = await axios.post(
//                 "http://localhost:5000/api/auth/login",
//                 {
//                     email,
//                     password,
//                 }
//             );

//             const data = response.data;

//             console.log("Login successful:", data);
//             console.log("JWT Token:", data.token);

//             // ========================================
//             // Save login information to Redux
//             // ========================================

//             dispatch(
//                 loginSuccess({
//                     token: data.token,
//                     user: data.user,
//                 })
//             );

//             // ========================================
//             // Save login information to localStorage
//             // ========================================

//             localStorage.setItem("token", data.token);

//             localStorage.setItem(
//                 "user",
//                 JSON.stringify(data.user)
//             );

//             setSuccess("Login successful!");
//             setError("");

//             // ========================================
//             // Navigate based on role
//             // ========================================

//             setTimeout(() => {
//                 if (data.user.role === "WAITER") {
//                     navigate("/waiter");
//                 } else if (data.user.role === "KITCHEN") {
//                     navigate("/kitchen");
//                 } else if (data.user.role === "MANAGER") {
//                     navigate("/manager");
//                 }
//             }, 1000);

//         } catch (error: any) {
//             console.error("Login error:", error);

//             if (error.response) {
//                 setError(
//                     error.response.data.message ||
//                     "Login failed"
//                 );
//             } else {
//                 setError(
//                     "Unable to connect to the server"
//                 );
//             }

//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="login-page container-fluid min-vh-100 d-flex align-items-center">

//             <div className="row justify-content-center w-100">

//                 <div className="col-md-5">

//                     <h2 className="text-center mb-4">
//                         KitchenFlow Login
//                     </h2>

//                     <form onSubmit={handleSubmit}>

//                         {error && (
//                             <div className="alert alert-danger">
//                                 {error}
//                             </div>
//                         )}

//                         {success && (
//                             <div className="alert alert-success">
//                                 {success}
//                             </div>
//                         )}

//                         <div className="mb-3">

//                             <label
//                                 htmlFor="email"
//                                 className="form-label text-start d-block"
//                             >
//                                 Email
//                             </label>

//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 className="form-control"
//                                 placeholder="Enter your email"
//                                 value={email}
//                                 onChange={(e) => {
//                                     setEmail(e.target.value);
//                                     setError("");
//                                 }}
//                             />

//                         </div>

//                         <div className="mb-3">

//                             <label
//                                 htmlFor="password"
//                                 className="form-label text-start d-block"
//                             >
//                                 Password
//                             </label>

//                             <input
//                                 type="password"
//                                 id="password"
//                                 name="password"
//                                 className="form-control"
//                                 placeholder="Enter your password"
//                                 value={password}
//                                 onChange={(e) => {
//                                     setPassword(e.target.value);
//                                     setError("");
//                                 }}
//                             />

//                         </div>

//                         <button
//                             type="submit"
//                             className="login-button w-100"
//                             disabled={loading}
//                         >
//                             {loading
//                                 ? "Logging in..."
//                                 : "Login"}
//                         </button>

//                     </form>

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default Login;
// 
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { loginSuccess } from "../store/authSlice";

import "../styles/colors.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [selectedRole, setSelectedRole] = useState<"KITCHEN" | "WAITER" | "MANAGER">("MANAGER");

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        setEmail("");
        setPassword("");
        setError("");
        setSuccess("");
        setSelectedRole("MANAGER");
    }, []);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!email.trim()) {
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

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email: email.trim(),
                    password,
                }
            );

            const data = response.data;

            console.log("Login successful:", data);

            // Make the selected access button role-specific.
            // Example: Manager selected -> only MANAGER account can enter.
            if (data.user.role !== selectedRole) {
                const roleName =
                    selectedRole === "MANAGER"
                        ? "Manager"
                        : selectedRole === "WAITER"
                            ? "Waiter"
                            : "Kitchen Staff";

                setError(`This account does not have ${roleName} access.`);
                setSuccess("");
                return;
            }

            dispatch(
                loginSuccess({
                    token: data.token,
                    user: data.user,
                })
            );

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setEmail("");
            setPassword("");
            setError("");
            setSuccess("Login successful!");

            setTimeout(() => {
                if (data.user.role === "WAITER") {
                    navigate("/waiter", { replace: true });
                } else if (data.user.role === "KITCHEN") {
                    navigate("/kitchen", { replace: true });
                } else if (data.user.role === "MANAGER") {
                    navigate("/manager", { replace: true });
                }
            }, 500);
        } catch (error: any) {
            console.error("Login error:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                        "Login failed"
                );
            } else {
                setError("Unable to connect to the server");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="kf-login-page">
            <style>{`
                .kf-login-page {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 30px;
                    position: relative;
                    overflow: hidden;
                    background:
                        linear-gradient(
                            90deg,
                            rgba(12, 12, 12, 0.68) 0%,
                            rgba(12, 12, 12, 0.52) 43%,
                            rgba(12, 12, 12, 0.74) 100%
                        ),
                        url("/restaurant-login-bg.png") center / cover no-repeat;
                    font-family:
                        Inter,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                .kf-login-page::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(
                            circle at 18% 50%,
                            rgba(255, 193, 7, 0.14),
                            transparent 34%
                        ),
                        radial-gradient(
                            circle at 82% 50%,
                            rgba(255, 255, 255, 0.08),
                            transparent 30%
                        );
                    pointer-events: none;
                }

                .kf-login-layout {
                    width: min(1180px, 100%);
                    min-height: 680px;
                    display: grid;
                    grid-template-columns: 1.05fr 0.95fr;
                    position: relative;
                    z-index: 1;
                    border-radius: 28px;
                    overflow: hidden;
                    box-shadow:
                        0 30px 80px rgba(0, 0, 0, 0.45),
                        0 8px 25px rgba(0, 0, 0, 0.25);
                    border: 1px solid rgba(255, 255, 255, 0.16);
                    background: rgba(0, 0, 0, 0.18);
                }

                .kf-brand-panel {
                    min-height: 680px;
                    padding: 65px 55px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    color: white;
                    background:
                        linear-gradient(
                            135deg,
                            rgba(0, 0, 0, 0.46),
                            rgba(0, 0, 0, 0.20)
                        );
                }

                .kf-logo-row {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 22px;
                }

                .kf-logo {
                    width: 62px;
                    height: 62px;
                    display: grid;
                    place-items: center;
                    border-radius: 16px;
                    background: #ffc107;
                    color: #111;
                    font-size: 26px;
                    font-weight: 900;
                    box-shadow: 0 10px 30px rgba(255, 193, 7, 0.25);
                }

                .kf-brand-name {
                    margin: 0;
                    font-size: clamp(38px, 5vw, 58px);
                    line-height: 1;
                    font-weight: 800;
                    letter-spacing: -2px;
                }

                .kf-brand-name span {
                    color: #ffc107;
                }

                .kf-brand-subtitle {
                    margin: 12px 0 0;
                    color: rgba(255, 255, 255, 0.82);
                    font-size: 18px;
                    font-weight: 500;
                }

                .kf-divider {
                    width: 72px;
                    height: 4px;
                    border-radius: 20px;
                    background: #ffc107;
                    margin: 28px 0;
                }

                .kf-tagline {
                    max-width: 470px;
                    margin: 0;
                    font-size: 26px;
                    line-height: 1.35;
                    font-weight: 600;
                }

                .kf-description {
                    max-width: 500px;
                    margin: 18px 0 0;
                    color: rgba(255, 255, 255, 0.72);
                    line-height: 1.7;
                    font-size: 16px;
                }

                .kf-features {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 14px;
                    margin-top: 38px;
                    max-width: 580px;
                }

                .kf-feature {
                    padding: 18px 10px;
                    text-align: center;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.09);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    backdrop-filter: blur(8px);
                }

                .kf-feature-icon {
                    font-size: 25px;
                    margin-bottom: 8px;
                }

                .kf-feature-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.92);
                }

                .kf-login-side {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 45px;
                    background: rgba(248, 249, 250, 0.93);
                    backdrop-filter: blur(18px);
                }

                .kf-login-card {
                    width: 100%;
                    max-width: 455px;
                }

                .kf-mobile-logo {
                    display: none;
                }

                .kf-welcome {
                    margin-bottom: 28px;
                }

                .kf-welcome h2 {
                    margin: 0;
                    color: #20252b;
                    font-size: 34px;
                    font-weight: 800;
                    letter-spacing: -0.8px;
                }

                .kf-welcome p {
                    margin: 8px 0 0;
                    color: #69717a;
                    font-size: 15px;
                }

                .kf-alert {
                    padding: 12px 15px;
                    margin-bottom: 18px;
                    border-radius: 11px;
                    font-size: 14px;
                    font-weight: 600;
                }

                .kf-alert-error {
                    color: #842029;
                    background: #f8d7da;
                    border: 1px solid #f1aeb5;
                }

                .kf-alert-success {
                    color: #0f5132;
                    background: #d1e7dd;
                    border: 1px solid #a3cfbb;
                }

                .kf-field {
                    margin-bottom: 19px;
                }

                .kf-field label {
                    display: block;
                    margin-bottom: 8px;
                    color: #252a30;
                    font-size: 14px;
                    font-weight: 700;
                }

                .kf-input-wrap {
                    position: relative;
                }

                .kf-input-icon {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #858d96;
                    font-size: 18px;
                    pointer-events: none;
                }

                .kf-input {
                    width: 100%;
                    height: 54px;
                    padding: 0 16px 0 45px;
                    border: 1px solid #dce0e4;
                    border-radius: 12px;
                    outline: none;
                    background: #fff;
                    color: #20252b;
                    font-size: 15px;
                    box-sizing: border-box;
                    transition: 0.2s ease;
                }

                .kf-input:focus {
                    border-color: #f28c28;
                    box-shadow: 0 0 0 4px rgba(242, 140, 40, 0.13);
                }

                .kf-input::placeholder {
                    color: #a0a7ae;
                }

                .kf-login-button {
                    width: 100%;
                    height: 55px;
                    border: 0;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #f97316, #ea580c);
                    color: white;
                    font-size: 16px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: 0 9px 22px rgba(234, 88, 12, 0.25);
                    transition: 0.2s ease;
                }

                .kf-login-button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 12px 28px rgba(234, 88, 12, 0.32);
                }

                .kf-login-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .kf-login-button span {
                    margin-left: 8px;
                    font-size: 18px;
                }

                .kf-access-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 28px 0 14px;
                    color: #7a828b;
                    font-size: 13px;
                    font-weight: 600;
                }

                .kf-access-title::before,
                .kf-access-title::after {
                    content: "";
                    flex: 1;
                    height: 1px;
                    background: #dfe3e7;
                }

                .kf-roles {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }

                .kf-role {
                    width: 100%;
                    padding: 14px 8px;
                    border-radius: 11px;
                    text-align: center;
                    background: white;
                    border: 1px solid #e2e5e8;
                    color: #353b42;
                    cursor: pointer;
                    font: inherit;
                    transition: 0.2s ease;
                }

                .kf-role:hover {
                    border-color: #f59e0b;
                    transform: translateY(-1px);
                }

                .kf-role-active {
                    border: 2px solid #f59e0b;
                    background: #fff8e6;
                    box-shadow: 0 5px 15px rgba(245, 158, 11, 0.16);
                }

                .kf-role-icon {
                    display: block;
                    font-size: 22px;
                    margin-bottom: 5px;
                }

                .kf-role span:last-child {
                    font-size: 12px;
                    font-weight: 700;
                }

                .kf-quote {
                    margin: 27px 0 0;
                    text-align: center;
                    color: #858d96;
                    font-size: 14px;
                    font-style: italic;
                }

                .kf-footer {
                    margin-top: 28px;
                    text-align: center;
                    color: #9aa1a8;
                    font-size: 12px;
                }

                @media (max-width: 900px) {
                    .kf-login-page {
                        padding: 20px;
                    }

                    .kf-login-layout {
                        grid-template-columns: 1fr;
                        max-width: 540px;
                        min-height: auto;
                    }

                    .kf-brand-panel {
                        display: none;
                    }

                    .kf-login-side {
                        min-height: 650px;
                        padding: 40px 28px;
                    }

                    .kf-mobile-logo {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 22px;
                    }

                    .kf-mobile-logo .kf-logo {
                        width: 48px;
                        height: 48px;
                        border-radius: 13px;
                        font-size: 20px;
                    }

                    .kf-mobile-brand {
                        font-size: 29px;
                        font-weight: 800;
                        color: #20252b;
                    }

                    .kf-mobile-brand span {
                        color: #f59e0b;
                    }
                }

                @media (max-width: 480px) {
                    .kf-login-page {
                        padding: 0;
                    }

                    .kf-login-layout {
                        width: 100%;
                        min-height: 100vh;
                        border-radius: 0;
                        border: 0;
                    }

                    .kf-login-side {
                        padding: 32px 20px;
                    }

                    .kf-welcome h2 {
                        font-size: 29px;
                    }

                    .kf-roles {
                        gap: 7px;
                    }
                }
            `}</style>

            <div className="kf-login-layout">
                <section className="kf-brand-panel">
                    <div className="kf-logo-row">
                        <div className="kf-logo">KF</div>
                        <div>
                            <h1 className="kf-brand-name">
                                Kitchen<span>Flow</span>
                            </h1>
                            <p className="kf-brand-subtitle">
                                Restaurant Management System
                            </p>
                        </div>
                    </div>

                    <div className="kf-divider" />

                    <p className="kf-tagline">
                        Simplify operations. Serve happiness.
                    </p>

                    <p className="kf-description">
                        Manage your menu, orders, kitchen workflow,
                        staff and restaurant sales from one simple
                        platform.
                    </p>

                    <div className="kf-features">
                        <div className="kf-feature">
                            <div className="kf-feature-icon">🍽️</div>
                            <div className="kf-feature-title">
                                Manage Menu
                            </div>
                        </div>

                        <div className="kf-feature">
                            <div className="kf-feature-icon">👥</div>
                            <div className="kf-feature-title">
                                Track Orders
                            </div>
                        </div>

                        <div className="kf-feature">
                            <div className="kf-feature-icon">📊</div>
                            <div className="kf-feature-title">
                                Monitor Sales
                            </div>
                        </div>

                        <div className="kf-feature">
                            <div className="kf-feature-icon">⚙️</div>
                            <div className="kf-feature-title">
                                Manage Staff
                            </div>
                        </div>
                    </div>
                </section>

                <section className="kf-login-side">
                    <div className="kf-login-card">
                        <div className="kf-mobile-logo">
                            <div className="kf-logo">KF</div>
                            <div className="kf-mobile-brand">
                                Kitchen<span>Flow</span>
                            </div>
                        </div>

                        <div className="kf-welcome">
                            <h2>Welcome Back!</h2>
                            <p>
                                Login to continue to your dashboard
                            </p>
                        </div>

                        {error && (
                            <div className="kf-alert kf-alert-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="kf-alert kf-alert-success">
                                {success}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            autoComplete="off"
                        >
                            <div className="kf-field">
                                <label htmlFor="login-email">
                                    Email Address
                                </label>

                                <div className="kf-input-wrap">
                                    <span className="kf-input-icon">
                                        ✉
                                    </span>

                                    <input
                                        type="email"
                                        id="login-email"
                                        name="login-email"
                                        className="kf-input"
                                        placeholder="Enter your email"
                                        value={email}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError("");
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="kf-field">
                                <label htmlFor="login-password">
                                    Password
                                </label>

                                <div className="kf-input-wrap">
                                    <span className="kf-input-icon">
                                        🔒
                                    </span>

                                    <input
                                        type="password"
                                        id="login-password"
                                        name="login-password"
                                        className="kf-input"
                                        placeholder="Enter your password"
                                        value={password}
                                        autoComplete="new-password"
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError("");
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="kf-login-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login"}
                                {!loading && <span>→</span>}
                            </button>
                        </form>

                        <div className="kf-access-title">
                            Access for {selectedRole === "MANAGER" ? "Manager" : selectedRole === "WAITER" ? "Waiter" : "Kitchen Staff"}
                        </div>

                        <div className="kf-roles">
                            <button
                                type="button"
                                className={`kf-role ${selectedRole === "KITCHEN" ? "kf-role-active" : ""}`}
                                onClick={() => {
                                    setSelectedRole("KITCHEN");
                                    setError("");
                                    setSuccess("");
                                }}
                            >
                                <span className="kf-role-icon">👨‍🍳</span>
                                <span>Kitchen Staff</span>
                            </button>

                            <button
                                type="button"
                                className={`kf-role ${selectedRole === "WAITER" ? "kf-role-active" : ""}`}
                                onClick={() => {
                                    setSelectedRole("WAITER");
                                    setError("");
                                    setSuccess("");
                                }}
                            >
                                <span className="kf-role-icon">🧑‍💼</span>
                                <span>Waiter</span>
                            </button>

                            <button
                                type="button"
                                className={`kf-role ${selectedRole === "MANAGER" ? "kf-role-active" : ""}`}
                                onClick={() => {
                                    setSelectedRole("MANAGER");
                                    setError("");
                                    setSuccess("");
                                }}
                            >
                                <span className="kf-role-icon">👑</span>
                                <span>Manager</span>
                            </button>
                        </div>

                        <div className="kf-quote">
                            “Great food. Greater experiences.”
                        </div>

                        <div className="kf-footer">
                            © {new Date().getFullYear()} KitchenFlow.
                            All rights reserved.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;
