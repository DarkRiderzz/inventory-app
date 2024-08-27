/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./ProductSummary.scss";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4, BsCartX } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import InfoBox from "../../infoBox/InfoBox";
import { useDispatch, useSelector } from "react-redux";
import {
  CALC_CATEGORY,
  CALC_OUTOFSTOCK,
  CALC_LIMITEDSTOCK,
  CALC_STORE_VALUE,
  selectCategory,
  selectOutOfStock,
  selectLimitedStock,
  selectTotalStoreValue,
} from "../../../redux/features/product/productSlice";

// Icons
const earningIcon = <AiFillDollarCircle size={40} color="#fff" />;
const productIcon = <BsCart4 size={40} color="#fff" />;
const categoryIcon = <BiCategory size={40} color="#fff" />;
const outOfStockIcon = <BsCartX size={40} color="#fff" />;

// Format Amount
export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductSummary = ({ products }) => {
  const dispatch = useDispatch();
  const totalStoreValue = useSelector(selectTotalStoreValue);
  const outOfStock = useSelector(selectOutOfStock);
  const limitedStock = useSelector(selectLimitedStock);
  const category = useSelector(selectCategory);

  useEffect(() => {
    dispatch(CALC_STORE_VALUE(products));
    dispatch(CALC_OUTOFSTOCK(products));
    dispatch(CALC_LIMITEDSTOCK(products));
    dispatch(CALC_CATEGORY(products));
  }, [dispatch, products]);

  console.log(products);

  return (
    <div className="product-summary">
      <h3 className="--mt">Inventory Stats</h3>
      <div className="info-summary">
        <InfoBox
          icon={productIcon}
          title={"Total Products"}
          count={products.length}
          bgColor="card1"
          link="dashboard"
        />
        <InfoBox
          icon={earningIcon}
          title={"Total Store Value"}
          count={`₹${formatNumbers(totalStoreValue.toFixed(1))} `}
          bgColor="card2"
          link="dashboard"
        />
        <InfoBox
          icon={outOfStockIcon}
          title={"Out of Stock"}
          count={outOfStock}
          link="out-of-stock-prodducts"
          bgColor="card3"
        />
        <InfoBox
          icon={outOfStockIcon}
          title={"Limited Stock"}
          count={limitedStock}
          link={"limited-products"}
          bgColor="card5"
        />
        {/* <InfoBox
          icon={categoryIcon}
          title={"All Categories"}
          count={category.length}
          bgColor="card4"
        /> */}
      </div>
    </div>
  );
};

export default ProductSummary;
