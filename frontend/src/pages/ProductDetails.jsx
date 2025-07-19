import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { BASE_URL } from "../api/AuthApi";
import Loading from "../component/Loading";

const ProductDetails = () => {
  const [productDetail, setProductDetail] = useState({});
  const [availableStock, setAvailableStock] = useState(1);
  const { product_id } = useParams();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}products/${product_id}/`);
        setProductDetail(response.data);
        setAvailableStock(1);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load product details.");
      }
    };

    fetchProductDetail();
  }, [product_id]);

  const handleAddCart = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setMessage("You must log in to add items to your cart.");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}cart/add/`,
        {
          product_id: product_id,
          qty: availableStock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Added to cart!");
      console.log("Added to cart:", response.data);
    } catch (err) {
      if (err.response) {
        setMessage(`Error: ${err.response.data.detail || "Failed to add."}`);
      } else {
        setMessage("Error: Could not connect to server.");
      }
    }
  };

  const maxStock = productDetail.countInStock || 1;

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <div className="bg-white">
      <div className="pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <ChevronRightIcon className="h-5 w-5 text-gray-300" />
            </li>
            <li>
              <span className="text-gray-700">
                {productDetail.product_name || "Product"}
              </span>
            </li>
          </ol>
        </nav>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image */}
          <div className="lg:col-span-2 w-full">
            {productDetail.image ? (
              <img
                src={`${BASE_URL}${productDetail.image}`}
                alt={productDetail.product_name}
                className="w-full rounded-lg object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {productDetail.product_name}
              </h1>
              <p className="mt-2 text-xl text-indigo-600 font-semibold">
                ₱{productDetail.product_price}
              </p>
            </div>

            <p className="text-sm font-medium text-gray-700">
              Available Stock: {maxStock}
            </p>

            <div className="flex items-center space-x-4">
              <button
                disabled={availableStock <= 1}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() =>
                  setAvailableStock((prev) => Math.max(1, prev - 1))
                }
              >
                &minus;
              </button>
              <span className="w-8 text-center">{availableStock}</span>
              <button
                disabled={availableStock >= maxStock}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() =>
                  setAvailableStock((prev) => Math.min(maxStock, prev + 1))
                }
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddCart}
              className="w-full py-3 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add to Cart
            </button>

            {message && <p className="text-sm text-red-600 mt-2">{message}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900">Description</h2>
          <p className="mt-4 text-gray-700">
            {productDetail.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
