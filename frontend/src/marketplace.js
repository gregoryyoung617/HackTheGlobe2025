import React, {useState, useEffect} from "react";
import {fetchAndPrintSustainabilityInfo, listMarketPlace} from "./api";

export default function Marketplace(props){
    const [imageObjs, setImageObjs] = useState(null);
    const [loading, setLoading] = useState(null);

    const fetchImages = async () => {
        // const storage = getStorage();
        // const folderRef = ref(storage, `images/${props.user.uid}/wardrobe/`);
        // const result = await listAll(folderRef);
        // const urls = await Promise.all(result.items.map((itemRef) => getDownloadURL(itemRef)));
        console.log('fetching')
        setLoading(true);
        const imgObjs = await listMarketPlace(props.db, "timesWorn");
        console.log(imgObjs);
        setImageObjs(imgObjs);
        setLoading(false);
        //setImageUrls(urls);
        
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // useEffect(() => {

    //     fetchImages();
        
    // }, [props.db]);


    return (
        <div className="page-container">
            <div className="page-header" style={{fontWeight:'bold', marginTop:'2rem', fontSize:'25px'}}>
                Marketplace
            </div>
            {
                loading ? 
                    <span className="loader"></span>
                    :
                <div className="img-grid">
                    {imageObjs && imageObjs.map((img, index) => (
                        <img
                            key={index}
                            src={img.clothingPictureURL}
                            alt={`Image ${index}`}
                            loading="lazy" // Lazy loading attribute
                            className="img-square"
                        />
                    ))}
                </div>

            }
            
        </div>
    )
}