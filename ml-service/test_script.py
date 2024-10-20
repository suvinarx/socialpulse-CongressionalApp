# test_script.py
import os
from dotenv import load_dotenv
import openai
from ml_tag_generator import generate_tags

# Load environment variables
load_dotenv()

# Verify if the API key is loaded properly
if os.getenv('OPENAI_API_KEY'):
    print("API key loaded successfully.")
else:
    print("Error: API key not loaded. Check your .env file.")

# Test the generate_tags function with sample input
test_text = "Artificial intelligence and machine learning are rapidly advancing fields in technology."
tags = generate_tags(test_text)

print("Generated Tags:")
print(tags)

