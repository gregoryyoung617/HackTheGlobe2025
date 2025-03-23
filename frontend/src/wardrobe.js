import React, {useState, useEffect} from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getStorage, ref, uploadBytes,listAll, getDownloadURL, list } from "firebase/storage";
import addSvg from './assets/svgs/add.svg'
import Logo from './loading'
import loadingSvg from './assets/svgs/logo.svg'
import { createClothing, listAllClothing, getIndividualClothing, markClothingForSale} from "./api";

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
    const [imageObjs, setImageObjs] = useState([]);
    const [numImgs, setNumImgs] = useState(0);

    const [enterName, setEnterName] = useState(null);
    const [enterType, setEnterType] = useState(null);
    const [enterBrand, setEnterBrand] = useState(null);
    const [enterSize, setEnterSize] = useState(null);

    const [viewName, setViewName] = useState(null);
    const [viewType, setViewType] = useState(null);
    const [viewBrand, setViewBrand] = useState(null);
    const [viewSize, setViewSize] = useState(null);
    const [viewTimesWorn, setViewTimesWorn] = useState(null);
    const [viewId, setViewId] = useState(null);
    const [viewOnSale, setViewOnSale] = useState(null);

    const [loading, setLoading] = useState(true);

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

    const markForSale = async (id) => {
        await markClothingForSale(props.db, id);
        fetchImages();
        setViewOnSale(true);
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
            createClothing(props.db, props.user.uid, enterType, enterName, url, enterBrand, enterSize);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
            //setImage(null);
            fetchImages();
            setShowAdd(false);
        }
    };

    const fetchImages = async () => {
        // const storage = getStorage();
        // const folderRef = ref(storage, `images/${props.user.uid}/wardrobe/`);
        // const result = await listAll(folderRef);
        // const urls = await Promise.all(result.items.map((itemRef) => getDownloadURL(itemRef)));
        setLoading(true);
        const imgObjs = await listAllClothing(props.db, props.user.uid, "timesWorn");
        setImageObjs(imgObjs);
        setNumImgs(imgObjs.length);
        setLoading(false);
        //setImageUrls(urls);
        
    };

    useEffect(()=>{
        console.log(imageObjs);
    },[imageObjs])

    useEffect(() => {
        fetchImages();
    }, []);

    const handleImgClick = (url)=>{
        console.log(`setting url to ${url}`);
        setCurrUrl(url);
        const currImg = imageObjs.find((obj) => obj.clothingPictureURL === url);
        console.log(currImg);
        setViewName(currImg.clothingName);
        setViewBrand(currImg.company);
        setViewSize(currImg.size);
        setViewType(currImg.clothingType);
        setViewOnSale(currImg.onSale);
        setViewTimesWorn(currImg.timesWorn);
        setViewId(currImg.id);
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
                    className="add-svg"/>
            </div>
            <span>{`You have ${numImgs} ${numImgs === 1 ? "item":"items"}`}</span>
            {
                loading ? 
                    <span className="loader"></span>
                    :
                <div className="img-grid">
                    {imageObjs && imageObjs.map((img, index) => (
                        <><img
                            key={index}
                            src={img.clothingPictureURL}
                            alt={`Image ${index}`}
                            loading="lazy" // Lazy loading attribute
                            className="img-square"
                            onClick={()=>{
                                handleImgClick(img.clothingPictureURL)
                            }}
                        />
                        {!img.lastWorn && 
                            <span style={{color:"red"}}>Not worn in a year</span>}
                        </>
                    ))}
                </div>

            }
            <Modal
                show={showAdd}
                onHide={()=>{
                    setShowAdd(false)
                }}>

                <Card style={{width:'90vw'}}>
                    <Card.Body>
                        <Card.Title>Add new item</Card.Title>
                        <div
                            style={{
                                border: "2px dashed #ccc",
                                borderRadius: "10px",
                                padding: "20px",
                                textAlign: "center",
                                backgroundColor: dragging ? "#f0f8ff" : "#fff",
                                marginBottom:"20px",
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
                            </div>
                            {/* <Button
                            onClick={uploadImage}
                            className="green">Upload</Button> */}
                        </div>

                        <div style={{
                                border: "2px dashed #ccc",
                                borderRadius: "10px",
                                padding: "20px",
                                textAlign: "center",
                                backgroundColor: dragging ? "#f0f8ff" : "#fff",
                                display:"flex",
                                flexDirection:"column",
                                justifyContent:"flex-start",
                                alignItems:"flex-start"
                            }}>
                            <span className="add-title">Name:</span>
                            <input 
                                onChange={(e)=>{
                                    setEnterName(e.target.value)
                                }}
                                className="add-input"
                            />

                            <span className="add-title">Brand:</span>
                            <input 
                                onChange={(e)=>{
                                    setEnterBrand(e.target.value)
                                }}
                                className="add-input"
                            />
                            <span className="add-title">Type:</span>
                            <input 
                                onChange={(e)=>{
                                    setEnterType(e.target.value)
                                }}
                                className="add-input"
                            />

                            <span className="add-title">Size:</span>
                            <input 
                                onChange={(e)=>{
                                    setEnterSize(e.target.value)
                                }}
                                className="add-input"
                            />

                            <label
                                style={{
                                    display: "inline-block",
                                    marginTop: "30px",
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

                    </Card.Body>
                </Card>
            </Modal>
            <Modal 

                show={showImg}
                onHide={()=>{
                    setShowImg(false)
                }}>
                <Modal.Body
                    style={{padding:'0', width:'80vw'}}>
                    <img src={currUrl}
                    className="wardrobe-img"/>
                    <div style={{display:"flex",
                                flexDirection:"column",
                                justifyContent:"flex-start",
                                alignItems:"flex-start",
                                padding:"2rem",}}>
                        <span>{`${viewName}`}</span>
                        <span>{`${viewBrand}`}</span>
                        <span>{`${viewType}`}</span>
                        <span>{`${viewSize}`}</span>
                        <span>{`${viewTimesWorn} times worn`}</span>
                        {viewOnSale == true ? <span style={{marginTop:"2rem", color:"#118B50", fontWeight:"bold"}}>On sale</span> : <Button className="green" style={{marginTop:"2rem"}}onClick={() => markForSale(viewId)}>Post on Marketplace</Button>}
                        

                    </div>
                </Modal.Body>
                
            </Modal>
            {/* <button onClick={() => getIndividualClothing(props.db, "youtube.com")}>Get clothing by url</button>
            <button onClick={() => listAllClothing(props.db, props.user.uid, "timesWorn")}>List all clothing</button>
            <button onClick={() => createClothing(props.db, props.user.uid, "Shirt", "Kaws Tokyo's First", "youtube.com", "Uniqlo", "XXXL")}>Create</button> */}
        </div>
    )
}