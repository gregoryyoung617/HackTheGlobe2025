from flask import Flask, request, jsonify
from flask_cors import CORS
from product_info import get_sustainability_info

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/sustainability', methods=['POST'])
def get_product_sustainability():
    """
    Endpoint to get sustainability information for a product.
    
    Expects a JSON with a 'product' field containing the product string.
    Example: {"product": "<product>Organic Cotton T-shirt by Patagonia</product>"}
    """
    try:
        data = request.get_json()
        
        if not data or 'product' not in data:
            return jsonify({
                'error': 'Missing product information',
                'message': 'Please provide a product string in the format: <product>Product Name by Brand</product>'
            }), 400
            
        product_input = data['product']
        
        # Call the function from product_info.py
        result = get_sustainability_info(product_input)
        # print(product_input)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500

# For testing purposes, include a simple GET route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Sustainability API is running'})

if __name__ == '__main__':
    # Run the Flask app in debug mode
    app.run(debug=True, host='0.0.0.0', port=5000)
