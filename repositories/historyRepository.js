const fs = require("fs");
const path = require("path");

const pool = require("../config/db");

// ================================
// FS CONFIGURATION
// ================================

const historyFolder =
    path.join(__dirname, "../Record");

if (!fs.existsSync(historyFolder)) {
    fs.mkdirSync(historyFolder);
}

const historyFile =
    path.join(historyFolder, "Record.txt");


// ================================
// SAVE HISTORY IN FS
// ================================

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


// ================================
// CHECK FS FILE
// ================================

function historyExists() {

    return fs.existsSync(historyFile);
}


// ================================
// READ COMPLETE FS HISTORY
// ================================

function getHistory(callback) {

    fs.readFile(
        historyFile,
        "utf8",
        callback
    );
}


// ================================
// FIND USER HISTORY IN FS
// ================================

function findHistoryInFS(username) {

    return new Promise((resolve, reject) => {

        if (!historyExists()) {
            return resolve(null);
        }

        fs.readFile(
            historyFile,
            "utf8",
            (err, data) => {

                if (err) {
                    return reject(err);
                }

                const records =
                    data
                        .split("\n\n")
                        .filter(record =>
                            record.includes(
                                `Username: ${username}`
                            )
                        );

                if (records.length === 0) {
                    return resolve(null);
                }

                resolve(records.join("\n\n"));
            }
        );
    });
}


// ================================
// FIND USER HISTORY IN DATABASE
// ================================

async function findHistoryInDB(username) {

    const query = `
        SELECT
            id,
            username,
            role,
            converter,
            from_unit,
            to_unit,
            input_value,
            result,
            created_at
        FROM history
        WHERE username = $1
        ORDER BY created_at DESC
    `;

    const result =
        await pool.query(
            query,
            [username]
        );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows;
}


module.exports = {

    saveRecord,
    historyExists,
    getHistory,

    findHistoryInFS,
    findHistoryInDB
};