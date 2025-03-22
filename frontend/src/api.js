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

// Function to demonstrate calling the backend and printing the response
export const fetchAndPrintSustainabilityInfo = async (productName,productBrand) => {
    try {
        // Format the input according to the expected format
        const formattedInput = `<product>${productName} by ${productBrand}</product>`;
        console.log("Sending request with input:", formattedInput);
        
        // Call the API
        const response = await getProductInfo(formattedInput);
        
        // Print the response
        console.log("Sustainability information response:");
        console.log(JSON.stringify(response, null, 2));
        
        return response;
    } catch (error) {
        console.error("Failed to fetch sustainability information:", error);
        throw error;
    }
};

// Example usage:
// Import this in your component and call it like:
// fetchAndPrintSustainabilityInfo("Nike Air Max by Nike");