# filepath: /c:/Users/lena/Documents/Personal/HTG2025/HackTheGlobe2025/backend/main.py
import json

def get_sustainability_info(product_input):
    # Stub sustainability check
    return {
        "product": product_input,
        "sustainability": "Data not yet implemented"
    }

def main():
    # Example input
    product_input = "<product>Organic Cotton T-shirt by Patagonia</product>"
    
    # Process input and get result
    result = get_sustainability_info(product_input)
    
    # Output result
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()