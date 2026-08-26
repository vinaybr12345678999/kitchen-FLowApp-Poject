import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [success, setSuccess] = useState("");


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Validation
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

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password,
                }
            );

            const data = response.data;

            console.log("Login successful:", data);
            console.log("JWT Token:", data.token);

            localStorage.setItem("token", data.token);
            // Store user information
             localStorage.setItem("user", JSON.stringify(data.user));

            setSuccess("Login successful!");
            setError("");

                  // Navigate based on role
            setTimeout(() => {
                if (data.user.role === "WAITER") {
                    navigate("/waiter");
                } else if (data.user.role === "KITCHEN") {
                    navigate("/kitchen");
                } else if (data.user.role === "MANAGER") {
                    navigate("/manager");
                }
            }, 1000);

        } catch (error: any) {
            console.error("Login error:", error);

            if (error.response) {
                setError(
                    error.response.data.message || "Login failed"
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
           KitchenFlow Login
       </h2>

     <form onSubmit={handleSubmit}>

        
        {error && (
         <div className="alert alert-danger">
              {error}
               </div>
                 )}

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

                     // clear the error when the user starts correcting the field.
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

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default Login;