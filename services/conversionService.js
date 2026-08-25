const converters = [
    "length",
    "weight",
    "temperature"
];

const units = {
    length: ["km", "m", "cm"],
    weight: ["kg", "g", "lb"],
    temperature: ["c", "f"]
};

function convert(converter, from, to, value) {

    // CHECK CONVERTER
    if (!converters.includes(converter)) {
        throw {
            status: 400,
            message:
                "Available converters: length, weight, temperature"
        };
    }

    // CHECK VALUE
    if (typeof value !== "number") {
        throw {
            status: 400,
            message: "Value must be a number."
        };
    }

    // CHECK UNITS
    const availableUnits = units[converter];

    if (
        !availableUnits.includes(from) ||
        !availableUnits.includes(to)
    ) {
        throw {
            status: 400,
            message:
                `Available units: ${availableUnits.join(", ")}`
        };
    }

    let result;

    switch (converter) {

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

    if (result === undefined) {
        throw {
            status: 400,
            message:
                `Conversion from ${from} to ${to} is not available.`
        };
    }

    return result;
}

module.exports = {
    convert
};