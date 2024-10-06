import React, { useEffect, useState } from "react";
import { FaEdit, FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link } from "react-router-dom";

import {
  CALC_LIMITEDSTOCK,
  deleteProduct,
  getProducts,
  selectLimitedStockProducts,
} from "../../redux/features/product/productSlice";
import productService from "../../redux/features/product/productService";
import Search from "../../components/search/Search";
import { SpinnerImg } from "../../components/loader/Loader";
import {
  FILTER_PRODUCTS,
  selectFilteredPoducts,
} from "../../redux/features/product/filterSlice";
import ReactPaginate from "react-paginate";

const LimitedProduct = ({ isLoading }) => {
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredPoducts);
  const limitedStockProducts = useSelector(selectLimitedStockProducts);
  const { products } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CALC_LIMITEDSTOCK(products));
  }, [dispatch, products]);

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  const delProduct = async (id) => {
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

  // Increment Product
  const addProduct = async (id, quantity) => {
    console.log(id);
    quantity++;
    const formData = new FormData();
    formData.append("quantity", Number(quantity));
    await productService.updateProduct(id, formData);
    await dispatch(getProducts());
  };

  //Decremetn Product
  const decrementProduct = async (id, quantity) => {
    console.log(id);
    if (quantity > 0) quantity--;
    const formData = new FormData();
    formData.append("quantity", Number(quantity));
    await productService.updateProduct(id, formData);
    await dispatch(getProducts());
  };

  //Begin Pagination
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
  // End Pagination
  useEffect(() => {
    const limitedStockArray = Array.isArray(limitedStockProducts)
      ? limitedStockProducts
      : [limitedStockProducts];
    dispatch(FILTER_PRODUCTS({ products: limitedStockArray, search }));
  }, [limitedStockProducts, search, dispatch]);

  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Limited Stock</h3>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search product"
            />
          </span>
        </div>

        {isLoading && <SpinnerImg />}

        <div className="table">
          {!isLoading && limitedStockProducts.length === 0 ? (
            <p>-- No product found, please add a product...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>S No.</th>
                  <th>Title</th>
                  <th>SKU Code</th>
                  <th>Category</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>COGS</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((limitedStockProducts, index) => {
                  const {
                    _id,
                    title,
                    sku,
                    category,
                    price,
                    quantity,
                    color,
                    size,
                    location,
                  } = limitedStockProducts;
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortenText(title, 25)}</td>
                      <td>{shortenText(sku, 16)}</td>
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

export default LimitedProduct;
