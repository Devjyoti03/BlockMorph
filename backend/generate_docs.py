from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os 

load_dotenv()
genAIapi = os.getenv('gem')
genai.configure(api_key = genAIapi)

generation_config = {
    "temperature": 0.5,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_response():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    if 'language' not in data:
        return jsonify({"error": "'language' key is missing in the JSON request"}), 400
    
    language = data['language']
    demo_code=data['code']
    
    prompt_text = f'''
    I will send you a solidity contract, and your response will strictly be in a json format.
    In a key called 'functions' give me an array always with each function name in a seperate 'name' key, 
    what is it doing in a 'description' key, and 
    write the implementation logic code of that particular function using {language} code in a '{language}' key. 
    If there are other informations to keep in mind then use the key "other" and write the value there in plain text
    format only and if the language is python always write what the code you provided assumes to be already existing
    for your code to work in such a way without creating new lines so that I can create a comment in python with
    the value of the 'other'.
    
    The solidity contract is : [
	{demo_code}
    ]

    Do not give me anything else except what i am asking.
    ''' 
    
    
    try:
        response = model.generate_content(prompt_text)
        try:
            response_data = response.text.strip()
            return jsonify(eval(response_data))
        except Exception as parse_error:
            return jsonify({"error": f"Failed to parse model response as JSON: {str(parse_error)}"}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
