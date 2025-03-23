import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createUser } from "./api";

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
                createUser(props.db, user.uid, regUser);
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
                <Button
                    onClick={handleLogin}
                >login</Button>
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