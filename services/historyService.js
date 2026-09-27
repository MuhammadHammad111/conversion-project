const historyRepository =
    require("../repositories/historyRepository");


// ======================================
// CREATE HISTORY
// ======================================

function createHistory(data) {

    const record =
`Date: ${new Date().toLocaleString()}
Username: ${data.username}
Role: ${data.role}
Converter: ${data.converter}
From: ${data.from}
To: ${data.to}
Input: ${data.input}
Result: ${data.result}

`;

    historyRepository.saveRecord(record);
}


// ======================================
// GET USER HISTORY
// FS → DATABASE
// ======================================

async function getUserHistory(username, role) {

    // ==================================
    // ADMIN
    // ==================================

    if (role === "admin") {

        return getAllHistory();
    }


    // ==================================
    // STEP 1: SEARCH FS
    // ==================================

    const fsRecord =
        await historyRepository.findHistoryInFS(
            username
        );


    // ==================================
    // IF FOUND IN FS
    // ==================================

    if (fsRecord) {

        return {
            source: "FS",
            record: fsRecord
        };
    }


    // ==================================
    // STEP 2: SEARCH DATABASE
    // ==================================

    const dbRecord =
        await historyRepository.findHistoryInDB(
            username
        );


    // ==================================
    // IF FOUND IN DATABASE
    // ==================================

    if (dbRecord) {

        return {
            source: "Database",
            record: dbRecord
        };
    }


    // ==================================
    // NOT FOUND ANYWHERE
    // ==================================

    throw {
        status: 404,
        message: "Record not found."
    };
}


// ======================================
// GET ALL HISTORY
// ======================================

function getAllHistory() {

    return new Promise((resolve, reject) => {

        if (!historyRepository.historyExists()) {

            return reject({
                status: 404,
                message: "No history found"
            });
        }

        historyRepository.getHistory(
            (err, data) => {

                if (err) {

                    return reject({
                        status: 500,
                        message:
                            "Unable to read history."
                    });
                }

                resolve(data);
            }
        );
    });
}


module.exports = {

    createHistory,
    getUserHistory,
    getAllHistory
};