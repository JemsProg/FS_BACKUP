import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/AuthApi";

const ShippingDetails = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    email: "",
    mobile: "",
  });

  const [error, setError] = useState("");
  const subtotal = localStorage.getItem("subtotal") || 0;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `${BASE_URL}api/payments/create/`,
        {
          ...formData,
          total_price: parseFloat(subtotal),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else {
        setError("Failed to create payment link.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
      {[
        "full_name",
        "address",
        "city",
        "postal_code",
        "country",
        "email",
        "mobile",
      ].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.replace("_", " ").toUpperCase()}
          value={formData[field]}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
      ))}
      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={handleCheckout}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Pay with GCash
      </button>
    </div>
  );
};

export default ShippingDetails;
