import axiosInstance from "../util/axiosInstance";

export const GetProducts = async () => {

    const PRODUCTS_URL = import.meta.env.VITE_DFCDOSA_PRODUCTS

    try {
        const response = await axiosInstance.get(PRODUCTS_URL);
        
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

