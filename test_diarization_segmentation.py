import librosa
from transformers import pipeline
from pyannote.audio import Pipeline
import torch
import numpy as np

TOKEN = "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"

AUDIO = "positive.wav"

def get_segment(data, start_sec, end_sec, sr):
    start = start_sec*sr
    if end_sec is None:
        return np.array(data[int(start):])

    end = end_sec*sr
    return np.array(data[int(start):int(round(end))])

whisper = pipeline("automatic-speech-recognition", model="openai/whisper-base", chunk_length_s=30, batch_size=16)
emotion = pipeline("audio-classification", model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition", chunk_length_s=30, batch_size=16)

model_path = "cardiffnlp/twitter-xlm-roberta-base-sentiment"
sentiment = pipeline("sentiment-analysis",
                     model=model_path, tokenizer=model_path)

diarization_pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization@2.1",
                                   use_auth_token=TOKEN)

y, sr = librosa.load(AUDIO, sr=16000)

segments = []
current_sec = 0

audio_in_memory= {"waveform": torch.Tensor(y), "sample_rate":sr}

diarization = diarization_pipeline(AUDIO, num_speakers=2)

for turn, track, speaker in diarization.itertracks(yield_label=True):
    start = turn.start
    end = turn.end 

    segment = get_segment(y, start, end, sr)

    chunks = whisper(segment, batch_size=16, return_timestamps=True)["chunks"]

    text = " ".join([chunk["text"] for chunk in chunks])

    sent = sentiment(text)
    emo = emotion(segment, batch_size=16)
    idx = np.argmax([e["score"] for e in emo])

    print("============ RESULTS ============")
    print(f"{speaker} said: {text}\nAnalysis:\n\tSentiment: {sent}\n\tEmotion: {emo[idx]['label']} {emo[idx]['score']}")

