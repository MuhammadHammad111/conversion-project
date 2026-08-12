const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());


let converter = "";
let fromUnit = "";
let toUnit = "";

// Create history folder
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
Result: ${data.result}
`;

    fs.appendFile(filePath, record, (err) => {
        if (err) {
            console.log(err);
        }
    });
}
// Select Converter

app.post("/converter", (req, res) => {

    const { type } = req.body;

    const converters = ["length", "weight", "temperature"];

    if (!converters.includes(type)) {
        return res.status(400).json({
            error: "Available converters: length, weight, temperature"
        });
    }

    converter = type;
    fromUnit = "";
    toUnit = "";

    res.json({
        message: `${type} converter selected`
    });

});

// Select Units

app.post("/selectUnit", (req, res) => {

    if (!converter) {
        return res.status(400).json({
            error: "Select converter first."
        });
    }

    const { from, to } = req.body;

    let selectunit = [];

    switch (converter) {

        case "length":
            selectunit = ["km", "m", "cm"];
            break;

        case "weight":
            selectunit = ["kg", "g", "lb"];
            break;

        case "temperature":
            selectunit = ["c", "f"];
            break;
    }

    if (!selectunit.includes(from) || !selectunit.includes(to)) {

        return res.status(400).json({
            error: `Available units: ${selectunit.join(", ")}`
        });

    }

    fromUnit = from;
    toUnit = to;

    res.json({
        message: `${fromUnit} -> ${toUnit}`
    });

});

// Convert Value
app.post("/convertvalue", (req, res) => {
 const { username, value } = req.body;
    if (!converter) {
        return res.status(400).json({
            error: "Select converter first."
        });
    }

    if (!fromUnit || !toUnit) {
        return res.status(400).json({
            error: "Select units first."
        });
    }

   

    if (!username) {
        return res.status(400).json({
            error: "Username is required."
        });
    }

    if (typeof value !== "number") {
        return res.status(400).json({
            error: "Value must be a number."
        });
    }

    let result;

    switch (converter) {

        case "length":

            if (fromUnit === "km" && toUnit === "m")
                result = value * 1000;

            else if (fromUnit === "m" && toUnit === "km")
                result = value / 1000;

            else if (fromUnit === "m" && toUnit === "cm")
                result = value * 100;

            else if (fromUnit === "cm" && toUnit === "m")
                result = value / 100;

            else if (fromUnit === "km" && toUnit === "cm")
                result = value * 100000;

            else if (fromUnit === "cm" && toUnit === "km")
                result = value / 100000;

            else if (fromUnit === toUnit)
                result = value;

            break;

        case "weight":

            if (fromUnit === "kg" && toUnit === "g")
                result = value * 1000;

            else if (fromUnit === "g" && toUnit === "kg")
                result = value / 1000;

            else if (fromUnit === "kg" && toUnit === "lb")
                result = value * 2.20462;

            else if (fromUnit === "lb" && toUnit === "kg")
                result = value / 2.20462;

            else if (fromUnit === "g" && toUnit === "lb")
                result = value / 453.592;

            else if (fromUnit === "lb" && toUnit === "g")
                result = value * 453.592;

            else if (fromUnit === toUnit)
                result = value;

            break;

        case "temperature":

            if (fromUnit === "c" && toUnit === "f")
                result = (value * 9 / 5) + 32;

            else if (fromUnit === "f" && toUnit === "c")
                result = (value - 32) * 5 / 9;

            else if (fromUnit === toUnit)
                result = value;

            break;
    }

    if (result === undefined) {
        return res.status(400).json({
            error: `Conversion from ${fromUnit} to ${toUnit} is not available.`
        });
    }

   saveHistory({
    username,
    converter,
    from: fromUnit,
    to: toUnit,
    input: value,
    result
});

    res.json({
        username:username,
        converter,
        from: fromUnit,
        to: toUnit,
        input: value,
        result
    });

});
// View History
app.get("/history", (req, res) => {

    const filePath = path.join(historyFolder, `Record.txt`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            error: "No history found for this user."
        });
    }

    fs.readFile(filePath, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                error: "Unable to read history."
            });
        }

        res.send(data);
    });
});
app.listen(3000, () => {
    console.log("Server running on PORT");
});