import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchedValue, setSearchedValue] = useState("");
  const [filterProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState([]);

  // console.log(inputValue);
  console.log(selectCategory);
  useEffect(() => {
    handleFilter();
  }, [searchedValue, selectCategory]);

  useEffect(() => {
    fetch("https://y-taupe-chi.vercel.app/products?page=1&limit=40")
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.products;
        setData(allProducts);
        setFilteredProducts(allProducts);
        const uniqueCategory = Array.from(
          new Set(allProducts.map((product) => product.category))
        );
        setCategories(uniqueCategory);
      });
  }, []);

  const handleFilter = () => {
    let result = data;
    if (searchedValue) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchedValue.toLowerCase())
      );
    }
    if (selectCategory) {
      result = result.filter((product) => product.category === selectCategory);
    }
    setFilteredProducts(result);
  };

  const handleSearchOnChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSearched = () => {
    setSearchedValue(inputValue);
  };
  const handleCategoryChange = (e) => {
    setSelectCategory(e.target.value);
  };

  return (
    <div className="flex flex-col justify-center p-10">
      <div className="my-10 flex justify-center items-center">
        <div className="flex items-center justify-center ">
          <input
            value={inputValue}
            onChange={handleSearchOnChange}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full  outline-none max-w-xs"
          />
          <button
            onClick={handleSearched}
            className=" -ml-10 p-3 rounded-r-xl bg-purple-800 text-white "
          >
            Search
          </button>
        </div>
        <div>
          <select onChange={handleCategoryChange} value={selectCategory}>
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div>
          {filterProducts.length === 0 ? (
            <h2>No Product Found</h2>
          ) : (
            <>
              <h1>Total Products: {filterProducts.length} </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filterProducts.map((product) => (
                  <>
                    <div
                      className="card bg-base-100  shadow-xl p-5"
                      key={product.name}
                    >
                      <figure>
                        <img
                          className="h-[400px] mb-2 w-full"
                          src={product.image}
                          alt={product.name}
                        />
                      </figure>

                      <h2 className="card-title">Shoes!</h2>
                      <p className="capitalize">name: {product.name}</p>
                      <p className="capitalize">price: {product.price}</p>
                      <p className="capitalize">
                        description: {product.description}
                      </p>
                      <p className="capitalize">brand: {product.brand}</p>
                      <p className="capitalize">category: {product.category}</p>
                      <p className="capitalize">ratings: {product.ratings}</p>
                    </div>
                  </>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
