document.addEventListener('DOMContentLoaded', async () => {
    const currentTemp = document.getElementById('current-temp');
    const currentHumidity = document.getElementById('current-humidity');
    const currentPrecipitation = document.getElementById('current-precipitation');
    const currentWind = document.getElementById('current-wind');
    const forecastDays = document.querySelector('.forecast-days');

    try {
        const response = await fetch('/tiempo');
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        const currentWeather = data[0];

        // Update current weather
        currentTemp.textContent = currentWeather.temperature_2m.toFixed(1);
        currentHumidity.textContent = currentWeather.relative_humidity_2m;
        currentPrecipitation.textContent = currentWeather.precipitation_probability;
        currentWind.textContent = (currentWeather.wind_speed_10m * 3.6).toFixed(1); // Convert m/s to km/h

        // Update forecast
        const displayedDates = new Set();
        data.forEach(day => {
            const date = new Date(day.date);
            const formattedDate = date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();

            if (!displayedDates.has(formattedDate)) {
                displayedDates.add(formattedDate);

                const forecastDay = document.createElement('div');
                forecastDay.className = 'forecast-day';
                forecastDay.innerHTML = `
                    <p><strong>${formattedDate}</strong></p>
                    <p>${day.temperature_2m.toFixed(1)}°C</p>
                `;
                forecastDays.appendChild(forecastDay);
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('weather').innerHTML = '<p>Failed to load weather data.</p>';
    }

    // Agregar el listener para el evento 'keypress' en el campo de entrada
    document.getElementById('query').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Mensaje inicial del bot
    const message = '### Consejos de Sostenibilidad para Ayudar a Combatir el Cambio Climático en Tiempos de Sequía y Calor\n\nLa emergencia climática, especialmente en forma de sequías y olas de calor, requiere acciones concretas y efectivas. Aquí te presento algunos consejos de sostenibilidad que pueden ayudar a mitigar estos problemas:\n\n1. **Conservación del Agua**: \n   - Implementa prácticas de ahorro de agua en tu hogar, como la instalación de grifos y duchas de bajo flujo, reparación de fugas y la recolección de agua de lluvia para riego. Usa técnicas de riego por goteo en jardines para maximizar la eficiencia del agua.\n\n2. **Uso de Energías Renovables**: \n   - Considera la posibilidad de utilizar fuentes de energía renovable, como la solar o la eólica, en tu hogar o comunidad. La inversión en paneles solares no solo reduce tu huella de carbono, sino que también puede disminuir la demanda de energía durante las olas de calor.\n\n3. **Fomento de la Agricultura Sostenible**: \n   - Apoya la agricultura local y sostenible. Opta por productos orgánicos y de temporada que utilizan menos recursos hídricos y químicos. Si tienes espacio, considera cultivar tus propios alimentos utilizando técnicas de cultivo que requieran menos agua, como la permacultura.\n\n4. **Creación de Espacios Verdes**: \n   - Participa en iniciativas para crear y mantener espacios verdes en tu comunidad. Los árboles y plantas ayudan a enfriar el ambiente, mejorar la calidad del aire y conservar el agua. Además, promueven la biodiversidad y ofrecen refugio a la fauna local.\n\n5. **Educación y Conciencia Ambiental**: \n   - Comparte información sobre la importancia de la sostenibilidad y la conservación del agua con tu familia, amigos y comunidad. La educación es clave para fomentar un cambio cultural hacia prácticas más sostenibles que ayuden a enfrentar el cambio climático.\n\nImplementando estas estrategias, no solo contribuirás a la sostenibilidad de tu entorno, sino que también ayudarás a mitigar los efectos del cambio climático en tu comunidad. Cada acción cuenta, y juntos podemos hacer una diferencia.';
    const chatMessages = document.getElementById('chat-messages');

    const botMessageElement = document.createElement('div');
    botMessageElement.className = 'message bot-message';

    const formattedMessage = message
        .replace(/###\s*(.*?)(\n|$)/g, '<h3><strong>$1</strong></h3>') 
        .replace(/\n/g, '<br>') 
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    botMessageElement.innerHTML = formattedMessage;
    chatMessages.appendChild(botMessageElement);
});

async function sendMessage() {
    const input = document.getElementById('query');
    const message = input.value.trim();

    if (message) {
        // Crear un nuevo elemento de mensaje para el usuario
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user-message';
        userMessageElement.textContent = message;

        // Agregar el mensaje del usuario al contenedor de mensajes
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.appendChild(userMessageElement);

        // Limpiar el campo de entrada
        input.value = '';

        // Mostrar el indicador "El bot está escribiendo..."
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.textContent = 'J.A.N.A. está escribiendo...';
        chatMessages.appendChild(typingIndicator);

        // Desplazarse al final del contenedor de mensajes
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Enviar el mensaje al servidor y obtener la respuesta del bot
            const chatbotInit = await fetch(`/chatbot/${encodeURIComponent(message)}`);
            const chatbotJson = await chatbotInit.json();

            // Ocultar o eliminar el indicador "El bot está escribiendo..."
            chatMessages.removeChild(typingIndicator);

            if (chatbotJson.response) {
                // Formatear la respuesta del bot
                const formattedMessage = chatbotJson.response
                    .replace(/###\s*(.*?)(\n|$)/g, '<h3><strong>$1</strong></h3>') 
                    .replace(/\n/g, '<br>') 
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                // Crear un nuevo elemento de mensaje para el bot
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'message bot-message';
                botMessageElement.innerHTML = formattedMessage;

                // Agregar el mensaje del bot al contenedor de mensajes
                chatMessages.appendChild(botMessageElement);
            } else if (chatbotJson.error) {
                // Mostrar un mensaje de error si hay un problema
                const errorMessageElement = document.createElement('div');
                errorMessageElement.className = 'message bot-message';
                errorMessageElement.textContent = "Error: " + chatbotJson.error;
                chatMessages.appendChild(errorMessageElement);
            }
        } catch (error) {
            console.error('Error:', error);

            // Ocultar o eliminar el indicador "El bot está escribiendo..."
            chatMessages.removeChild(typingIndicator);

            // Mostrar un mensaje de error en el chat
            const errorMessageElement = document.createElement('div');
            errorMessageElement.className = 'message bot-message';
            errorMessageElement.textContent = "Error: No se pudo obtener una respuesta del bot.";
            chatMessages.appendChild(errorMessageElement);
        }

        // Desplazarse al final del contenedor de mensajes
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}