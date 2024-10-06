import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  importProducts,
  selectImportStatus,
} from "../../../redux/features/product/productSlice";
import "./limportProduct.css";
import { toast } from "react-toastify";

const ImportProducts = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const importStatus = useSelector(selectImportStatus);
  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    if (importStatus === "succeeded") {
      toast.success("File uploaded successfully");
      setFile(null);
    } else if (importStatus === "failed") {
      toast.error(
        `Error: ${error || "There was an error while uploading the file"}`
      );
    }
  }, [importStatus, error]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      dispatch(importProducts(file));
    }
  };

  const handleRemoveFile = () => {
    setFile(null); // Remove the selected file
  };

  return (
    <div className="import-products-container">
      <div className="import-products-form">
        {file ? (
          <div className="import-products-file-info">
            <span>{file.name}</span>
            <button
              className="import-products-remove-file"
              onClick={handleRemoveFile}
            >
              ✖
            </button>
          </div>
        ) : (
          <label className="import-products-label">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="import-products-input"
            />
            <span>Choose CSV File</span>
          </label>
        )}
        <button
          onClick={handleUpload}
          disabled={importStatus === "loading" || !file}
          className="btn-secondary"
        >
          {importStatus === "loading" ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default ImportProducts;
