// Coordenadas aproximadas para centrar el mapa en Latinoamérica
const lat = -14.2350;
const lng = -51.9253;
const zoomLevel = 4;

// Inicializar el mapa
const map = L.map('map').setView([lat, lng], zoomLevel);

// Añadir la capa de tiles (puedes usar diferentes proveedores de mapas)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Crear un panel personalizado para los polígonos de países
const polygonPane = map.createPane('polygonPane');
polygonPane.style.zIndex = 400; // Colocar por encima de la capa base pero por debajo de los popups

// Lista de países de Latinoamérica (nombres en inglés para coincidir con el GeoJSON)
const paisesLatinoamerica = [
    "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Costa Rica", "Cuba",
    "Dominican Republic", "Ecuador", "El Salvador", "Guatemala", "Haiti", "Honduras",
    "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Uruguay", "Venezuela"
];

// Objeto para almacenar los límites geográficos (bounding boxes) de cada país
const countryBounds = {};

// Crear control para mostrar información sobre el país en hover
const info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    // Añadir estilo al panel de información
    this._div.style.backgroundColor = 'white';
    this._div.style.padding = '10px';
    this._div.style.borderRadius = '10px';
    this._div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    this.update();
    return this._div;
};

info.update = function (props) {
    const contents = props ? `<b>${props.name}</b><br>${props.temp}°C` : 'Seleciona un pais';
    this._div.innerHTML = `<h4>Temperatura</h4>${contents}`;
};

info.addTo(map);

// Definir escala de colores basada en temperatura
function getColor(temp) {
    return temp > 30 ? '#ff0000' :  // Rojo para temperaturas altas
           temp > 25 ? '#ff7800' :  // Naranja
           temp > 20 ? '#ffcc00' :  // Amarillo
           temp > 15 ? '#33cc33' :  // Verde
                        '#3399ff';  // Azul para temperaturas bajas
}

// Obtener temperaturas y actualizar el mapa
async function updateMapWithTemperature() {
    const apiKey = 'edde7a742c7e0db4cadb5a510b69c988'; // Reemplaza con tu clave de API
    const countryTemps = {};

    // Obtener datos de temperatura por país
    for (const country of paisesLatinoamerica) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: country,
                    appid: apiKey,
                    units: 'metric'
                }
            });
            countryTemps[country] = response.data.main.temp;
        } catch (error) {
            console.error(`Error obteniendo la temperatura de ${country}:`, error);
        }
    }

    // Actualizar colores en el mapa y agregar polígonos
    axios.get('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => {
            const countries = response.data.features;
            const latamCountries = countries.filter(country =>
                paisesLatinoamerica.includes(country.properties.name)
            );

            latamCountries.forEach(country => {
                const temp = countryTemps[country.properties.name]; // Valor de la temperatura
                const polygon = L.geoJSON(country, {
                    pane: 'polygonPane',
                    style: {
                        color: "#000", // Borde negro
                        weight: 1,
                        fillColor: getColor(temp),
                        fillOpacity: 0.6
                    }
                }).addTo(map);

                // Almacenar los límites geográficos del país
                countryBounds[country.properties.name] = polygon.getBounds();

                // Añadir eventos de hover y clic
                polygon.on({
                    mouseover: function (e) {
                        const layer = e.target;
                        layer.setStyle({
                            weight: 5,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.7
                        });
                        layer.bringToFront();
                        info.update({ name: country.properties.name, temp: temp });
                    },
                    mouseout: function (e) {
                        const layer = e.target;
                        layer.setStyle({
                            weight: 1,
                            color: "#000",
                            fillOpacity: 0.6
                        });
                        info.update(); // Restaurar el contenido de la leyenda cuando se saca el ratón
                    },
                    click: function (e) {
                        map.fitBounds(e.target.getBounds());
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error cargando el GeoJSON:", error);
        });
}

updateMapWithTemperature();

// Añadir leyenda con la escala de colores y fondo blanco/redondeo
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 10, 20, 30, 40];
    const labels = [];
    let from, to;

    for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            `<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`
        );
    }

    div.innerHTML = labels.join('<br>');
    // Añadir estilo al fondo blanco y bordes redondeados
    div.style.backgroundColor = 'white';
    div.style.padding = '10px';
    div.style.borderRadius = '10px';
    div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    return div;
};

legend.addTo(map);
