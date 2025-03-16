const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const port = 8080;

// Here go the middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Here go the routing
app.get('/tiempo', (req, res) => {
    const pythonProcess = spawn("python", [path.join(__dirname, 'public/python/weather_api.py')])
    data = path.join(__dirname, 'data/hourly_weather_data.json');
    res.sendFile(data);
});

app.get('/tiempo/actual', (req, res) => {
    const pythonProcess = spawn("python", [
        path.join(__dirname, 'public/python/current_weather_api.py'),
        req.query.latitude,
        req.query.longitude
    ]);

    let resultData = "";
    let errorData = "";

    // Capturar la salida del script de Python
    pythonProcess.stdout.on("data", (data) => {
        resultData += data.toString();
    });

    // Capturar errores del script de Python
    pythonProcess.stderr.on("data", (data) => {
        errorData += data.toString();
    });

    // Manejar el cierre del proceso de Python
    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            console.error(`Python Script Error: ${errorData}`);
            if (!res.headersSent) {
                res.status(500).json({ error: "Python script error", details: errorData });
            }
            return;
        }

        if (!resultData.trim()) {
            if (!res.headersSent) {
                res.status(500).json({ error: "No data received from Python script" });
            }
            return;
        }

        try {
            const result = JSON.parse(resultData);
            if (!res.headersSent) {
                res.json(result); // Enviar el JSON como respuesta
            }
        } catch (error) {
            console.error(`Parsing Error: ${error.message}`);
            console.error(`Python Output: ${resultData}`);
            if (!res.headersSent) {
                res.status(500).json({ error: "Failed to parse Python output", details: resultData });
            }
        }
    });
});

app.get('/refugios/:pais', (req, res) => {
    const pais = req.params['pais'];
    const pythonProcess = spawn('python', [path.join(__dirname, 'public/python/refugios.py'), pais]);
    let resultData = "";
    let errorData = "";

    // Capturar la salida del script de Python
    pythonProcess.stdout.on("data", (data) => {
        resultData += data.toString();
    });

    // Capturar errores del script de Python
    pythonProcess.stderr.on("data", (data) => {
        errorData += data.toString();
    });

    // Manejar el cierre del proceso de Python
    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            console.error(`Python Script Error: ${errorData}`);
            if (!res.headersSent) {
                res.status(500).json({ error: "Python script error", details: errorData });
            }
            return;
        }

        if (!resultData.trim()) {
            if (!res.headersSent) {
                res.status(500).json({ error: "No data received from Python script" });
            }
            return;
        }

        try {
            const result = JSON.parse(resultData);
            if (!res.headersSent) {
                res.json(result); // Enviar el JSON como respuesta
            }
        } catch (error) {
            console.error(`Parsing Error: ${error.message}`);
            console.error(`Python Output: ${resultData}`);
            if (!res.headersSent) {
                res.status(500).json({ error: "Failed to parse Python output", details: resultData });
            }
        }
    });
})

app.get('/alerta', (req, res) => {
    const pythonProcess = spawn("python", [path.join(__dirname, 'public/python/temp_demo.py')])
    setTimeout(res.redirect('/'), 2000);
})

app.post('/addNum', (req, res) => {
    const { phone, ciutat } = req.body;

    // Llamar al script de Python
    const pythonProcess = spawn("python", [path.join(__dirname, 'public/python/addnum.py'), phone, ciutat]);
    let resultData = "";

    // Capturar la salida del script de Python
    pythonProcess.stdout.on("data", (data) => {
        resultData += data.toString();
    });

    // Capturar errores del script de Python
    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data.toString()}`);
        if (!res.headersSent) {
            res.status(500).json({ error: "Python script error" });
        }
    });

    // Manejar el cierre del proceso de Python
    pythonProcess.on("close", (code) => {
        if (!resultData.trim()) {
            if (!res.headersSent) {
                res.status(500).json({ error: "No data received from Python script" });
            }
            return;
        }

        try {
            // Analizar la salida del script de Python
            const result = resultData.trim().toLowerCase(); // Convertir a minúsculas para comparar

            if (result === "true") {
                // Si la salida es "true", redirigir con un parámetro de éxito
                if (!res.headersSent) {
                    res.redirect('/?success=true');
                }
            } else {
                // Si la salida no es "true", redirigir con un parámetro de error
                if (!res.headersSent) {
                    res.redirect('/?success=false');
                }
            }
        } catch (error) {
            console.error(`Parsing Error: ${error.message}`);
            if (!res.headersSent) {
                res.status(500).json({ error: "Failed to parse Python output" });
            }
        }
    });
});

app.get('/chatbot/:query', (req, res) => {
    const query = req.params['query'];

    const pythonProcess = spawn("python", [path.join(__dirname, 'public/python/chatbot.py'), query]);
    let resultData = "";

    // Capturar la salida del script de Python
    pythonProcess.stdout.on("data", (data) => {
        resultData += data.toString();
    });

    // Capturar errores del script de Python
    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data.toString()}`);
        if (!res.headersSent) {
            res.status(500).json({ error: "Python script error" });
        }
    });

    // Manejar el cierre del proceso de Python
    pythonProcess.on("close", () => {
        if (!resultData.trim()) {
            if (!res.headersSent) {
                res.status(500).json({ error: "No data received from Python script" });
            }
            return;
        }

        try {
            const result = JSON.parse(resultData);
            if (!res.headersSent) {
                res.json(result);
            }
        } catch (error) {
            console.error(`Parsing Error: ${error.message}`);
            if (!res.headersSent) {
                res.status(500).json({ error: "Failed to parse Python output" });
            }
        }
    });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
