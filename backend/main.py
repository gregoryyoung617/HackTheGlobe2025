import json
import product_info

def main():
    # Example input
    product_input = "<product>Organic Cotton T-shirt by Patagonia</product>"
    
    # Process input and get result
    result = product_info.get_sustainability_info(product_input)
    
    # Output result
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()