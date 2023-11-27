from flask import Flask, request
from flask_cors import CORS
import json

import sentia
import database

app = Flask(__name__)
CORS(app)


@app.route("/api/audio/", methods=['GET'])
def home():
    return database.get_audios()


@app.route("/api/audio/<id>", methods=['GET'])
def audio(id):
    return f"audio: {id}"
    # kreturn sentia.process("ejemplo2.wav")


if __name__ == "__main__":
    app.run(debug=True)
