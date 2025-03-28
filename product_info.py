import pandas as pd
import random
import json
import requests
import os

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

Format: "[BrandName] has a [rating] rating of [overall score]. [1 sentence about sustainability efforts based on ratings]."
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
    if score >= 97: return "A+"
    elif score >= 93: return "A"
    elif score >= 90: return "A-"
    elif score >= 87: return "B+"
    elif score >= 83: return "B"
    elif score >= 80: return "B-"
    elif score >= 77: return "C+"
    elif score >= 73: return "C"
    elif score >= 70: return "C-"
    elif score >= 67: return "D+"
    elif score >= 63: return "D"
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
    
    # In a real implementation, this would be loaded from a database
    # For this mockup, we'll create a sample dataframe
    # TODO: INSERT ACTUAL DATAFRAME
    data = {
        'Brand': ['Nike', 'Adidas', 'H&M', 'Zara', 'Patagonia', product_brand],
        'GoodOnYou_Planet': [2.5, 3.5, 3.0, 2.0, 4.5, random.uniform(1.0, 5.0)],
        'GoodOnYou_Overall': [3.0, 3.5, 2.5, 2.5, 4.0, random.uniform(1.0, 5.0)],
        'FashionChecker_LivingWage': [2.0, 3.0, 2.5, 2.0, 4.0, random.uniform(1.0, 5.0)],
        'FashionChecker_Overall': [2.5, 3.0, 2.5, 2.0, 4.5, random.uniform(1.0, 5.0)]
    }
    
    df = pd.DataFrame(data)
    
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
    fashion_checker_living_wage = round(float(brand_row['FashionChecker_LivingWage'].values[0]), 1)
    fashion_checker_overall = round(float(brand_row['FashionChecker_Overall'].values[0]), 1)
    
    # Calculate overall score (out of 100)
    overall_numerical = (
        (good_on_you_planet / 5) * 25 +
        (good_on_you_overall / 5) * 25 +
        (fashion_checker_living_wage / 5) * 25 +
        (fashion_checker_overall / 5) * 25
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

# Example usage
def main():
    # Example input
    product_input = "<product>Organic Cotton T-shirt by Patagonia</product>"
    
    # Process input and get result
    result = get_sustainability_info(product_input)
    
    # Output result
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
