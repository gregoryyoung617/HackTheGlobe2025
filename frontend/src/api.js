import axios from 'axios';

export const getProductInfo = async (productInput) => {
    try {
        const response = await axios.post('http://localhost:5000/run-script', { input: inputString });
        return response.data.output;
    } catch (error) {
        console.error("Error getting product info", error);
        throw error;
    }
};