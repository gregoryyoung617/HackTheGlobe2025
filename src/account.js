import React from "react";
import { getAuth, signOut } from "firebase/auth";

export default function Account(props){
    const handleLogout = ()=>{
        signOut(props.auth)
            .then(() => {
                console.log("User logged out successfully");
                // Optionally, redirect the user to the login page or perform other actions
            })
            .catch((error) => {
                console.error("Error logging out:", error.message);
            });
    }
    return (
        <div>
            account
            <button
                onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}