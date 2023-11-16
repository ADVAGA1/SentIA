from transformers import pipeline

pipe = pipeline("audio-classification", model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition", chunk_length_s=30, batch_size=16)
result = pipe(["ejemplo2.opus"])
print(result)