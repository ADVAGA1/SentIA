import os
from flask import Flask, request
from flask_cors import CORS
from pydub import AudioSegment
import threading
import random
import json

import sentia
import database

app = Flask(__name__)
CORS(app)


@app.route("/api/audio", methods=['GET'])
def home():
    res = database.get_audios()
    return json.dumps(res)


@app.route("/api/audio/<id>", methods=['GET'])
def audio(id):
    res = database.get_audio(id)
    return json.dumps(res)


def process_audio(file_path: str, id: int):
    result = sentia.process(file_path)
    database.change_state_of(id, result)

    os.remove(file_path)


@app.route("/api/audio/remove", methods=['POST'])
def remove_audio():
    id = request.form["id"]
    database.remove(id)
    return "{}"


@app.route("/api/audio/upload", methods=['POST'])
def upload_audio():
    audio_file = request.files["audioFile"]
    label = request.form["label"]
    client_id = request.form["clientID"]

    audio_id = random.randint(0, 1_000_000)

    if not os.path.isdir(".tmp"):
        os.mkdir(".tmp")

    file_path = f".tmp/{audio_id}.wav"

    id = database.insert_audio(audio_file.filename, label, client_id)

    audio = AudioSegment.from_file(audio_file)
    audio.export(file_path, format='wav')

    t = threading.Thread(target=process_audio, args=(file_path, id))
    t.start()

    return "{}"


@app.route("/api/search/<term>", methods=['GET'])
def search(term: str):
    res = database.search(term)
    return json.dumps(res)


if __name__ == "__main__":
    database.setup()
    app.run(debug=True)
