from transformers import pipeline

whisper = pipeline("automatic-speech-recognition", model="openai/whisper-base", chunk_length_s=30, batch_size=16)
chunks = whisper("ejemplo2.opus", batch_size=16, return_timestamps=True)["chunks"]

for chunk in chunks:
    print(chunk["text"])