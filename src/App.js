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

  useEffect(()=>{
    addData(props.db);
  },[])

  // useEffect(() => {
  //   // Initialize the Firebase database with the provided configuration
  //   const database = getDatabase(cong);
    
  //   // Reference to the specific collection in the database
  //   const collectionRef = ref(props.db, "your_collection");

  //   // Function to fetch data from the database
  //   const fetchData = () => {
  //     // Listen for changes in the collection
  //     onValue(collectionRef, (snapshot) => {
  //       const dataItem = snapshot.val();

  //       // Check if dataItem exists
  //       if (dataItem) {
  //         // Convert the object values into an array
  //         const displayItem = Object.values(dataItem);
  //         setData(displayItem);
  //       }
  //     });
  //   };

  //   // Fetch data when the component mounts
  //   fetchData();
  // }, []);
  return (
    <div className="App">
      <header className="App-header">
      <Router>
            <header>
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
                <Route path="/Marketplace" element={<Marketplace />} />
                <Route path="/Wardrobe" element={<Wardrobe />} />
                <Route path="/Account" element={<Account />} />
            </Routes>
            </main>
        </Router>
      
      </header>
    </div>
  );
}

export default App;
