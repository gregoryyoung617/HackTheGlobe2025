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

//svgs
import analyzeSvg from './assets/svgs/analyze.svg'
import feedSvg from './assets/svgs/feed.svg'
import marketplaceSvg from './assets/svgs/marketplace.svg'
import wardrobeSvg from './assets/svgs/wardrobe.svg'
import todaySvg from './assets/svgs/today.svg'

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
              <div className="navbar">
                <nav>
                    <Link to="/Account">
                      <div className="nav-item">
                      <img
                        className="nav-svg"
                        src={todaySvg}>
                      </img>
                      <span className="nav-text">Today </span>
                      </div>
                    </Link>
                    <Link to="/Marketplace">
                      <div className="nav-item">
                        <img
                          className="nav-svg"
                          src={marketplaceSvg}>
                        </img>
                        <span className="nav-text">Marketplace</span>
                      </div>
                    </Link>
                    <Link to="/">
                      <div className="nav-item">
                        <img
                          className="nav-svg"
                          src={feedSvg}>
                        </img>
                        <span className="nav-text">Feed</span>
                      </div>
                    </Link>
                    <Link to="/Analyze">
                      <div className="nav-item">
                        <img
                          className="nav-svg"
                          src={analyzeSvg}>
                        </img>
                        <span className="nav-text">Analyze</span>
                      </div>
                    </Link>
                    
                    <Link to="/Wardrobe">
                      <div className="nav-item">
                        <img
                          className="nav-svg"
                          src={wardrobeSvg}>
                        </img>
                        <span className="nav-text">Wardrobe</span>
                      </div>
                    </Link>
                    
                </nav>
              </div>
              <main>
              <Routes>
                  <Route path="/" element={<Feed />} />
                  <Route path="/Marketplace" element={<Marketplace auth={props.auth} user={user}/>} />
                  <Route path="/Wardrobe" element={<Wardrobe db={props.db} auth={props.auth} user={user}/>} />
                  <Route path="/Account" element={<Account db={props.db} auth={props.auth} user={user}/>} />
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
