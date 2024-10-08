import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";
import { toast } from "react-toastify";

const initialState = {
  product: null,
  products: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  importStatus: "idle",
  downloadStatus: "idle",
  totalStoreValue: 0,
  outOfStock: 0,
  outOfStockProducts: [],
  limitedStockProducts: [],
  limitedStock: 0,
  category: [],
  error: null,
};

// Async thunk for importing products
export const importProducts = createAsyncThunk(
  "products/importProducts",
  async (file, thunkAPI) => {
    try {
      const response = await productService.importProducts(file);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Create New Product
export const createProduct = createAsyncThunk(
  "products/create",
  async (formData, thunkAPI) => {
    try {
      return await productService.createProduct(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all products
export const getProducts = createAsyncThunk(
  "products/getAll",
  async (_, thunkAPI) => {
    try {
      return await productService.getProducts();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a Product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      return await productService.deleteProduct(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get a product
export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (id, thunkAPI) => {
    try {
      return await productService.getProduct(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const exportProducts = createAsyncThunk(
  "products/exportProducts",
  async (_, thunkAPI) => {
    try {
      return await productService.exportProducts();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      // console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    CALC_STORE_VALUE(state, action) {
      const products = action.payload;
      const array = [];
      products.map((item) => {
        const { price, quantity } = item;
        const productValue = price * quantity;
        return array.push(productValue);
      });
      const totalValue = array.reduce((a, b) => {
        return a + b;
      }, 0);
      state.totalStoreValue = totalValue;
    },
    CALC_OUTOFSTOCK(state, action) {
      const products = action.payload;
      const outOfStockProducts = [];
      // const array = [];
      // products.map((item) => {
      //   const { quantity } = item;

      //   return array.push(quantity);
      // });
      let count = 0;
      products.forEach((product) => {
        if (product.quantity === 0 || product.quantity === "0") {
          count += 1;
          outOfStockProducts.push(product);
        }
      });
      state.outOfStockProducts = outOfStockProducts;
      state.outOfStock = count;
    },
    CALC_LIMITEDSTOCK(state, action) {
      const products = action.payload;
      const limitedStockProducts = [];
      // const array = [];
      // products.map((item) => {
      //   const { quantity } = item;

      //   return array.push(quantity);
      // });
      let count = 0;
      products.forEach((product) => {
        if (product.quantity <= 30 && product.quantity > 0) {
          count += 1;
          limitedStockProducts.push(product);
        }
      });
      state.limitedStockProducts = limitedStockProducts;
      state.limitedStock = count;
    },
    CALC_CATEGORY(state, action) {
      const products = action.payload;
      const array = [];
      products.map((item) => {
        const { category } = item;

        return array.push(category);
      });
      const uniqueCategory = [...new Set(array)];
      state.category = uniqueCategory;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        // console.log(action.payload);
        //which is return from acreateAsyncThunk is come in action.payload
        state.products.push(action.payload);
        toast.success("Product added successfully");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        console.log(action.payload);
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Product deleted successfully");
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Product updated successfully");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(importProducts.pending, (state) => {
        // state.isLoading = true;
        state.importStatus = "loading";
      })
      .addCase(importProducts.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.importStatus = "succeeded";
        // Optionally update products if necessary
        // state.products = action.payload;
      })
      .addCase(importProducts.rejected, (state, action) => {
        state.importStatus = "failed";
        state.error = action.payload;
      })
      .addCase(exportProducts.pending, (state) => {
        state.downloadStatus = "loading";
      })
      .addCase(exportProducts.fulfilled, (state) => {
        state.downloadStatus = "succeeded";
      })
      .addCase(exportProducts.rejected, (state, action) => {
        state.downloadStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  CALC_STORE_VALUE,
  CALC_OUTOFSTOCK,
  CALC_LIMITEDSTOCK,
  CALC_CATEGORY,
} = productSlice.actions;

export const selectIsLoading = (state) => state.product.isLoading;
export const selectProduct = (state) => state.product.product;
export const selectTotalStoreValue = (state) => state.product.totalStoreValue;
export const selectOutOfStock = (state) => state.product.outOfStock;
export const selectLimitedStock = (state) => state.product.limitedStock;
export const selectCategory = (state) => state.product.category;
export const selectOutOfStockProducts = (state) =>
  state.product.outOfStockProducts;
export const selectLimitedStockProducts = (state) =>
  state.product.limitedStockProducts;
export const selectImportStatus = (state) => state.product.importStatus;
export const selectDownloadStatus = (state) => state.product.downloadStatus;

export default productSlice.reducer;
