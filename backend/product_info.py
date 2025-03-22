import pandas as pd
import random
import json
import requests
import os

import main
import rating_df

def gpt_wrapper(brand_name, overall_score, planet_rating):
    """
    Make an API call to OpenAI GPT or Anthropic Claude to generate a description.
    
    This function sends a request to the AI model with information about the brand,
    its overall sustainability score, and planet rating to get a customized description.
    """
    # Anthropic Claude implementation
    def claude_request(prompt):
        api_key = os.environ.get("ANTHROPIC_API_KEY")  # Set your API key as an environment variable
        # Alternative: api_key = "your-api-key-here"  # Hardcoded, not recommended for security reasons
        
        if not api_key:
            return f"Error: Anthropic API key not found. Please set the ANTHROPIC_API_KEY environment variable."
        
        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01"
        }
        
        payload = {
            "model": "claude-3-5-sonnet-20241022",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 100,
            "temperature": 0.7
        }
        
        try:
            # Updated endpoint for Messages API
            response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
            if response.status_code == 200:
                return response.json()["content"][0]["text"].strip()
            else:
                return f"Error: API request failed with status code {response.status_code}. {response.text}"
        except Exception as e:
            return f"Error making API request: {str(e)}"
    
    # Create prompt for the AI model
    rating_descriptors = {
        "A+": "exceptional", "A": "excellent", "A-": "very good",
        "B+": "good", "B": "satisfactory", "B-": "fair",
        "C+": "average", "C": "below average", "C-": "poor",
        "D+": "very poor", "D": "unsatisfactory", "D-": "unacceptable"
    }
    
    rating_descriptor = rating_descriptors.get(overall_score, "undetermined")
    
    prompt = f"""Create a short, factual two-sentence description for {brand_name} with the following information:
1. The brand has a {rating_descriptor} sustainability rating of {overall_score}.
2. The brand's environmental rating is {planet_rating} out of 5.

Format: "[BrandName] has a [rating] rating of [overall score]. [2 sentences about sustainability efforts based on ratings]."
Keep it concise and professional."""
    
    return claude_request(prompt)  # Use Anthropic Claude
    
    # For testing without API key, use the fallback:
    sustainability_efforts = {
        5: "leading the industry with innovative sustainable practices",
        4: "making significant efforts to reduce environmental impact",
        3: "taking steps to improve sustainability in their production",
        2: "beginning to address environmental concerns but has room for improvement",
        1: "showing minimal commitment to sustainable practices",
        0: "not demonstrating significant environmental responsibility"
    }
    
    effort_description = sustainability_efforts.get(int(planet_rating), "has unclear environmental initiatives")
    
    # Return a fallback response if API is not configured
    return f"{brand_name} has a {rating_descriptor} rating of {overall_score}. The brand is {effort_description}."



# Function to convert numerical score to letter grade
def score_to_letter(score):
    if score >= 95: return "A+"
    elif score >= 90: return "A"
    elif score >= 85: return "A-"
    elif score >= 80: return "B+"
    elif score >= 75: return "B"
    elif score >= 70: return "B-"
    elif score >= 65: return "C+"
    elif score >= 60: return "C"
    elif score >= 55: return "C-"
    elif score >= 50: return "D+"
    elif score >= 45: return "D"
    else: return "D-"

# Main function to process product information
def get_sustainability_info(product_input):
    # Extract product and brand from input
    import re
    match = re.search(r'<product>(.*?)</product>', product_input)
    if match:
        product_brand = match.group(1)
    else:
        product_brand = "Unknown Product by Unknown Brand"
    
    # Split into product and brand (assuming format is "Product by Brand")
    if " by " in product_brand:
        product, brand = product_brand.split(" by ", 1)
    else:
        # If no explicit format, assume the whole string is both product and brand
        product = product_brand
        brand = product_brand
    

    ##############MIGHT BE BROKEN################
    # dataframe for ratings from brands
<<<<<<< HEAD
    import rating_df
    df = rating_df.df
        
=======
    data = rating_df.data
    df = pd.DataFrame(data)
    
>>>>>>> fbd91d029649691e6bd435ec3060d5a7df9b94a9
    # Find the brand in the dataframe
    brand_row = df[df['Brand'].str.lower() == brand.lower()]
    
    # If brand not found, use the last row (which contains random values)
    if brand_row.empty:
        brand_row = df.iloc[-1]
        # Update the brand name in the dataframe
        df.at[df.index[-1], 'Brand'] = brand
    
    # Extract ratings
    good_on_you_planet = round(float(brand_row['GoodOnYou_Planet'].values[0]), 1)
    good_on_you_overall = round(float(brand_row['GoodOnYou_Overall'].values[0]), 1)
    fashion_checker_living_wage = round(float(brand_row['FC_Commitment'].values[0]), 1)
    fashion_checker_overall = round(float(brand_row['FC_Overall'].values[0]), 1)
    
    # Calculate overall score (out of 100)
    overall_numerical = (
        (good_on_you_planet / 5) * 25 +
        (good_on_you_overall / 5) * 25 +
        (fashion_checker_living_wage / 5) * 25 +
        (fashion_checker_overall / 3) * 25
    )
    
    # Convert to letter grade
    overall_score = score_to_letter(overall_numerical)
    
    # Generate description
    description = gpt_wrapper(brand, overall_score, good_on_you_planet)
    
    # Randomly select country of production
    countries = ["China", "Bangladesh", "Vietnam", "India", "Turkey", "Indonesia"]
    country = random.choice(countries)
    
    # Compile the result
    result = {
        "product": product,
        "brand": brand,
        "overall_score": overall_score,
        "description": description,
        "country_of_production": country,
        "ratings": {
            "good_on_you": {
                "planet": good_on_you_planet,
                "overall": good_on_you_overall
            },
            "fashion_checker": {
                "living_wage": fashion_checker_living_wage,
                "overall": fashion_checker_overall
            }
        }
    }
    
    return result