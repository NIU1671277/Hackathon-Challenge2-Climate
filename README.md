
---

# 🌍 Latamergence: Alertas y Asistencia en Emergencias Climáticas 🚨

**Latamergence** es una aplicación diseñada para mejorar la calidad de vida en Latinoamérica mediante el uso responsable de tecnologías de IA. Nuestra solución se centra en proporcionar alertas tempranas en caso de emergencias meteorológicas o catástrofes naturales, así como en ofrecer asistencia y recomendaciones de sostenibilidad a través de un chatbot experto. 🌦️🤖

---

## 🎯 Objetivos del Proyecto

- **Alertas en tiempo real**: Enviar SMS a los usuarios cuando se detecten condiciones meteorológicas extremas o desastres naturales. 📲
- **Mapa interactivo**: Mostrar información sobre desastres naturales, temperaturas y refugios climáticos. 🗺️
- **Chatbot experto**: Ofrecer asistencia y recomendaciones de sostenibilidad basadas en el contexto actual. 💬
- **Concienciación climática**: Promover buenas prácticas y acciones sostenibles para combatir el cambio climático. 🌱

---

## 🛠️ Tecnologías Utilizadas

- **Backend**: Python, Flask, Open-Meteo API, Twilio API.
- **Frontend**: HTML, CSS, JavaScript, Leaflet.js.
- **IA**: Integración de LLMs para el chatbot y añadir información sobre refugios en zonas de interés.

---

## 🚀 Funcionalidades Principales

### 1. **Alertas por SMS** 📨
Un usuario interesado en recibir alertas debe proporcionar su número de teléfono y su ciudad de interés.

Cuando se detecta una condición meteorológica extrema (como una ola de calor o una tormenta), el sistema enviará un SMS de alerta a estos usuarios. Esto se logra mediante la integración de la API de Twilio.

**Implementado:**

Cuando cualquier usuario consulta la web, se revisan las próximas temperaturas de las ubicaciones de interés (predicción). Si estas muestran una subida brusca, avisa a todos los teléfonos asociados a esa ubicación.

> [!NOTE]
> Los mensajes se envían por SMS para evitar la posible brecha digital que pueden sufrir los usuarios a causa de recursos no disponibles (Internet).

---

![alt text](<public/img/captura1.jpg>)

### 2. **Mapa Interactivo** 🗺️
El mapa muestra:
- **Temperaturas actuales** por país (con colores que indican la gravedad).
- **Incendios reportados** (marcadores rojos).
- **Refugios climáticos** (marcadores verdes).

---

![alt text](<public/img/captura2.jpg>)


### 3. **Asistente Virtual Experto en Emergencias Climáticas, Prevención de Riesgos y Sostenibilidad** 🤖
El asistente ofrece:
- **Asistencia en emergencias**: Información sobre qué hacer en caso de desastres naturales.
- **Recomendaciones de sostenibilidad**: Consejos personalizados basados en el contexto (por ejemplo, cómo ahorrar agua durante una sequía).

---

![alt text](<public/img/captura3.jpg>)

### 4. **Refugios climáticos personalizados** 🏫
La aplicación web proporciona, inicialmente, algunas ubicaciones de refugios climáticos (escuelas, ayuntamientos, bibliotecas...) para informar al usuario. Sin embargo, cuando un usuario se interesa por una zona concreta (país), la web genera nuevos indicadores de refugios mediante IA.

Esta funcionalidad se podría implementar a pequeña escala, siendo realmente útil en una situación de emergencia real.

---

![alt text](<public/img/captura4.jpg>)

---

## 🌱 Sostenibilidad

Nuestra aplicación no solo alerta sobre emergencias, sino que también promueve la sostenibilidad:
- **Consejos personalizados**: El asistente virtual ofrece recomendaciones basadas en el contexto (por ejemplo, cómo reducir el consumo de energía durante una ola de calor).
- **Concienciación climática**: La aplicación busca proporcionar información sobre el cambio climático y cómo las acciones individuales pueden marcar la diferencia.
- **Refugios climáticos**: Localización de espacios seguros durante emergencias.

---

## 🧩 Partes Relevantes del Código

### **Backend**
- **`addNum.py`**: Registra números de teléfono y ciudades para enviar alertas.
- **`current_weather_api.py`**: Obtiene datos meteorológicos actuales.
- **`weather_api.py`**: Obtiene datos meteorológicos horarios.
- **`temp.py`**: Detecta cambios bruscos de temperatura y envía alertas.

### **Frontend**
- **`index.html`**: Interfaz de usuario con el mapa y el chatbot.
- **`script.js`**: Lógica del mapa interactivo.
- **`functions.js`**: Interfaz del asistente y visualización de datos meteorológicos.

---

## 📈 Potencial Futuro

El proyecto tiene un gran potencial de crecimiento:
- **Múltiples tipos de desastres naturales en tiempo real**: Integrar más APIs para obtener información en tiempo real sobre otros desastres naturales: inundaciones, terremotos,...

- **Escala local**: Cambiar la implementación para que sea específica para ciudades, sobretodo en las funcionalidades de indicadores de refugios y previsión del clima.

- **Integración de un sistema de routing**: Implementar un sistema que permita generar rutas desde la ubicación del usuario hasta los refugios climáticos cercanos disponibles.

## 👥 Equipo

- **Jan**: Full-stack (centrado en back-end).
- **Albert**: Integración APIs, SMS y refugios climáticos generados.
- **Natàlia**: Asistente virtual y diseño de la interfície.
- **Arnau**: Mapa Javascript y css app (front-end).

---

## 🌟 Conclusión

**Latamergence** es una solución innovadora que combina tecnología, sostenibilidad y concienciación climática para mejorar la calidad de vida en Latinoamérica. Con un enfoque en la escalabilidad y el impacto positivo, esta app tiene el potencial de convertirse en una herramienta esencial para comunidades locales. 🌟

---