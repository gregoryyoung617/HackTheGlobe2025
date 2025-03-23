import React, {useState, useEffect} from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getStorage, ref, uploadBytes,listAll, getDownloadURL, list } from "firebase/storage";
import addSvg from './assets/svgs/add.svg'
import { createClothing, listAllClothing, getIndividualClothing} from "./api";

export default function Wardrobe(props){
    const [image, setImage] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrls, setImageUrls] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showImg, setShowImg] = useState(false);
    const [currUrl, setCurrUrl] = useState(null);
    const [currTimesWorn, setCurrTimesWorn] = useState(null);
    const [showAdd, setShowAdd] = useState(false);

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
        const storageRef = ref(storage, `images/${props.user.uid}/wardrobe/${imageFile.name}`); // Create a reference in Firebase Storage
        try {
            // Upload the file
            await uploadBytes(storageRef, imageFile);
            console.log("File uploaded successfully!");

            // Get the download URL
            const url = await getDownloadURL(storageRef);
            setImage(URL.createObjectURL(imageFile)); // Show a preview
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
            //setImage(null);
            fetchImages();
        }
    };

    const fetchImages = async () => {
        const storage = getStorage();
        const folderRef = ref(storage, `images/${props.user.uid}/wardrobe/`);
        const result = await listAll(folderRef);
        const urls = await Promise.all(result.items.map((itemRef) => getDownloadURL(itemRef)));
        setImageUrls(urls);
        console.log(urls);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleImgClick = (url)=>{
        console.log(`setting url to ${url}`);
        setCurrUrl(url);
        setShowImg(true);
    }

    const handleAddImg = ()=>{
        setShowAdd(true);
    }
    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-title">
                    Your Wardrobe
                </div>
                <img
                    src={addSvg}
                    onClick={handleAddImg}
                    className="acc-svg add-svg"/>
            </div>
            <div className="img-grid">
                {imageUrls && imageUrls.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`Image ${index}`}
                        loading="lazy" // Lazy loading attribute
                        className="img-square"
                        onClick={()=>{
                            handleImgClick(url)
                        }}
                    />
                ))}
            </div>
            <Modal
                show={showAdd}
                onHide={()=>{
                    setShowAdd(false)
                }}>

                <Card >
                    <Card.Body>
                        <Card.Title>Add new item</Card.Title>
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
                            {/* <Button
                            onClick={uploadImage}
                            className="green">Upload</Button> */}
                        </div>

                    </Card.Body>
                </Card>
            </Modal>
            <Modal 
                show={showImg}
                onHide={()=>{
                    setShowImg(false)
                }}>
                <Modal.Body
                    style={{padding:'0'}}>
                    <img src={currUrl}
                    className="wardrobe-img"/>
                </Modal.Body>
            </Modal>
            <button onClick={() => getIndividualClothing(props.db, "youtube.com")}>Get clothing by url</button>
            <button onClick={() => listAllClothing(props.db, props.user.uid, "timesWorn")}>List all clothing</button>
            <button onClick={() => createClothing(props.db, props.user.uid, "Shirt", "Kaws Tokyo's First", "youtube.com", "Uniqlo", "XXXL")}>Create</button>
        </div>
    )
}