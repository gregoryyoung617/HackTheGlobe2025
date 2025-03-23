import React, {useState} from "react";
import { signOut } from "firebase/auth";
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Dropdown from 'react-bootstrap/Dropdown';
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

    // New state for demonstration
    const [sustainabilityPoints] = useState(120); // Example: user has 120 points
    const [dailyTip] = useState("Wash clothes in cold water to save energy and preserve fabric quality.");

    const handleLogout = () => {
        signOut(props.auth)
            .then(() => {
                console.log("User logged out successfully");
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
        const storageRef = ref(storage, `images/${props.user.uid}/posts/${imageFile.name}`); 
        try {
            await uploadBytes(storageRef, imageFile);
            console.log("File uploaded successfully!");
            const url = await getDownloadURL(storageRef);
            setImageUrl(url); 
            setImage(URL.createObjectURL(imageFile)); 
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="page-container">
            {/* Top-right account icon + dropdown */}
            <Dropdown className="acc-svg">
                <Dropdown.Toggle
                    as="img" // Use the image as the toggle button
                    src={accountSvg}
                    alt="Account"
                    className="acc-svg"
                    style={{ cursor: "pointer" }}
                />
                <Dropdown.Menu>
                    <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <div className="account-container">
                <img
                src={logoPng}
                style={{width:'95px', height:'95px', margin:"-20px auto"}}/>
            </div>

            {/* Streak card */}
            <Card style={{ width: "90%" }}>
                <Card.Body>
                    <Card.Title>
                        Streak: 25 Days
                        <img
                            src={fireSvg}
                            className="nav-svg"
                            style={{ marginBottom: "10px" }}
                            alt="Streak fire icon"
                        />
                    </Card.Title>
                </Card.Body>
            </Card>

            {/* New Sustainability Points card */}
            <Card style={{ width: "90%" }}>
                <Card.Body>
                    <Card.Title>Your Sustainability Points</Card.Title>
                    <Card.Text>
                        You currently have <strong>{sustainabilityPoints}</strong> points!
                    </Card.Text>
                    {/* Example progress bar: user’s progress out of 500 points */}
                    <ProgressBar 
                        now={sustainabilityPoints} 
                        max={500} 
                        label={`${sustainabilityPoints} / 500`} 
                    />
                </Card.Body>
            </Card>

            {/* Daily Eco Tip card */}
            <Card style={{ width: "90%" }}>
                <Card.Body>
                    <Card.Title>Daily Eco Tip</Card.Title>
                    <Card.Text>{dailyTip}</Card.Text>
                </Card.Body>
            </Card>

            {/* Upload Card */}
            <Card style={{ width: "90%" }}>
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
                        className="lg-border"
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
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
                                    width: '101px',
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                className="green"
                                onClick={uploadImage}
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </label>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
