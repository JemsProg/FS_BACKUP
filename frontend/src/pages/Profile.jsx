// src/components/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { BASE_URL } from "../api/AuthApi";
import Loading from "../component/Loading";

const Profile = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(`${BASE_URL}profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          username: res.data.username,
          email: res.data.email,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    setIsLoading(true);

    try {
      await axios.post(`${BASE_URL}logout/`, JSON.stringify({ refresh }), {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      // clear tokens & auth state regardless of outcome
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Header with Logout */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <p className="text-lg text-gray-700">
            <span className="font-medium">Username:</span> {user.username}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-medium">Email:</span> {user.email}
          </p>
        </div>

        {/* Purchase History (static placeholder) */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Purchase History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src="image_url_here"
                      alt="product name here"
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    order id here
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link to="#" className="text-blue-600 hover:underline">
                      product name here
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">date here</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    amount here
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
