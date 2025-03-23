import React, { useState, useEffect } from "react";
import { fetchAndPrintSustainabilityInfo } from "./api";
import Logo from './loading'

export default function Analyze() {
    const [clothingName, setClothingName] = useState("");
    const [clothingBrand, setClothingBrand] = useState("");
    const [sustainabilityInfo, setSustainabilityInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const result = await fetchAndPrintSustainabilityInfo(clothingName, clothingBrand);
            setSustainabilityInfo(result);
        } catch (error) {
            console.error("Error fetching sustainability info:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = clothingName.trim() !== "" && clothingBrand.trim() !== "";

    const renderRatingStars = (rating, maxRating = 5) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = Math.floor(maxRating - rating - (hasHalfStar ? 0.5 : 0));
        
        return (
            <div className="stars-container">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="star full">★</span>
                ))}
                {hasHalfStar && <span className="star half">★</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="star empty">☆</span>
                ))}
                <span className="rating-number">({rating}/{maxRating})</span>
            </div>
        );
    };

    return (
        <div className="analyze-container">
            <h2>Analyze Clothing Sustainability</h2>
            
            <div className="form-group">
                <label htmlFor="clothingBrand">Clothing Brand:</label>
                <input 
                    style={{marginLeft:"15px"}}
                    type="text" 
                    id="clothingBrand" 
                    className="add-input"
                    value={clothingBrand} 
                    onChange={(e) => setClothingBrand(e.target.value)}
                    placeholder="e.g. Nike, Adidas, H&M"
                />
            </div>
            <div className="form-group">
                <label htmlFor="clothingName">Clothing Name:</label>
                <input 
                    style={{marginLeft:"15px"}}
                    className="add-input"
                    type="text" 
                    id="clothingName" 
                    value={clothingName} 
                    onChange={(e) => setClothingName(e.target.value)}
                    placeholder="e.g. shoes, shirt, pants"
                />
            </div>
            
            
            <button 
                onClick={handleSubmit} 
                disabled={!isFormValid || isLoading}
                className="submit-button"
            >
                {isLoading ? 'Analyzing...' : 'Analyze Sustainability'}
            </button>
            
            {isLoading && (
                <div className="loading-container">
                    {/* <Logo/> */}
                    {/* <div className="loading-spinner">🔄</div>
                    <p>Analyzing sustainability information...</p> */}
                    <span className="loader"></span>
                </div>
            )}
            
            {!isLoading && sustainabilityInfo && (
                <div className="results-container">
                    <h3 className="results-title">Sustainability Analysis</h3>
                    
                    <div className="overview-section">
                        <div className="overview-item">
                            <span className="product-brand">{sustainabilityInfo.product} by {sustainabilityInfo.brand}</span>
                        </div>
                        <div className="overview-item score">
                            <span className="label">Overall Score:</span>
                            <span className={`score-badge score-${sustainabilityInfo.overall_score.replace('+', 'plus').replace('-', 'minus')}`}>
                                {sustainabilityInfo.overall_score}
                            </span>
                        </div>
                    </div>
                    
                    <div className="details-section">
                        <div className="detail-item">
                            <span className="label">Country of Production:</span>
                            <span className="value">{sustainabilityInfo.country_of_production}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Country Risk Level:</span>
                            <span className={`risk-badge risk-${sustainabilityInfo.country_risk.toLowerCase()}`}>
                                {sustainabilityInfo.country_risk}
                            </span>
                        </div>
                    </div>
                    
                    <div className="description-section">
                        <p>{sustainabilityInfo.description}</p>
                    </div>
                    
                    <div className="ratings-section">
                        <h4>Sustainability Ratings</h4>
                        
                        <div className="rating-category">
                            <h5>Good On You Ratings:</h5>
                            <div className="rating-item">
                                <span className="label">Overall:</span>
                                {renderRatingStars(sustainabilityInfo.ratings.good_on_you.overall)}
                            </div>
                            <div className="rating-item">
                                <span className="label">Planet Impact:</span>
                                {renderRatingStars(sustainabilityInfo.ratings.good_on_you.planet)}
                            </div>
                        </div>
                        
                        <div className="rating-category">
                            <h5>Fashion Checker Ratings:</h5>
                            <div className="rating-item">
                                <span className="label">Overall:</span>
                                {renderRatingStars(sustainabilityInfo.ratings.fashion_checker.overall)}
                            </div>
                            <div className="rating-item">
                                <span className="label">Living Wage:</span>
                                {renderRatingStars(sustainabilityInfo.ratings.fashion_checker.living_wage)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                .analyze-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .submit-button {
                    padding: 10px 15px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .submit-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                
                .loading-container {
                    margin-top: 20px;
                    text-align: center;
                }
                
                .loading-spinner {
                    font-size: 24px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 10px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .results-container {
                    margin-top: 30px;
                    padding: 20px;
                    border-radius: 8px;
                    background-color: #f8f9fa;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                
                .results-title {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #2c3e50;
                }
                
                .overview-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .product-brand {
                    font-size: 1.2rem;
                    font-weight: bold;
                    text-transform: capitalize;
                }
                
                .score-badge {
                    padding: 5px 10px;
                    border-radius: 4px;
                    color: white;
                    font-weight: bold;
                }
                
                .score-A, .score-Aplus {
                    background-color: #4CAF50;
                }
                
                .score-B, .score-Bplus {
                    background-color: #8BC34A;
                }
                
                .score-Bminus {
                    background-color: #CDDC39;
                }
                
                .score-C, .score-Cplus {
                    background-color: #FFC107;
                }
                
                .score-Cminus, .score-D {
                    background-color: #FF9800;
                }
                
                .score-F {
                    background-color: #F44336;
                }
                
                .details-section {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .detail-item {
                    flex: 1;
                    min-width: 200px;
                }
                
                .risk-badge {
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-size: 0.9rem;
                }
                
                .risk-high {
                    background-color: #FFEBEE;
                    color: #D32F2F;
                }
                
                .risk-medium {
                    background-color: #FFF8E1;
                    color: #FFA000;
                }
                
                .risk-low {
                    background-color: #E8F5E9;
                    color: #388E3C;
                }
                
                .description-section {
                    margin-bottom: 20px;
                    padding: 15px;
                    background-color: #ECEFF1;
                    border-radius: 6px;
                    line-height: 1.5;
                }
                
                .ratings-section {
                    padding: 15px;
                    background-color: #FAFAFA;
                    border-radius: 6px;
                }
                
                .rating-category {
                    margin-bottom: 20px;
                }
                
                .rating-category h5 {
                    margin-bottom: 10px;
                    color: #546E7A;
                }
                
                .rating-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
                
                .label {
                    min-width: 120px;
                    font-weight: 500;
                }
                
                .stars-container {
                    display: flex;
                    align-items: center;
                }
                
                .star {
                    font-size: 1.2rem;
                    margin-right: 2px;
                }
                
                .star.full {
                    color: #FFC107;
                }
                
                .star.half {
                    position: relative;
                    color: #FFC107;
                }
                
                .star.half:after {
                    content: "☆";
                    position: absolute;
                    left: 0;
                    color: #FFC107;
                    width: 50%;
                    overflow: hidden;
                }
                
                .star.empty {
                    color: #e0e0e0;
                }
                
                .rating-number {
                    margin-left: 5px;
                    font-size: 0.9rem;
                    color: #757575;
                }
            `}</style>
        </div>
    );
}