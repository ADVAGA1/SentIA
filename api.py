from transformers import pipeline

whisper = pipeline("automatic-speech-recognition",
                   model="openai/whisper-base", chunk_length_s=30, batch_size=16)

model_path = "cardiffnlp/twitter-xlm-roberta-base-sentiment"
sentiment = pipeline("sentiment-analysis",
                     model=model_path, tokenizer=model_path)


def process_audio(filepath: str) -> dict[str, float]:

    chunks = whisper(filepath, batch_size=16, return_timestamps=True)["chunks"]

    sentiments = []

    for chunk in chunks:
        s = sentiment(chunk["text"])[0]
        s["text"] = chunk["text"]
        sentiments.append(s)

    result = {}

    sum = 0

    for s in sentiments:
        label = s["label"]
        score = s["score"]

        if label == 'negative':
            score = -score
        if label == 'neutral':
            score = 0

        print(s["text"], score)

        if label == 'neutral':
            score = 0

        sum = sum + score

    result["label"] = "positive" if sum >= 0 else "negative"
    result["score"] = sum

    return result


if __name__ == "__main__":
    print(process_audio("positive.opus"))
