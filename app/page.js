"use client";
import Header from "@/components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";
import { modeContext } from "./context/context";
import { useContext } from "react";

export default function Home() {
  const { isDarkMode, toggleDarkMode } = useContext(modeContext);
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingaction, setLoadingaction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    // Fetch products on load
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    // Immediately change the quantity of the product with given slug in Products
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

    // Immediately change the quantity of the product with given slug in Dropdown
    let indexdrop = dropdown.findIndex((item) => item.slug == slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);

    setLoadingaction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    let r = await response.json();
    setLoadingaction(false);
  };

  const addProduct = async (e) => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        // Product added successfully
        setAlert("Your Product has been added!");
        setProductForm({});
      } else {
        // Handle error case
        console.error("Error adding product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // Fetch all the products again to sync back
    const response = await fetch("/api/product");
    let rjson = await response.json();
    setProducts(rjson.products);
    e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      if (rjson.success) {
        setDropdown(rjson.products);
      } else {
        setDropdown(rjson.message);
        console.log(dropdown);
      }
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };

  return (
    <div
    id="darkMode"
      className={`pt-4 px-8  ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      } transition duration-300`}
    >
      <Header />
      <div
        className="container mx-auto my-8 h-[40vh]"
        onBlur={() => {
          setDropdown([]);
        }}
      >
        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
        <div className="flex mb-2">
          <input
            onChange={onDropdownEdit}
            type="text"
            placeholder="Enter a product name"
            className="flex-1 border dark:text-zinc-700 border-gray-300 outline-none px-4 py-2 rounded-l-md"
          />
          <div className="searchIcon border border-gray-300 rounded-r-md">
            <div className="text-2xl text-green-500 font-bold  px-4 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
              &#128269;
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-fit bg-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}

        <div className="dropcontainer absolute w-[84vw] min-h-fit border-1 bg-purple-100 rounded-md ">
          {dropdown == "Product not found" ? (
            <div className="h-[8vh] pt-4 w-full">
              <h2 className="font-bold text-zinc-800 underline text-center">
                Product not found
              </h2>
            </div>
          ) : (
            dropdown.map((item) => {
              return (
                <div
                  key={item._id}
                  className="container flex justify-between py-2 px-4 my-1 border-b-2 dark:text-zinc-700"
                >
                  <span className="slug">
                    {" "}
                    {item.slug} ({item.quantity} available for ₹{item.price})
                  </span>
                  <div className="mx-5">
                    <button
                      onClick={() => {
                        buttonAction("minus", item.slug, item.quantity);
                      }}
                      disabled={loadingaction}
                      className="subtract inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                    >
                      {" "}
                      -{" "}
                    </button>

                    <span className="quantity inline-block  min-w-3 mx-3">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        buttonAction("plus", item.slug, item.quantity);
                      }}
                      disabled={loadingaction}
                      className="add inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                    >
                      {" "}
                      +{" "}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Display Current Stock  */}
      <div className="container mx-auto my-8">
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>

        <form>
          <div className="mb-4">
            <label htmlFor="productName" className="block mb-2">
              Product Name
            </label>
            <input
              value={productForm?.slug || ""}
              name="slug"
              onChange={handleChange}
              type="text"
              placeholder="Add your product"
              id="productName"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">
              Quantity
            </label>
            <input
              value={productForm?.quantity || ""}
              name="quantity"
              onChange={handleChange}
              type="number"
              placeholder="Enter your product quantity"
              id="quantity"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">
              Price
            </label>
            <input
              value={productForm?.price || ""}
              name="price"
              onChange={handleChange}
              type="number"
              placeholder="Enter your product price"
              id="price"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>

          <button
            onClick={addProduct}
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
          >
            Add Product
          </button>
        </form>
      </div>
      <div className="container my-8 mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>

        <table className="table-auto text-left w-full">
          <thead>
            <tr>
              <th className="px-4 py-4">Product Name</th>
              <th className="px-4 py-4">Quantity</th>
              <th className="px-4 py-4 ">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr key={product._id}>
                  <td className="border px-4 py-2">{product.slug}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">₹{product.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="bg-gray-200 text-center py-4 mt-8">
        <div className="flex justify-center items-center">
          <span className="text-black text-sm font-semibold">
            &copy; 2024 to 2025 (IMS) Company || All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
