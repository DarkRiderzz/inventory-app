/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { SpinnerImg } from "../../loader/Loader";
import "./productList.scss";
import { FaEdit, FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from "../../search/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_PRODUCTS,
  selectFilteredPoducts,
} from "../../../redux/features/product/filterSlice";
import ReactPaginate from "react-paginate";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  deleteProduct,
  getProducts,
} from "../../../redux/features/product/productSlice";
import { Link } from "react-router-dom";
import productService from "../../../redux/features/product/productService";
import useScanDetection from "use-scan-detection";

const ProductList = ({ products, isLoading }) => {
  const [incrementSearch, setIncSearch] = useState("");
  const [decrementSearch, setDecSearch] = useState("");
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredPoducts);

  // To exactly scane one product
  const [lastScannedProduct, setLastScannedProduct] = useState(null);
  const [lastMannalProductInc, setLastMannalProductInc] = useState(null);
  const [lastMannalProductDec, setLastMannalProductDec] = useState(null);

  //to switch between Scanner modes
  const [mode, setMode] = useState("increment"); // Mode state

  // handler for toggle button
  const toggleMode = () => {
    setMode((prevMode) =>
      prevMode === "increment" ? "decrement" : "increment"
    );
  };

  //switching between search modes
  const [isScanning, setIsScanning] = useState(false);
  const handleScannerMode = () => {
    setIsScanning(!isScanning);
  };
  //for barcode
  const [barcode, setBarcode] = useState("");
  useScanDetection({
    onComplete: setBarcode,
    minLength: 3,
  });

  const dispatch = useDispatch();
  // console.log("product is");
  // console.log(products);
  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  const delProduct = async (id) => {
    // console.log(id);

    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  //Function for Increment Product
  const addProduct = useCallback(
    async (id, quantity) => {
      // console.log(id);
      const updatedQuantity = Number(quantity) + 1; // Increment quantity
      const formData = new FormData();
      formData.append("quantity", Number(updatedQuantity));
      await productService.updateProduct(id, formData);
      await dispatch(getProducts());
    },
    [dispatch]
  );

  //Functon for Decremetn Product
  const decrementProduct = useCallback(
    async (id, quantity) => {
      // console.log(id);
      if (quantity > 0) quantity--;
      const formData = new FormData();
      formData.append("quantity", Number(quantity));
      await productService.updateProduct(id, formData);
      await dispatch(getProducts());
    },
    [dispatch]
  );

  // const handleScane = () => {
  //   setBarcode("admin");
  // };
  //Handle Increment and decrement of  product on scanning
  useEffect(() => {
    // console.log(barcode);
    if (barcode && !barcode.includes("Backspace") && mode === "increment") {
      setIncSearch(barcode);
    }

    if (barcode && !barcode.includes("Backspace") && mode === "decrement") {
      setDecSearch(barcode);
    }

    const matchingProduct = products.find(
      (product) => product.name === barcode
    );

    if (matchingProduct && matchingProduct._id !== lastScannedProduct) {
      if (mode === "increment") {
        addProduct(matchingProduct._id, matchingProduct.quantity);
      } else if (mode === "decrement") {
        decrementProduct(matchingProduct._id, matchingProduct.quantity);
      }
      setLastScannedProduct(matchingProduct._id);
    }

    setIncSearch("");
    // setBarcode("");
    // setTimeout(() => {
    //   setDecSearch("");
    // }, 2000);

    return () => {
      setLastScannedProduct(null);
      setBarcode("");
    };
  }, [
    barcode,
    products,
    addProduct,
    decrementProduct,
    // lastScannedProduct,
    mode,
  ]);

  // Handle manual search for increment
  useEffect(() => {
    const matchingProduct = products.find(
      (product) => product.name === incrementSearch
    );

    if (matchingProduct && matchingProduct._id !== lastMannalProductInc) {
      addProduct(matchingProduct._id, matchingProduct.quantity);
      setLastMannalProductInc(matchingProduct._id);
    }

    setIncSearch(""); // clear search after increment
    return () => {
      setLastMannalProductInc(null);
    };
  }, [incrementSearch, products, addProduct, lastMannalProductInc]);

  // Handle manual search for decrement
  useEffect(() => {
    const matchingProduct = products.find(
      (product) => product.name === decrementSearch
    );

    if (matchingProduct && matchingProduct._id !== lastMannalProductDec) {
      decrementProduct(matchingProduct._id, matchingProduct.quantity);
      setLastMannalProductDec(matchingProduct._id);
    }

    setDecSearch("");
    return () => {
      setLastMannalProductDec(null);
    };
  }, [decrementSearch, products, decrementProduct, lastMannalProductDec]);

  //   Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 50;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };
  //   End Pagination

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search: incrementSearch }));
  }, [products, incrementSearch, dispatch]);

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search: decrementSearch }));
  }, [products, decrementSearch, dispatch]);

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span className="--flex-between switch-search-cnt">
            <h3>Inventory Items</h3>
            <button onClick={handleScannerMode} className="toggle-mode-btn">
              {isScanning ? "Switch to Manual" : "Switch to Scan"}
            </button>
          </span>

          {isScanning ? (
            <div className="scanner-cnt --flex-between  ">
              {mode === "increment" ? (
                <span>
                  <Search
                    value={incrementSearch}
                    onChange={(e) => setIncSearch(e.target.value)}
                    placeholder="scan for increment"
                  />
                </span>
              ) : (
                <span>
                  <Search
                    value={decrementSearch}
                    onChange={(e) => setDecSearch(e.target.value)}
                    placeholder="scan for decrement"
                  />
                </span>
              )}
              <span>
                <button onClick={toggleMode} className="toggle-mode-btn">
                  {mode === "increment" ? "Increment Mode" : "Decrement Mode"}
                </button>
              </span>
            </div>
          ) : (
            <span>
              <Search
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search manually"
              />
            </span>
          )}
        </div>

        {isLoading && <SpinnerImg />}

        <div className="table">
          {!isLoading && products.length === 0 ? (
            <p>-- No product found, please add a product...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>SKU Code</th>
                  <th>Category</th>
                  <th>color</th>
                  <th>size</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((product, index) => {
                  const {
                    _id,
                    name,
                    category,
                    price,
                    quantity,
                    color,
                    size,
                    location,
                  } = product;
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortenText(name, 16)}</td>
                      <td>{category}</td>
                      <td>{color}</td>
                      <td>{size}</td>
                      <td>
                        {"₹"}
                        {price}
                      </td>
                      <td>{quantity}</td>
                      <td>{location}</td>
                      <td>
                        {"₹"}
                        {price * quantity}
                      </td>
                      <td className="icons">
                        <span>
                          <FaMinus
                            size={20}
                            color={"red"}
                            onClick={() => decrementProduct(_id, quantity)}
                          />
                        </span>
                        <span>
                          <FaPlus
                            size={20}
                            color={"green"}
                            onClick={() => addProduct(_id, quantity)}
                          />
                        </span>
                        <span>
                          <Link to={`/product-detail/${_id}`}>
                            <AiOutlineEye size={25} color={"purple"} />
                          </Link>
                        </span>
                        <span>
                          <Link to={`/edit-product/${_id}`}>
                            <FaEdit size={20} color={"blue"} />
                          </Link>
                        </span>
                        <span>
                          <FaTrashAlt
                            size={20}
                            color={"red"}
                            onClick={() => confirmDelete(_id)}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </div>
  );
};

export default ProductList;
