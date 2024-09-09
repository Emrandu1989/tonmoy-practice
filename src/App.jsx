import React, { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchedValue, setSearchedValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 9; // Number of items per page

  useEffect(() => {
    handleFilter();
  }, [searchedValue, selectCategory]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = (page) => {
    fetch(`https://y-taupe-chi.vercel.app/products?page=${page}&limit=${itemsPerPage}`)
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.products;
        setData(allProducts);
        setFilteredProducts(allProducts);
        setTotalPages(data.totalPages || 1); // Set total pages
        const uniqueCategories = Array.from(
          new Set(allProducts.map((product) => product.category))
        );
        setCategories(uniqueCategories);
      });
  };

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
    setCurrentPage(1); // Reset to the first page after search
  };

  const handleCategoryChange = (e) => {
    setSelectCategory(e.target.value);
    // setCurrentPage(1); // Reset to the first page after category change
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col justify-center p-10">
      {/* Search Bar */}
      <div className="my-10 flex justify-center items-center">
        <div className="flex items-center justify-center">
          <input
            value={inputValue}
            onChange={handleSearchOnChange}
            type="text"
            placeholder="Search products"
            className="input input-bordered w-full outline-none max-w-xs"
          />
          <button
            onClick={handleSearched}
            className=" -ml-10 p-3 rounded-r-xl bg-purple-800 text-white"
          >
            Search
          </button>
        </div>

        {/* Category Filter */}
        <div>
          <select onChange={handleCategoryChange} value={selectCategory}>
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="flex justify-center items-center">
        <div>
          {filteredProducts.length === 0 ? (
            <h2>No Products Found</h2>
          ) : (
            <>
              <h1>Total Products: {filteredProducts.length} </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <div className="card bg-base-100 shadow-xl p-5" key={product.name}>
                    <figure>
                      <img className="h-[400px] mb-2 w-full" src={product.image} alt={product.name} />
                    </figure>

                    <h2 className="card-title">{product.name}</h2>
                    <p>Price: ${product.price}</p>
                    <p>Description: {product.description}</p>
                    <p>Brand: {product.brand}</p>
                    <p>Category: {product.category}</p>
                    <p>Ratings: {product.ratings}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-purple-600 text-white rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-purple-600 text-white rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
