#Conversion of score to letter grade for the overall score of the brand.
#The overall score is calculated based on the ratings from two sources: Good On You and Fashion Checker,
#and there are four ratings from these two sources that will be used in a formula.

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