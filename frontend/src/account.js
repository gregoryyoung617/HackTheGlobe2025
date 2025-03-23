import React, {useState} from "react";
import { getAuth, signOut } from "firebase/auth";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


import accountSvg from './assets/svgs/account.svg'
import fireSvg from './assets/svgs/fire.svg'
import logoPng from './assets/imgs/HTG2025_logo.png'

export default function Account(props){
    const [accDropdown, setAccDropdown] = useState(false);
    const [image, setImage] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);

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

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(URL.createObjectURL(file));
        } else {
            alert("Please upload a valid image file.");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(URL.createObjectURL(file));
            setImageFile(file);
            console.log(!(image instanceof File))
        } else {
            alert("Please upload a valid image file.");
        }
    };

    
    const uploadImage = async () => {
        if (!(imageFile instanceof File)) {
            console.error("Invalid file provided");
            alert("Please select a valid file before uploading.");
            return;
        }
        const storage = getStorage();

        setUploading(true);
        const storageRef = ref(storage, `images/${props.user.uid}/posts/${imageFile.name}`); // Create a reference in Firebase Storage
        try {
            // Upload the file
            await uploadBytes(storageRef, imageFile);
            console.log("File uploaded successfully!");

            // Get the download URL
            const url = await getDownloadURL(storageRef);
            setImageUrl(url); // Save the URL to state
            setImage(URL.createObjectURL(imageFile)); // Show a preview
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="account-container">
                <img 
                    src={accountSvg}
                    className="acc-svg"
                    onClick={()=>{
                        setAccDropdown(!accDropdown)
                    }}/>
                {accDropdown &&
                    <div className="acc-dropdown">
                        <button
                            className="button">
                            Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="button">
                            Logout
                        </button>
                    </div>
                }
            </div>
            <Card style={{width:"90%"}}>
                <Card.Body>
                    <Card.Title>
                        Streak: 25 Days
                        <img
                            src={fireSvg}
                            className="nav-svg"
                            style={{marginBottom:"10px"}}/>
                    </Card.Title>
                </Card.Body>
            </Card>

            <Card style={{width:"90%"}}>
            <Card.Body>
                    <Card.Title>Upload Your Daily Fit!</Card.Title>
                    <div
                        style={{
                            border: "2px dashed #ccc",
                            borderRadius: "10px",
                            padding: "20px",
                            textAlign: "center",
                            backgroundColor: dragging ? "#f0f8ff" : "#fff",
                        }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        {image ? (
                            <img
                                src={image}
                                alt="Uploaded"
                                style={{ maxWidth: "100%", maxHeight: "200px" }}
                            />
                        ) : (
                            <p>Drag and drop an image here, or click to select one.</p>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            id="fileInput"
                            onChange={handleFileChange}
                        />
                        <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
                                <label
                                    htmlFor="fileInput"
                                    style={{
                                        display: "inline-block",
                                        marginTop: "10px",
                                        padding: "10px 10px",
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    className="green"
                                >
                                    Choose File
                                </label>

                                <label
                                    style={{
                                        display: "inline-block",
                                        marginTop: "10px",
                                        padding: "10px 10px",
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        width:'101px',
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    className="green"
                                    onClick={uploadImage}
                                >
                                    Upload
                                </label>
                            </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}