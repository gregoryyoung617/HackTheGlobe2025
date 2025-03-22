#This dataframe that will be used to store the ratings of the brands, and
#the ratings will be used to calculate the overall score of the brand.
#The overall score will be calculated based on the ratings from two sources:
#Good On You and Fashion Checker. There are four ratings from these two sources that will be used in a formula.

#GoodOnYou_Planet: Rating from Good On You for the brand's impact on the planet (out of 5)
#GoodOnYou_Overall: Overall rating from Good On You (out of 5)
#FC_Commitment: Rating from Fashion Checker for the brand's commitment to living wage (out of 5)
#FC_Overall: Overall rating from Fashion Checker (out of 3)
import pandas as pd

# Original data for each column
brands = [
    'Nike', 'Adidas', 'H&M', 'Zara', 'Patagonia', 'American Eagle', 'Uniqlo',
    'Balenciaga', 'North Face', 'Aritzia', 'Lululemon', 'Abercrombie', 'Anta',
    'Urban Outfitters', 'Canada Goose', 'Gildan Activewear Inc.', 'Hugo Boss AG',
    'Zeeman', 'Gap Inc.', 'Walmart', 'Christian Dior', 'Ralph Lauren', 'Shein',
    "Levi's", 'Longchamp', 'Saint Laurent', 'Chanel', 'ALDO', 'DKNY', 'Primark'
]

goy_planet = [
    3, 3, 3, 3, 4, 3, 3, 4, 4, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 2,
    4, 4, 2, 4, 2, 5, 2, 2, 1, 3
]

goy_overall = [
    2, 2, 3, 3, 4, 2, 3, 4, 4, 2, 3, 3, 2, 2, 3, 3, 3, 4, 3, 2,
    2, 3, 1, 4, 2, 3, 2, 2, 2, 3
]

fc_commitment = [
    1, 1, 2, 1, 2, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 2, 1, 3, 0, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 0, 2
]

fc_overall = [
    5, 5, 5, 1, 4, 1, 5, 1, 5, 1, 5, 5, 1, 1, 1, 5, 5, 5, 5, 1,
    1, 5, 1, 4, 1, 1, 1, 1, 1, 2
]

countries = [
    'Vietnam', 'China', 'China', 'Spain', 'Vietnam', 'China', 'Vietnam',
    'Italy', 'Vietnam', 'China', 'Vietnam', 'China', 'China', 'China',
    'Canada', 'Honduras', 'Turkey', 'Bangladesh', 'Bangladesh', 'Bangladesh',
    'France', 'Italy', 'China', 'Mexico', 'France', 'Italy', 'France',
    'China', 'China', 'Bangladesh'
]

# Function to assign sustainability risk based on country
def get_sustainability(country):
    # Lists based on the rule provided
    higher_risk = [
        "Albania", "Algeria", "Angola", "Argentina", "Armenia", "Azerbaijan", "Bangladesh",
        "Belarus", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
        "Brazil", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Central African Republic",
        "Chad", "Chile", "China", "Colombia", "Cote d'Ivoire", "Cuba", "Democratic Republic of Congo",
        "Dominican Republic", "Ecuador", "Egypt", "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon",
        "Georgia", "Ghana", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "India",
        "Indonesia", "Iran", "Iraq", "Israel", "Jordan", "Kazakhstan", "Kenya", "Kyrgyzstan",
        "Laos", "Lebanon", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Malaysia",
        "Mali", "Mauritania", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique",
        "Myanmar", "Namibia", "Nepal", "Nicaragua", "Niger", "Oman", "Pakistan", "Panama",
        "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Puerto Rico", "Republic of the Congo",
        "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Sierra Leone",
        "Slovenia", "Somalia", "South Africa", "South Sudan", "Sri Lanka", "Sudan", "Suriname",
        "Swaziland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tunisia", "Turkey",
        "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "Uzbekistan", "Venezuela",
        "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ]
    medium_risk = [
        "French Guiana", "Macedonia", "Singapore", "South Korea", "Taiwan",
        "United States of America", "Uruguay"
    ]
    lower_risk = [
        "Australia", "Canada", "Iceland", "Japan", "New Zealand", "Norway",
        "Switzerland", "United Kingdom"
    ]
    # Consider EU countries (excluding Romania and Slovenia) as lower risk.
    eu_countries = [
        "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
        "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
        "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta",
        "Netherlands", "Poland", "Portugal", "Slovakia", "Spain"
    ]
    
    if country in higher_risk:
        return "High"
    elif country in medium_risk:
        return "Med"
    elif country in lower_risk or country in eu_countries:
        return "Low"
    else:
        # Default value if country is not in any provided list
        return "Med"

# Compute the sustainability risk for each country
country_sustainability = [get_sustainability(c) for c in countries]

# Build the DataFrame with updated and new columns
data = {
    'Brand': brands,
    'GoodOnYou_Planet': goy_planet,
    'GoodOnYou_Overall': goy_overall,
    'FC_Commitment': fc_commitment,   # Renamed column from FashionChecker_Commitment
    'FC_Overall': fc_overall,         # Renamed column from FashionChecker_Overall
    'Country': countries,
    'Country_sustainability': country_sustainability
}

df = pd.DataFrame(data)
