from pyannote.audio import Pipeline

TOKEN = "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"

pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization@2.1",
                                    use_auth_token=TOKEN)

#pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.0",
#                                    use_auth_token=TOKEN)


# apply the pipeline to an audio file
diarization = pipeline("ejemplo2.wav", num_speakers=2)

print(type(diarization))