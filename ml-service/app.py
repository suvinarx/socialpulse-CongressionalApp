import os
from dotenv import load_dotenv
import openai
from flask import Flask, request, jsonify
from nltk.corpus import wordnet
from nltk.tokenize import word_tokenize
from collections import defaultdict
import nltk
from flask_cors import CORS
import emoji

# Load NLTK resources
nltk.download('punkt')
nltk.download('wordnet')

# Load environment variables from the .env file
load_dotenv()

# Set up Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Set OpenAI API key
api_key = os.getenv('OPENAI_API_KEY')
openai.api_key = api_key

def text_parser_synonym_finder(text: str):
    tokens = word_tokenize(text)
    synonyms = defaultdict(list)

    for token in tokens:
        for syn in wordnet.synsets(token):
            for i in syn.lemmas():
                synonyms[token].append(i.name())

    return synonyms

def generate_tags(text_input):
    # Define the prompt for extracting tags
    prompt = f"Generate a list of relevant tags for the following text:\n\n\"{text_input}\"\n\nTags:"

    # Use the OpenAI ChatCompletion API with the gpt-4 model
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=50,
        temperature=0.3,
        top_p=1.0
    )

    # Extract and clean the response
    tags_response = response.choices[0].message['content'].strip()
    tags = tags_response.split(", ")

    return tags

def generate_emojis(text_input):
    # Define the prompt for extracting emojis
    prompt = f"Suggest appropriate emojis for the following text sentiment:\n\n\"{text_input}\"\n\nEmojis:"

    # Use the OpenAI ChatCompletion API with the gpt-4 model
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=10,
        temperature=0.3,
        top_p=1.0
    )

    # Extract and clean the response
    emoji_response = response.choices[0].message['content'].strip()
    emojis = emoji_response.split(" ")

    return emojis

# API endpoint to generate tags
@app.route('/find-tags', methods=['POST'])
def generate_tags_api():
    # Get JSON data from the request
    data = request.get_json()

    # Ensure text input is provided
    if 'text' not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data['text']

    # Generate tags
    try:
        tags = generate_tags(text)
        return jsonify({"tags": tags}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint to generate emojis
@app.route('/find-emojis', methods=['POST'])
def generate_emojis_api():
    # Get JSON data from the request
    data = request.get_json()

    # Ensure text input is provided
    if 'text' not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data['text']

    # Generate emojis
    try:
        emojis = generate_emojis(text)
        return jsonify({"emojis": emojis}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
