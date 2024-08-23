import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
genAIapi = os.getenv('gem')
genai.configure(api_key=genAIapi)

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

def generate_documentation(demo_code, language):
    prompt_text = f'''
    I will send you a solidity contract, and your response will strictly be in a json format.
    In a key called 'functions' give me an array always with each function name in a separate 'name' key, 
    what is it doing in a 'description' key, and 
    write the implementation logic code of that particular function using {language} code in a '{language}' key. 
    If there are other information to keep in mind then use the key "other" and write the value there in plain text
    format only and if the language is python always write what the code you provided assumes to be already existing
    for your code to work in such a way without creating new lines so that I can create a comment in python with
    the value of the 'other'.

    The solidity contract is : [
	{demo_code}
    ]

    Do not give me anything else except what I am asking.
    '''
    try:
        response = model.generate_content(prompt_text)
        response_data = response.text.strip()
        return eval(response_data)
    except Exception as e:
        raise ValueError(f"Failed to generate or parse model response: {str(e)}")
