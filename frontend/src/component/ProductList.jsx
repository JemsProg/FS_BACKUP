import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { BASE_URL } from "../api/AuthApi";
import Loading from "./Loading";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}products`);
        setProducts(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-evenly gap-2 mt-25">
        {products.map((product, index) => (
          <div key={index} className="w-80 shadow-xl p-8">
            <Link to={`/product/${product.product_id}`}>
              <img src={`${BASE_URL}${product.image}`} alt="product" />
              <span className="font-bold">{product.product_name}</span>
              <div className="flex flex-wrap justify-between text-sm">
                <p>{product.brand}</p>
                <p>{product.product_price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
