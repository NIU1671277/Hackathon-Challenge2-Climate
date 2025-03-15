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
});