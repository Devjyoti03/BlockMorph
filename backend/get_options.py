import requests
from bs4 import BeautifulSoup
import re
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai import ChatSession
import os
load_dotenv()
genAIapi = os.getenv('gem')
genai.configure(api_key = genAIapi)
generation_config = {
    "temperature": 1,
    "top_p":0.95,
    "top_k":64,
    "max_output_tokens":300,
    "response_mime_type" : "application/json",
}



def fetch_content(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    else:
        return None


def parse_html(content):
    soup = BeautifulSoup(content, 'lxml')
    return soup



def extract_essentials(soup):
    details = {}
    details['title'] = soup.title.string if soup.title else ''
    details['meta_description'] = soup.find('meta', attrs={'name': 'description'})
    if details['meta_description']:
        details['meta_description'] = details['meta_description'].get('content', '')
    details['headings'] = [heading.get_text().strip() for heading in soup.find_all(re.compile('^h[1-6]$'))]
    details['main_content'] = ' '.join([p.get_text().strip() for p in soup.find_all('p')])
    return details



def clean_text(text):
    if isinstance(text, list):
        text = ' '.join(text)  # Convert list to a single string
    return re.sub(r'\s+', ' ', text).strip()

def clean_details(details):
    for key in details:
        details[key] = clean_text(details[key])
    return details

schema = {
    "Example idea":"Example idea description",
    "Example idea2":"Example idea2 description",
    "Example idea3":"Example idea2 description",

}
def prepare_prompt(details):
    prompt = (
        f"Title: {details['title']}\n\n"
        f"Meta Description: {details['meta_description']}\n\n"
        f"Headings: {'; '.join(details['headings'])}\n\n"
        f"Main Content: {details['main_content']}\n\n"
        f"Based on the above details, suggest atmost 5 ideas for transforming this website into a Web3 application."
f"do not give any negative answer like 'it may be a complex task, etc.' Just Give the ideas in points and thats it. And make the ideas feasible and practical that can be implemented using a smart contract. "
f"Make the json output be like {schema}."
    )
    return prompt


model = genai.GenerativeModel(
    model_name = "gemini-1.5-flash",
    generation_config = generation_config,
)
history = []
chat = ChatSession(model=model, history=history)



def getResponse(question):
    input_prompt = question
    response = chat.send_message(input_prompt)
    return response.text

def process_url(url):
    print("Trying to process")
    urlNew = "https://"+url
    try:
        content = fetch_content(urlNew)
        if content:
            
            soup = parse_html(content)
            details = extract_essentials(soup)
            cleaned_details = clean_details(details)
            prompt = prepare_prompt(cleaned_details)
            response = getResponse(prompt)
            response = response.replace("*", '')
            print('successfully got the details')
            print(response)
            print(type(response))
            return response

    except Exception as e:
        print(e)
        return "Failed to fetch content from the URL."


# subprocess


