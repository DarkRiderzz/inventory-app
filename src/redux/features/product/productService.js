import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/products/`;

// Create New Product
const createProduct = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    withCredentials: true,
  });
  return response.data;
};

// Get all products
const getProducts = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

// Delete a Product
const deleteProduct = async (id) => {
  const response = await axios.delete(API_URL + id, { withCredentials: true });
  return response.data;
};

// Get a Product
const getProduct = async (id) => {
  const response = await axios.get(API_URL + id, { withCredentials: true });
  return response.data;
};

// Update Product
const updateProduct = async (id, formData) => {
  const response = await axios.patch(`${API_URL}${id}`, formData, {
    withCredentials: true,
  });
  return response.data;
};

const exportProducts = async () => {
  const response = await axios.get(`${API_URL}export-products`, {
    withCredentials: true,
  });
  return response.data;
};

const importProducts = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_URL}import-products`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const productService = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  exportProducts,
  importProducts,
};

export default productService;
