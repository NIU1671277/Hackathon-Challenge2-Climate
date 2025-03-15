// function showTab(tabId) {
//     document.querySelectorAll('.tab').forEach(tab => {
//         document.getElementById(tabId).classList.add('active')
//     });
//     document.getElementById(tabId).classList.add('active');
// }
// Funció per amagar o mostrar pestanyes
// window.onload = () => document.getElementById('maptab').style.display = 'none';

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('maptab').style.display = 'none'
    // Leer el parámetro de consulta "success"
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    // Mostrar una alerta basada en el valor del parámetro
    if (success === "true") {
        window.location.replace('/');
        alert("Registro exitoso.");
        window.location.replace('/');
    } else if (success === "false") {
        alert("Error en el registro.");
    }
})

function showTab(tabId, display) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.style.display = 'none';
    });

    document.getElementById(tabId).style.display = display;

}