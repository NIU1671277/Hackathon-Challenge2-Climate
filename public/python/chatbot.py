import requests
import os
import sys
import json
from dotenv import load_dotenv

if __name__ == '__main__':
    query = sys.argv[1]
    load_dotenv()

    OPEN_AI_TOKEN = '6evUUU8hO6Z13XrWLqupolcAtbxiOdCiw0LBeu2prfMuqEd33BwUJQQJ99BCACYeBjFXJ3w3AAAAACOGQmQt'

    url = "https://ai-hackathonuabpayretailers082809715538.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-10-21"

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPEN_AI_TOKEN
    }

    data = {
        "messages": [
            {"role": "system", "content": "Eres un consejero de emergencias climaticas serio y con respuestas acertadas y con información veridica y educado,"
            "tu funcionalidad es proponer metodos para apaciguar la emergencia climatica de forma precisa y lo mas corto posible ya que el usuario estaria en caso de emergencia y asi orientar "
            "a los usuarios confusos que te pregunten y posibles soluciones i/o recomendaciones propon minimo 2 i 4 maximo"},
            {"role": "user", "content": f"{query}"}  # enviar mensaje a IA como salir de un incendio
        ],
        "max_tokens": 500,
        "temperature": 0.7,
        "top_p": 1.0,
        "n": 1,
        "stream": False
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        datos = response.json()
        respuesta = datos['choices'][0]['message']['content']
        # Devolver solo la respuesta del chatbot en formato JSON
        print(json.dumps({"response": respuesta}))
    else:
        # Si hay un error, devolver un mensaje de error en formato JSON
        print(json.dumps({"error": "Failed to get response from OpenAI"}))