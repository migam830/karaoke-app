from mutagen.mp3 import MP3
from flask import Flask
from flask import request

app = Flask(__name__)

@app.route("/")
def test():
    return "<p>test</p>"

@app.route("/upload-song", methods=['POST'])
def process_audio():
    if request.method == 'POST':
        file1 = request.files['song']
        file1.save('song.mp3')
        return "uploaded file"
    return "Error with request"

@app.route("/analyse-song")
def analyse_song():
    audio = MP3('song.mp3')
    return "length: " + str(audio.info.length)