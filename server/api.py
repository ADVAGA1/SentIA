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
    print(res)

    return json.dumps(res)


@app.route("/api/audio/<id>", methods=['GET'])
def audio(id):
    return f"audio: {id}"


def process_audio(file_path: str, id: int):
    result = sentia.process(file_path)
    database.change_state_of(id, result)

    os.remove(file_path)


@app.route("/api/audio/upload", methods=['POST'])
def upload_audio():
    audio_file = request.files["audioFile"]

    audio_id = random.randint(0, 1_000_000)
    file_path = f"tmp/{audio_id}.wav"

    client_id = 0  # TEMPORAL
    id = database.insert_audio(audio_file.filename, client_id)

    audio = AudioSegment.from_file(audio_file)
    audio.export(file_path, format='wav')

    t = threading.Thread(target=process_audio, args=(file_path, id))
    t.start()

    return "{}"


if __name__ == "__main__":
    database.setup()
    app.run(debug=True)
