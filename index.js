const express = require("express");
const app = express();

app.use(express.json());

let converter = "";
let fromUnit = "";
let toUnit = "";

// Route 1: Select converter
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

// Route 2: Select units
app.post("/units", (req, res) => {

    if (!converter) {
        return res.status(400).json({
            error: "Select converter first."
        });
    }

    const { from, to } = req.body;

    let units = [];

    switch (converter) {
        case "length":
            units = ["km", "m", "cm"];
            break;

        case "weight":
            units = ["kg", "g", "lb"];
            break;

        case "temperature":
            units = ["c", "f"];
            break;
    }

    if (!units.includes(from) || !units.includes(to)) {
        return res.status(400).json({
            error: `Available units: ${units.join(", ")}`
        });
    }

    fromUnit = from;
    toUnit = to;

    res.json({
        message: `Units selected: ${from} to ${to}`
    });
});

// Route 3: Convert value
app.post("/convert", (req, res) => {
//check converter is select or not
    if (!converter) {
        return res.status(400).json({
            error: "Select converter first."
        });
    }
//check unit is seleccted or not
    if (!fromUnit || !toUnit) {
        return res.status(400).json({
            error: "Select units first."
        });
    }

    const { value } = req.body;
//check calue is num or not
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

    res.json({
        converter,
        from: fromUnit,
        to: toUnit,
        input: value,
        result
    });
});


app.listen(3000, () => {
    console.log("Server running on PORT");
});
