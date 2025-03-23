from flask import Flask, request, jsonify
from frequencyAnalysis import findNotes
import os
import time

app = Flask(__name__)

# Directory to store uploaded files
UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
def test():
    return "Backend is working!"

@app.route("/upload-song", methods=['POST'])
def process_audio():
    if 'song' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['song']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Create a unique filename using timestamp
    filename = str(int(time.time())) + ".wav"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    try:
        file.save(filepath)  # Save file
        return jsonify({"message": "File uploaded successfully!", "file_path": filepath}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/analyse-song")
def analyse_song():
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'test.wav')
    
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    try:
        notesList = findNotes(filepath)  # Assuming findNotes processes the file
        return jsonify({"notes": notesList}), 200
    except Exception as e:
        return jsonify({"error": f"Error processing the file: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
