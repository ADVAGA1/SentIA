from transformers import pipeline


data = ["El coche no está mal, cumple su función, pero no me gusta la visibilidad. Cuesto mucho ver a un coche que está en una zona de punto ciego. Las ventanas traseras son pequeñas.",
        "Super! Das auto ist super schnell, aber der Motor is zu laut und groB."]

model_path = "cardiffnlp/twitter-xlm-roberta-base-sentiment"
sentiment = pipeline("sentiment-analysis",
                     model=model_path, tokenizer=model_path)

result = sentiment(data)
print(result)
