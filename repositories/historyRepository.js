const fs = require("fs");
const path = require("path");

const historyFolder = path.join(__dirname, "../Record");

if (!fs.existsSync(historyFolder)) {
    fs.mkdirSync(historyFolder);
}

const historyFile = path.join(
    historyFolder,
    "Record.txt"
);

// Save history
function saveRecord(record) {
    fs.appendFile(
        historyFile,
        record,
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}

// Check history
function historyExists() {
    return fs.existsSync(historyFile);
}

// Read history
function getHistory(callback) {
    fs.readFile(
        historyFile,
        "utf8",
        callback
    );
}

module.exports = {
    saveRecord,
    historyExists,
    getHistory
};