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
emotion = pipeline("audio-classification",
                   model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition", chunk_length_s=30, batch_size=16)
sentiment = pipeline("sentiment-analysis", model="cardiffnlp/twitter-xlm-roberta-base-sentiment",
                     tokenizer="cardiffnlp/twitter-xlm-roberta-base-sentiment")
diarization = Pipeline.from_pretrained(
    "pyannote/speaker-diarization@2.1", use_auth_token=TOKEN)


def process(audio_file: str, num_speakers = 2) -> str:
    if DEBUG: print(f"Processing file: {audio_file}")
    y, sr = librosa.load(audio_file, sr=16000)

    # audio_in_memory = {"waveform": torch.Tensor(y), "sample_rate": sr}
    diar = diarization(audio_file, num_speakers=num_speakers)

    audio_results = []

    for turn, track, speaker in diar.itertracks(yield_label=True):
        if DEBUG: print(turn, track, speaker)

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

    return json.dumps(audio_results, indent=2)


if __name__ == "__main__":
    print(process("ejemplo2.wav"))
