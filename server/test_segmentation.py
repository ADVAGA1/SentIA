import librosa
from transformers import pipeline
import numpy as np

y, sr = librosa.load("ejemplo2.opus", sr=16000)

whisper = pipeline("automatic-speech-recognition", model="openai/whisper-base", chunk_length_s=30, batch_size=16)
emotion = pipeline("audio-classification", model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition", chunk_length_s=30, batch_size=16)

model_path = "cardiffnlp/twitter-xlm-roberta-base-sentiment"
sentiment = pipeline("sentiment-analysis",
                     model=model_path, tokenizer=model_path)

chunks = whisper(y.copy(), batch_size=16, return_timestamps=True)["chunks"]

segments = []
current_sec = 0

def get_segment(data, start_sec, end_sec, sr):
    start = start_sec*sr
    if end_sec is None:
        return np.array(data[int(round(start)):])

    end = end_sec*sr
    return np.array(data[int(start):int(round(end))])

print("============ RESULTS ============")

for chunk in chunks:
    start, end = chunk["timestamp"]
    text = chunk["text"].strip()
    print(text)
    segment = get_segment(y, start, end, sr)
    emo = emotion(segment.copy(), batch_size=16)

    emotions = [e["score"] for e in emo]
    idx = np.argmax(emotions)

    print("  ", emo[idx]["label"], emo[idx]["score"])
    sent = sentiment(text)
    print("  ", sent)
