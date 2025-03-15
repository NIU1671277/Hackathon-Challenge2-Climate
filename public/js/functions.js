async function showWeather() {
    const content = document.getElementById('weather');

    let data = await fetch('/tiempo');
    let dataJson = await data.json();
    
    console.log(dataJson);
    
}