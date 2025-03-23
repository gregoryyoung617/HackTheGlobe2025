import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function Feed(){
    // Mock feed items for illustration
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
            <h2 style={{ margin: "1rem 0" }}>Today's Feed</h2>
            {feedItems.map((item, index) => (
                <Card style={{ width: "90%", marginBottom: "1rem" }} key={index}>
                    <Card.Body>
                        <Card.Title>{item.user}’s Outfit</Card.Title>
                        <img 
                            src={item.outfitUrl} 
                            alt="Outfit" 
                            style={{ maxWidth: "100%", maxHeight: "300px", marginBottom: "1rem" }}
                        />
                        <Card.Text>
                            Likes: {item.likes} | Comments: {item.comments}
                        </Card.Text>
                        <Button variant="primary" style={{ marginRight: "0.5rem" }}>Like</Button>
                        <Button variant="secondary">Comment</Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}
