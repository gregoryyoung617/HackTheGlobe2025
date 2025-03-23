import React from "react";
import { createClothing } from "./api";

export default function Feed(props){
    return (
        <div>
            feed
            <button onClick = {() => createClothing(props.db, "userID", "clothingType", "clothingName", "clothingPictureURL", "company", "size")}>Create sample clothing</button>
        </div>
    )
}