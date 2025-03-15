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
                // Si la salida es "true", devolver éxito
                if (!res.headersSent) {            
                    res.redirect('/');
                }
            } else {
                // Si la salida no es "true", devolver error
                if (!res.headersSent) {
                    res.status(400).json({ success: false, message: "Operation failed", output: result });
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

app.listen(port, () => console.log(`Server listening on port ${port}`));