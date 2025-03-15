// function showTab(tabId) {
//     document.querySelectorAll('.tab').forEach(tab => {
//         document.getElementById(tabId).classList.add('active')
//     });
//     document.getElementById(tabId).classList.add('active');
// }
// Funció per amagar o mostrar pestanyes
window.onload = () => document.getElementById('maptab').style.display = 'none';

function showTab(tabId, display) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.style.display = 'none';
    });

    document.getElementById(tabId).style.display = display;

}