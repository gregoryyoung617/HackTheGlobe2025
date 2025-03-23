import React, {useState,useEffect} from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { getStorage, ref, uploadBytes,listAll, getDownloadURL } from "firebase/storage";
import { markClothingForSale } from "./api";

export default function Feed(props){
    // Mock feed items for illustration
    const [imageUrls, setImageUrls] = useState([]);
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

    const feedItems = [
        {
            user: "Bob",
            outfitUrl: "https://readermaria.com/movies/the-greatest-showman.jpg",
            likes: 10,
            comments: 2,
        },
        {
            user: "Alice",
            outfitUrl: "https://readermaria.com/movies/eyes-wide-shut.jpg",
            likes: 5,
            comments: 1,
        }
    ];

    return (
        <div className="page-container">
            <button onClick={() => markClothingForSale(props.db, "https://firebasestorage.googleapis.com/v0/b/htg2025-11d33.firebasestorage.app/o/images%2F8s8MSdzPfzOB8q39mZ3aZYlegCo1%2Fwardrobe%2Fbird-8788491_1280.jpg?alt=media&token=0721f72f-ac89-4517-93a5-9fabe0dc3c1e")}>Mark</button>
            <h2 style={{ margin: "1rem 0" }}>Today's Feed</h2>
            {imageUrls.map((item, index) => (
                <Card style={{ width: "90%", marginBottom: "1rem" }} key={index}>
                    <Card.Body>
                        <Card.Title>{item.user ? item.user : "Bob"}’s Outfit</Card.Title>
                        <img 
                            src={item.outfitUrl ? item.outfitUrl : item} 
                            alt="Outfit" 
                            style={{ maxWidth: "100%", maxHeight: "300px", marginBottom: "1rem" }}
                        />
                        <Card.Text>
                            Likes: {item.likes ? item.likes : 3} | Comments: {item.comments ? item.comments : 2}
                        </Card.Text>
                        <Button variant="primary" style={{ marginRight: "0.5rem" }}>Like</Button>
                        <Button variant="secondary">Comment</Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}
