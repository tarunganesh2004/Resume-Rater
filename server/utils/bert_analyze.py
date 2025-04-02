import sys
import json
from transformers import BertTokenizer, BertModel
import torch

# Load pre-trained BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
model = BertModel.from_pretrained("bert-base-uncased")


def analyze_text(text):
    # Tokenize the text
    inputs = tokenizer(
        text, return_tensors="pt", truncation=True, padding=True, max_length=512
    )
    words = tokenizer.tokenize(text)

    # Basic analysis
    word_count = len(words)
    keywords = [word for word in words if word.isalpha() and len(word) > 3][
        :10
    ]  # Top 10 alphanumeric keywords
    sentences = text.split(".")
    readability = (
        word_count / len(sentences) if sentences else 0
    )  # Words per sentence (rough readability)

    # Action verbs (simple list-based approach)
    action_verbs_list = ["led", "managed", "developed", "built", "designed"]
    action_verbs = [word for word in words if word.lower() in action_verbs_list][:5]

    # Return results as JSON
    result = {
        "wordCount": word_count,
        "keywords": keywords,
        "readability": round(readability, 2),
        "actionVerbs": action_verbs,
    }
    return json.dumps(result)


if __name__ == "__main__":
    # Read text from command line argument
    text = sys.argv[1]
    print(analyze_text(text))
