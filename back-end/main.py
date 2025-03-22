from flask import Flask
from flask import request
from frequencyAnalysis import findNotes

app = Flask(__name__)

@app.route("/")
def test():
    return "<p>test</p>"

@app.route("/upload-song", methods=['POST'])
def process_audio():
    if request.method == 'POST':
        file1 = request.files['song']
        file1.save('song.wav')
        return "uploaded file"
    return "Error with request"

@app.route("/analyse-song")
def analyse_song():
    notesList = findNotes('test.wav')
    return "Notes: " + str(notesList)