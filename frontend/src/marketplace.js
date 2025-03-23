import React from "react";
import {fetchAndPrintSustainabilityInfo} from "./api";

export default function Marketplace(){
    return (
        <div>
            marketplace
            <button onClick={() => fetchAndPrintSustainabilityInfo("shoes","Nike")}>sample</button>
        </div>
    )
}