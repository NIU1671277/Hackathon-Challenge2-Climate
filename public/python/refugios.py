import requests
import sys, os
import json
from dotenv import load_dotenv

if __name__ == '__main__':
    country = sys.argv[1]
    query = f"Dame un json con coordenadas de puntos donde haya refugios climáticos: ayuntamientos, centros cívicos en {country}." \
    "las coordenadas deben estar dentro del país pedido. Aquí te dejo un ejemplo de output (recuerda, no debe incluir ninguna frase extra, solo el texto json directamente) para Uruguai" \
    "    // Uruguay" \
    "{ lat: -34.9011, lng: -56.1645, name: 'Montevideo, Plaza Independencia' }," \
    "{ lat: -34.9059, lng: -56.1913, name: 'Montevideo, Parque Rodó'}," \
    "{ lat: -34.4833, lng: -54.3333, name: 'Punta del Este, Playa Mansa' }," \
    "Dame 20 puntos. No añadas ni el prefijo"
    
    load_dotenv()

    url = "https://ai-hackathonuabpayretailers082809715538.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-10-21"

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer 6evUUU8hO6Z13XrWLqupolcAtbxiOdCiw0LBeu2prfMuqEd33BwUJQQJ99BCACYeBjFXJ3w3AAAAACOGQmQt"
    }

    data = {
        "messages": [
            {"role": "system", "content": "Eres un consejero de emergencias climaticas serio y con respuestas acertadas. Tus respuestas no deben tener ninguna explicación, solo la información que se te pide en texto plano. No termines el texto con un elemento a medias, siempre finaliza el array"},
            {"role": "user", "content": f"{query}"}
        ],
        "max_tokens": 2000,
        "temperature": 0.7,
        "top_p": 1.0,
        "n": 1,
        "stream": False
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        datos = response.json()
        respuesta = datos['choices'][0]['message']['content']
        respuesta = respuesta.replace("```json\n", "")
        respuesta = respuesta.replace("\n```", "")
        respuesta_json = json.loads(respuesta)
        print(json.dumps(respuesta_json, indent=4))
    else:
        print(json.dumps({"error": "Failed to get response from OpenAI"}))