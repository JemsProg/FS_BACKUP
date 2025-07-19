import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../api/AuthApi";
import { AuthContext } from "../context/AuthProvider";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setloginForm] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setloginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(loginForm.username, loginForm.password, setMessage);
    // After login, check if authenticated and redirect
    if (localStorage.getItem("access_token")) {
      navigate("/profile", { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center h-200 bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome to RivanShop
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              onChange={handleChange}
              name="username"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-10">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={handleChange}
                name="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {message && <p className="text-red-500 mt-4">{message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#FFFAFA] text-black font-semibold py-2 rounded-lg shadow-lg hover:bg-gray-900 hover:text-white focus:ring-2 focus:ring-primary"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
