import axiosInstance from "../util/axiosInstance";

export const GetProducts = async () => {

    try {
        const response = await axiosInstance.get(`/products/`);
        return response.data;
    } catch (error) {
        // Check if error response exists and log the error message
        if (error.response) {
            throw new Error(error.response.data.message); // Throw error message from server
        } else {
            throw new Error("Something Went Wrong"); // General error message
        }
    }
};

export const GetCategories = async () => {

    try {
        const response = await axiosInstance.get(`/categories/`);
        return response.data;
    } catch (error) {
        // Check if error response exists and log the error message
        if (error.response) {
            throw new Error(error.response.data.message); // Throw error message from server
        } else {
            throw new Error("Something Went Wrong"); // General error message
        }
    }
};

export const ChangeProductStatus = async (formdata) => {
    try {
        const response = await axiosInstance.post(`/products/status/`, formdata);
        return response.data;
    } catch (error) {
        // Check if error response exists and log the error message
        if (error.response) {
            throw new Error(error.response.data.message); // Throw error message from server
        } else {
            throw new Error("Something Went Wrong"); // General error message
        }
    }
};

export const CheckProductStatus = async (product_id) => {
    try {
        const response = await axiosInstance.get(`/products/status/?product_id=${product_id}`);
        return response.data;
    } catch (error) {
        // Check if error response exists and log the error message
        if (error.response) {
            throw new Error(error.response.data.message); // Throw error message from server
        } else {
            throw new Error("Something Went Wrong"); // General error message
        }
    }
};

export const DeleteProductByID = async (product_id) => {
    try {
        const response = await axiosInstance.delete(`/products/?product_id=${product_id}`);
        return response.data;
    } catch (error) {
        // Check if error response exists and log the error message
        if (error.response) {
            throw new Error(error.response.data.message); // Throw error message from server
        } else {
            throw new Error("Something Went Wrong"); // General error message
        }
    }
};
