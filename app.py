import json
import os
from flask import Flask, send_from_directory, request, jsonify

app = Flask(__name__, static_folder='.', static_url_path='')

DATA_FILE = 'data.json'
IMAGES_DIR = 'images'

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        with open(DATA_FILE, 'r') as f:
            return jsonify(json.load(f))
    except FileNotFoundError:
        return jsonify({"homepage": {}, "gallery": []}), 404

@app.route('/api/data', methods=['POST'])
def save_data():
    data = request.json
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    return jsonify({"status": "success"})

@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = file.filename
        filepath = os.path.join(IMAGES_DIR, filename)
        file.save(filepath)
        # Return path relative to web root
        return jsonify({"url": f"images/{filename}"})

if __name__ == '__main__':
    # Ensure images directory exists
    os.makedirs(IMAGES_DIR, exist_ok=True)
    app.run(host='127.0.0.1', port=5000, debug=True)
