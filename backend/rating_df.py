#This dataframe that will be used to store the ratings of the brands, and
#the ratings will be used to calculate the overall score of the brand.
#The overall score will be calculated based on the ratings from two sources:
#Good On You and Fashion Checker. There are four ratings from these two sources that will be used in a formula.

#GoodOnYou_Planet: Rating from Good On You for the brand's impact on the planet (out of 5)
#GoodOnYou_Overall: Overall rating from Good On You (out of 5)
#FC_Commitment: Rating from Fashion Checker for the brand's commitment to living wage (out of 5)
#FC_Overall: Overall rating from Fashion Checker (out of 3)

import pandas as pd
data = {
    'Brand': [
        'Nike', 'Adidas', 'H&M', 'Zara', 'Patagonia', 'American Eagle', 'Uniqlo', 'Balenciaga',
        'North Face', 'Aritzia', 'Lululemon', 'Abercrombie', 'Anta', 'Urban Outfitters',
        'Canada Goose', 'Gildan Activewear Inc.', 'Hugo Boss AG', 'Zeeman', 'Gap Inc.',
        'Walmart', 'Christian Dior', 'Ralph Lauren', 'Shein', "Levi's", 'Longchamp',
        'Saint Laurent', 'Chanel', 'ALDO', 'DKNY', 'Primark'
    ],
    'GoodOnYou_Planet': [
        3, 3, 3, 3, 4, 3, 3, 4, 4, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 2,
        4, 4, 2, 4, 2, 5, 2, 2, 1, 3
    ],
    'GoodOnYou_Overall': [
        2, 2, 3, 3, 4, 2, 3, 4, 4, 2, 3, 3, 2, 2, 3, 3, 3, 4, 3, 2,
        2, 3, 1, 4, 2, 3, 2, 2, 2, 3
    ],
    'FC_Commitment': [
        1, 1, 2, 1, 2, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 2, 1, 3, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0, 0, 2
    ],
    'FC_Overall': [
        5, 5, 5, 1, 4, 1, 5, 1, 5, 1, 5, 5, 1, 1, 1, 5, 5, 5, 5, 1,
        1, 5, 1, 4, 1, 1, 1, 1, 1, 2
    ]
}

df = pd.DataFrame(data)