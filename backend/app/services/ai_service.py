import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
from typing import List
from ..schemas import QMSEvent
from fastapi.encoders import jsonable_encoder # 1. Import the jsonable_encoder

load_dotenv()

def get_ai_response(user_prompt: str, events: List[QMSEvent]) -> str:
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return "Error: GEMINI_API_KEY is not configured in the .env file."
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')

        # 2. Use jsonable_encoder to correctly convert the database objects
        events_data = jsonable_encoder(events)

        # Construct the detailed prompt for the AI model
        system_prompt = f"""
        You are an expert AI assistant for a Quality Management System (QMS) in a life science company.
        You will be given a list of QMS events as context in JSON format.
        Your task is to answer the user's query based ONLY on the provided context.
        Do not make up information. Be concise, professional, and format your response in clear Markdown.

        --- CONTEXT (List of QMS Events) ---
        {json.dumps(events_data, indent=2, default=str)}

        --- USER QUERY ---
        {user_prompt}

        --- RESPONSE ---
        """

        response = model.generate_content(system_prompt)
        return response.text

    except Exception as e:
        print(f"An error occurred while calling the Gemini API: {e}")
        return "Sorry, I encountered an error while processing your request. Please check the backend server logs for more details."