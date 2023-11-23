from pyannote.audio import Pipeline

TOKEN = "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"

pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization@2.1",
                                   use_auth_token=TOKEN)


#pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1",
#                                  use_auth_token=TOKEN)

#import torch
#pipeline.to(torch.device('cuda'))

# apply the pipeline to an audio file
diarization = pipeline("ejemplo2.wav", num_speakers=2)

for turn, _, speaker in diarization.itertracks(yield_label=True):
    print(f"start={turn.start:.1f}s stop={turn.end:.1f}s speaker_{speaker}")