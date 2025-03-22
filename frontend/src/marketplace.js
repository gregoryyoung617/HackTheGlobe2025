import React from "react";
import { sampleSustainabilityRequest } from "./api";
import { getProductInfo } from "./api";

const runSample = async () => {
    console.log("Running sample request...");
    const result = await sampleSustainabilityRequest();
    console.log("Sample result:", result);
    // Do something with result
};

const checkProductSustainability = async (productName, productBrand) => {
    const formattedInput = `<product>${productName} by ${productBrand}</product>`;
    const sustainabilityData = await getProductInfo(formattedInput);
    console.log(sustainabilityData);
    // Update UI with sustainabilityData
};

export default function Marketplace(){
    return (
        <div>
            marketplace
            <button onClick={() => checkProductSustainability("Pants","Nike")}>Run Sample</button>
        </div>
    )
}