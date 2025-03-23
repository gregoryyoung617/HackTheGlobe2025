import axios from 'axios';
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";

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
export const fetchAndPrintSustainabilityInfo = async (productName, productBrand) => {
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

export const createClothing = async (db, userID, clothingType, clothingName, clothingPictureURL, company, size) => {
    try {
        // Create a new clothing object
        const newClothing = {
            userID: userID,
            clothingType: clothingType,
            clothingName: clothingName,
            clothingPictureURL: clothingPictureURL,
            company: company,
            size: size,
            lastWorn: new Date(),
            timesWorn: 0,
            onSale: false
        };
        
        // Add the newClothing object to the collection
        const docRef = await addDoc(collection(db, "clothes"), newClothing);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Failed to create clothing:", error);
        throw error;
    }
}

export const listAllClothing = async (db, userID, sortBy) => {
    try {
        const clothingRef = collection(db, "clothes");
        const q = query(clothingRef, where("userID", "==", userID));
        const querySnapshot = await getDocs(q);
        const clothingArray = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const clothingItem = {
                userID: data.userID,
                clothingType: data.clothingType,
                clothingName: data.clothingName,
                clothingPictureURL: data.clothingPictureURL,
                company: data.company,
                size: data.size,
                lastWorn: data.lastWorn,
                timesWorn: data.timesWorn,
                onSale: data.onSale
            };
            clothingArray.push(clothingItem);
        });
        if (sortBy === "timesWorn") {
            clothingArray.sort((a, b) => b.timesWorn - a.timesWorn);
        } else if (sortBy === "lastWorn") {
            clothingArray.sort((a, b) => new Date(b.lastWorn) - new Date(a.lastWorn));
        }
        console.log(clothingArray);
        return clothingArray;
    } catch (error) {
        console.error("Failed to return all clothing:", error);
        throw error;
    }
}

export const getIndividualClothing = async (db, clothingURL) => {
    try {
        console.log("looking for:", clothingURL);
        const clothingRef = collection(db, "clothes");
        const q = query(clothingRef, where("clothingPictureURL", "==", clothingURL));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            const clothingItem = {
                userID: data.userID,
                clothingType: data.clothingType,
                clothingName: data.clothingName,
                clothingPictureURL: data.clothingPictureURL,
                company: data.company,
                size: data.size,
                lastWorn: data.lastWorn,
                timesWorn: data.timesWorn,
                onSale: data.onSale
            };
            console.log(clothingItem);
            return clothingItem;
        } else {
            throw new Error("No matching clothing found");
        }
    } catch (error) {
        console.error("Failed to return individual clothing:", error);
        throw error;
    }
}



