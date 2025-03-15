// function showTab(tabId) {
//     document.querySelectorAll('.tab').forEach(tab => {
//         document.getElementById(tabId).classList.add('active')
//     });
//     document.getElementById(tabId).classList.add('active');
// }
// Funció per amagar o mostrar pestanyes
function showTab(tabId) {
    // Amaga totes les pestanyes
    document.querySelectorAll('.tab').forEach(tab => {
        tab.style.display = 'none'; // Amaga cada pestanya
    });

    // Mostra la pestanya seleccionada
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'flex'; // Mostra la pestanya desitjada
    }
}