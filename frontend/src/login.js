import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Login(props){
    const [regUser, setRegUser] = useState(null);
    const [regPW, setRegPW] = useState(null);
    const [logUser, setLogUser] = useState(null);
    const [logPW, setLogPW] = useState(null);

    const handleRegister= ()=>{
        console.log(`registering email:${regUser} pw: ${regPW}`);
        console.log(props.auth)
        createUserWithEmailAndPassword(props.auth, regUser, regPW)
            .then((userCredential) => {
                // Signed up 
                console.log("succesfully registered");
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error.message);
                // ..
            });
    }

    const handleLogin=()=>{
        signInWithEmailAndPassword(props.auth, logUser, logPW)
            .then((userCredential) => {
                console.log("Successfully logged in");
                const user = userCredential.user;
                console.log("User details:", user);
            })
            .catch((error) => {
                console.error("Error logging in:", error.message);
            });
    }

    return(
        <main>
            <div>
                login
                <input onChange={(e)=>{
                    setLogUser(e.target.value)
                }}/>
                <input onChange={(e)=>{
                    setLogPW(e.target.value)
                }}/>
                <button
                    onClick={handleLogin}
                >login</button>
            </div>

            <div>
                register
                <input onChange={(e)=>{
                    setRegUser(e.target.value)
                }}/>
                <input onChange={(e)=>{
                    setRegPW(e.target.value)
                }}/>
                <button
                    onClick={handleRegister}
                >Register</button>
            </div>
        </main>
    )
}