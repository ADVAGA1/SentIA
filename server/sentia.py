import librosa
from transformers import pipeline
from pyannote.audio import Pipeline
import torch
import numpy as np
import json

DEBUG = True

TOKEN = "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"


def get_segment(data, start_sec, end_sec, sr):
    start = start_sec*sr
    if end_sec is None:
        return np.array(data[int(start):])

    end = end_sec*sr
    return np.array(data[int(start):int(round(end))])


# Models
whisper = pipeline("automatic-speech-recognition",
                   model="openai/whisper-base", chunk_length_s=30, batch_size=16)
"""
emotion = pipeline("audio-classification",
                   model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition", chunk_length_s=30, batch_size=16)
"""
emotion = pipeline("audio-classification",
                   model="chin-may/wav2vec2-audio-emotion-classification", chunk_length_s=30, batch_size=16)
sentiment = pipeline("sentiment-analysis", model="cardiffnlp/twitter-xlm-roberta-base-sentiment",
                     tokenizer="cardiffnlp/twitter-xlm-roberta-base-sentiment")
diarization = Pipeline.from_pretrained(
    "pyannote/speaker-diarization@2.1", use_auth_token=TOKEN)

def get_score(audio):
    score = [0,0,0]
    score_overall = 0

    for segment in audio:
        if segment["sentiment"]["label"] == "positive":
            score[0] += segment["sentiment"]["score"]
            score_overall += segment["sentiment"]["score"]
        elif segment["sentiment"]["label"] == "negative":
            score[1] += segment["sentiment"]["score"]
            score_overall -= segment["sentiment"]["score"]
        else:
            score[2] += segment["sentiment"]["score"]

    score = [(value / sum(score)) * 100 for value in score]
    score.append(score_overall)
    return score


def process(audio_file: str, num_speakers=2) -> str:
    if DEBUG:
        print(f"Processing file: {audio_file}")
    y, sr = librosa.load(audio_file, sr=16000)

    # audio_in_memory = {"waveform": torch.Tensor(y), "sample_rate": sr}
    diar = diarization(audio_file, num_speakers=num_speakers)

    audio_results = []

    for turn, track, speaker in diar.itertracks(yield_label=True):
        if DEBUG:
            print(turn, track, speaker)

        start = turn.start
        end = turn.end

        audio_segment = get_segment(y, start, end, sr)
        text_chunks = whisper(audio_segment, batch_size=16,
                              return_timestamps=True)["chunks"]

        text = " ".join([chunk["text"] for chunk in text_chunks]).strip()

        sent = sentiment(text)
        emo = emotion(audio_segment, batch_size=16)

        idx = np.argmax([e["score"] for e in emo])

        result = {
            "speaker": int(speaker.split("_")[-1]),
            "text": text,
            "segment": (start, end),
            "sentiment": sent[0],
            "emotion": {"label": emo[idx]["label"], "score": emo[idx]["score"]}
        }

        audio_results.append(result)
    
    general_sentiment = get_score(audio_results)

    d = {
        "general_sentiment": general_sentiment,
        "segments": audio_results
    }

    if DEBUG:
        print(f"Finished procesing file: {audio_file}")

    return json.dumps(d, indent=2)


if __name__ == "__main__":
    print(process("ejemplo2.wav"))
