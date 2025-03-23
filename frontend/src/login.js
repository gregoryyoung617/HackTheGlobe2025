import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
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
            <Card style={{width:"90vw", marginBottom:"3rem"}}>
                <Card.Title>
                    Login
                </Card.Title>
                <Card.Body style={{display:'flex', flexDirection:"column"}}>
                    <input className="add-input" 
                    style={{marginBottom:"1rem"}}
                    onChange={(e)=>{
                        setLogUser(e.target.value)
                    }}/>
                    <input className="add-input" 
                    style={{marginBottom:"1rem"}}
                    onChange={(e)=>{
                        setLogPW(e.target.value)
                    }}/>
                    <Button
                        onClick={handleLogin}
                        className="green"
                    >Login</Button>
                </Card.Body>
            </Card>

            <Card style={{width:"90vw"}}>
                <Card.Title>
                    Register
                </Card.Title>
                <Card.Body style={{display:'flex', flexDirection:"column"}}>
                    <input className="add-input"
                    style={{marginBottom:"1rem"}}
                    onChange={(e)=>{
                        setRegUser(e.target.value) 
                    }}/>
                    <input className="add-input" 
                    style={{marginBottom:"1rem"}}
                    onChange={(e)=>{
                        setRegPW(e.target.value)
                    }}/>
                    <Button
                        onClick={handleRegister}
                        className="green"
                    >Register</Button>

                </Card.Body>
            </Card>
        </main>
    )
}