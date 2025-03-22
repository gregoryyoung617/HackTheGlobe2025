import axios from 'axios';

export const getProductInfo = async (productInput) => {
    try {
        const response = await axios.post('http://localhost:5000/api/sustainability', { 
            product: productInput 
        });
        return response.data;
    } catch (error) {
        console.error("Error getting product info", error);
        throw error;
    }
};

// Sample function to demonstrate usage
export const sampleSustainabilityRequest = async () => {
    try {
        // Example product input in the required format
        const sampleProduct = "<product>Organic Cotton T-shirt by Patagonia</product>";
        console.log("Sending sample request for:", sampleProduct);
        
        const result = await getProductInfo(sampleProduct);
        console.log("Sustainability result:", result);
        return result;
    } catch (error) {
        console.error("Sample request failed:", error);
        throw error;
    }
};

// Example of how to use in another component:
/*
import { getProductInfo, sampleSustainabilityRequest } from './api';

// Use the sample function
const runSample = async () => {
  const result = await sampleSustainabilityRequest();
  // Do something with result
};

// Or use the main function directly
const checkProductSustainability = async (productName) => {
  const formattedInput = `<product>${productName}</product>`;
  const sustainabilityData = await getProductInfo(formattedInput);
  // Update UI with sustainabilityData
};
*/