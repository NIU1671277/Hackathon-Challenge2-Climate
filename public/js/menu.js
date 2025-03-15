// Función para cambiar entre las pestañas de "Tiempo" y "Mapa"
function showTab(tabId) {
    document.querySelectorAll('.content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}


