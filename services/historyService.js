const historyRepository =
    require("../repositories/historyRepository");

// CREATE HISTORY
function createHistory(data) {

 const record =
`Date: ${new Date().toLocaleString()}
Username: ${data.username}
Role: ${data.role}
Converter: ${data.converter}
From: ${data.from}
To: ${data.to}
Input: ${data.input}
Result: ${data.result}`;
    historyRepository.saveRecord(record);
}

// GET USER HISTORY

async function getUserHistory(username, role) {

    // ADMIN
    if (role === "admin") {
 // STEP 1: Search File System
        const fsRecord = await historyRepository.findHistoryInFS(username );
        // If found in FS
    if (fsRecord) {
       return { 
                record: fsRecord
            };
        }
 // STEP 2: Search Database
        const dbRecord =await historyRepository.findHistoryInDB(  username);
// If found in Database
        if (dbRecord) {
            return { 
                record: dbRecord
            };
        }
        // NOT FOUND
   throw {
            status: 404,
            message: "Record not found."
        };
    }

// NORMAL USER
    const fsRecord =await historyRepository.findHistoryInFS( username);
// Found in FS
    if (fsRecord) {
        return {
            record: fsRecord
        };
    }

// DATABASE
    const dbRecord =await historyRepository.findHistoryInDB(username);
// Found in Database
    if (dbRecord) {
        return {
            record: dbRecord
        };
    }

// NOT FOUND
    throw {
        status: 404,
        message: "Record not found."
    };
}

// GET ALL HISTORY FROM FS
function getAllHistory() {

    return historyRepository.getAllHistoryFromFS();

}

// EXPORT
module.exports = {

    createHistory,
    getUserHistory,
    getAllHistory

};