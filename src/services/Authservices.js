import axiosInstance from "../util/axiosInstance";

export const verifyUser = async (uname, mobile) => {
    try {
        const response = await axiosInstance.post("/users/verify/", { uname, mobile });
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