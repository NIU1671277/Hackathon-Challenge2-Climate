const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/tiempo', (req, res) => {
    data = path.join(__dirname, 'misc/hourly_weather_data.json');
    res.sendFile(data);
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
