from flask import Flask
import sentia 

app = Flask(__name__)

@app.route("/")
def home():
    return "<p>Hello world</p>"

@app.route("/audio")
def audio():
    return sentia.process("ejemplo2.wav")

if __name__ == "__main__":
    app.run(debug=True)