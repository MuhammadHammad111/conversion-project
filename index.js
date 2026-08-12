const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

// Create Record folder

const historyFolder = path.join(__dirname, "Record");

if (!fs.existsSync(historyFolder)) {
    fs.mkdirSync(historyFolder);
}

// Save History

function saveHistory(data) {

    const filePath = path.join(historyFolder, "Record.txt");

    const record = `
Date: ${new Date().toLocaleString()}
Username: ${data.username}
Converter: ${data.converter}
From: ${data.from}
To: ${data.to}
Input: ${data.input}
Result: ${data.result}`;

    fs.appendFile(filePath, record, (err) => {

        if (err) {
            console.log(err);
        }

    });

}

// POST /conversions
// Create a conversion

app.post("/conversions", (req, res) => {

    const {
        username,
        converter,
        from,
        to,
        value
    } = req.body;

    // Check username
    if (!username) {

        return res.status(400).json({
            error: "Username is required."
        });

    }

    // Check converter

    const converters = [
        "length",
        "weight",
        "temperature"
    ];

    if (!converters.includes(converter)) {

        return res.status(400).json({
            error: "Available converters: length, weight, temperature"
        });

    }

    // Check value

    if (typeof value !== "number") {

        return res.status(400).json({
            error: "Value must be a number."
        });

    }
    // Available units

    let availableUnits = [];
    switch (converter) {
        case "length": availableUnits = [ "km",  "m","cm" ];
            break;
        case "weight": availableUnits = ["kg","g","lb" ];
            break;
        case "temperature":  availableUnits = [ "c",  "f" ];
            break;
    }
    // Check units
    if (
        !availableUnits.includes(from) ||
        !availableUnits.includes(to)
    ) {

        return res.status(400).json({

            error:
                `Available units: ${availableUnits.join(", ")}`

        });

    }

    // Conversion

    let result;
    switch (converter) {
        // LENGTH
        case "length":
            if (from === "km" && to === "m") {
                result = value * 1000;
            }
            else if (from === "m" && to === "km") {
                result = value / 1000;
            }
            else if (from === "m" && to === "cm") {
                result = value * 100;
            }
            else if (from === "cm" && to === "m") {
                result = value / 100;
            }
            else if (from === "km" && to === "cm") {

                result = value * 100000;
            }
            else if (from === "cm" && to === "km") {
                result = value / 100000;
            }
            else if (from === to) {
                result = value;
            }
            break;
        // WEIGHT
        case "weight":
            if (from === "kg" && to === "g") {
                result = value * 1000;
            }
            else if (from === "g" && to === "kg") {
                result = value / 1000;
            }
            else if (from === "kg" && to === "lb") {
                result = value * 2.20462;
            }
            else if (from === "lb" && to === "kg") {
             result = value / 2.20462;
            }
            else if (from === "g" && to === "lb") {
                result = value / 453.592;
            }
            else if (from === "lb" && to === "g") {
                result = value * 453.592;
            }
            else if (from === to) {
                result = value;
            }
            break;
        // TEMPERATURE
        case "temperature":
            if (from === "c" && to === "f") {
                result = (value * 9 / 5) + 32;
            }
            else if (from === "f" && to === "c") {
                result = (value - 32) * 5 / 9;
            }
            else if (from === to) {
                result = value;
            }
            break;
    }
    // Check conversion
    if (result === undefined) {
        return res.status(400).json({
            error:
                `Conversion from ${from} to ${to} is not available.`

        });
    }

    // Save history
    saveHistory({
        username,
        converter,
        from,
        to,
        input: value,
        result

    });

    // Response
    res.status(201).json({
        username,
        converter,
        from,
        to,
        input: value,
        result
    });
});

           // View History
app.get("/conversions", (req, res) => {
    const filePath = path.join(
        historyFolder,
        "Record.txt"
    );
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            error: "No history found."
        });
    }
    fs.readFile(
        filePath,
        "utf8",
        (err, data) => {
            if (err) {
                return res.status(500).json({
                    error: "Unable to read history."
                });
            }
            res.status(200).send(data);
        }
    );

});

app.listen(3000, () => {

    console.log(
        "Server running on port 3000"
    );

});