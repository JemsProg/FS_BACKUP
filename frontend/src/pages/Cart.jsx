import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BASE_URL } from "../api/AuthApi";
import Loading from "../component/Loading";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${BASE_URL}cart/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setCartItems(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    };
    fetchCart();
  }, [navigate]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) =>
        sum + item.qty * parseFloat(item.product.product_price || 0),
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  const handleRemove = async (cart_id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${BASE_URL}cart/${cart_id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((item) => item.cart_id !== cart_id));
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handleQtyChange = async (cart_id, newQty) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.put(
        `${BASE_URL}cart/${cart_id}/`,
        { qty: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems((prev) =>
        prev.map((item) => (item.cart_id === cart_id ? res.data : item))
      );
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-20 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600">Your cart is empty.</p>
          <Link
            to="/products"
            className="mt-6 inline-block text-indigo-600 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-20 lg:py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>

        <ul className="divide-y divide-gray-200 mb-8">
          {cartItems.map((item) => (
            <li key={item.cart_id} className="flex items-center py-6">
              <img
                src={
                  item.product.image
                    ? `${BASE_URL}${item.product.image}`
                    : "https://via.placeholder.com/100x100.png?text=No+Image"
                }
                alt={item.product.product_name}
                className="h-24 w-24 rounded object-cover"
              />
              <div className="flex-1 ml-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.product.product_name}
                </h3>
                <div className="mt-1">
                  <label className="text-sm text-gray-500 mr-2">Qty:</label>
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      handleQtyChange(
                        item.cart_id,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="border rounded px-2 py-1"
                  >
                    {[...Array(item.product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-900 mt-2 font-semibold">
                  ₱
                  {(
                    item.qty * parseFloat(item.product.product_price || 0)
                  ).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleRemove(item.cart_id)}
                className="text-gray-400 hover:text-red-600 ml-4"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </li>
          ))}
        </ul>

        <div className="bg-gray-50 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order Summary
          </h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 text-base font-medium"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
