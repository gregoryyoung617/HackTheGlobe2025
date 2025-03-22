import React, { useEffect, useState } from "react";
import './App.css';
import cong from "./index.js"; // Assuming the correct path to your configuration file
import { getDatabase, ref, onValue } from "firebase/database";
import { collection, addDoc } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from './navbar.js'
import Wardrobe from './wardrobe.js'
import Account from './account.js'
import Feed from './feed.js'
import Marketplace from './marketplace.js'
import Login from './login.js'

async function addData(db) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "John Doe",
      age: 30,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function App(props) {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(()=>{
    //addData(props.db);
  },[])

  useEffect(() => {
    const unsubscribe = props.auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [props.auth]);

  return (
    <div className="App">
      <header className="App-header">
      <Router>
          {!user ? 
          <Login auth={props.auth}/> :
            <>
              <header className="navbar">
                <nav>
                    <Link to="/">Feed</Link>
                    <Link to="/Marketplace">Marketplace</Link>
                    <Link to="/Wardrobe">Wardrobe</Link>
                    <Link to="/Account">Account</Link>
                </nav>
              </header>
              <main>
              <Routes>
                  <Route path="/" element={<Feed />} />
                  <Route path="/Marketplace" element={<Marketplace auth={props.auth}/>} />
                  <Route path="/Wardrobe" element={<Wardrobe auth={props.auth}/>} />
                  <Route path="/Account" element={<Account auth={props.auth}/>} />
              </Routes>
              </main>
            </>
          }
        </Router>
      
      </header>
    </div>
  );
}

export default App;
