import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../card/Card";

import "./ProductForm.scss";

const ProductForm = ({
  product,
  productImage,
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange,
  saveProduct,
}) => {
  return (
    <div className="add-product">
      <Card cardClass={"card"}>
        <form onSubmit={saveProduct} className="flex-form">
          <div className="w-450">
            <label>Product Title:</label>
            <input
              type="text"
              placeholder="Product title"
              name="title"
              value={product?.title}
              onChange={handleInputChange}
            />
            <label>SKU Code:</label>
            <input
              type="text"
              placeholder="SKU Code"
              name="sku"
              value={product?.sku}
              onChange={handleInputChange}
            />

            <label>Product Price:</label>
            <input
              type="text"
              placeholder="Product Price"
              name="price"
              value={product?.price}
              onChange={handleInputChange}
            />

            <label>Product Quantity:</label>
            <input
              type="text"
              placeholder="Product Quantity"
              name="quantity"
              value={product?.quantity}
              onChange={handleInputChange}
            />

            <label>Product Category:</label>
            <input
              type="text"
              placeholder="Product Category"
              name="category"
              value={product?.category}
              onChange={handleInputChange}
            />

            <label>Product Color:</label>
            <input
              type="text"
              placeholder="Product Color"
              name="color"
              value={product?.color}
              onChange={handleInputChange}
            />

            <label>Product Size:</label>
            <input
              type="text"
              placeholder="Product Size"
              name="size"
              value={product?.size}
              onChange={handleInputChange}
            />

            <label>Product Location:</label>
            <input
              type="text"
              placeholder="Product Location"
              name="location"
              value={product?.location}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Card cardClass={"group"}>
              {/* <label>Product Image</label> */}
              <input
                type="file"
                name="image"
                onChange={(e) => handleImageChange(e)}
              />

              {imagePreview != null ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="product" />
                </div>
              ) : (
                <p></p>
              )}
            </Card>
            <label className="product-dec">Product Description:</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={ProductForm.modules}
              formats={ProductForm.formats}
            />
            <div className="--my">
              <button type="submit" className="btn-primary">
                Save Product
              </button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default ProductForm;
