const historyRepository =
    require("../repositories/historyRepository");

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

function getUserHistory(username, role) {

    return new Promise((resolve, reject) => {

        if (!historyRepository.historyExists()) {
            return reject({
                status: 404,
                message: "No history found."
            });
        }

        historyRepository.getHistory(
            (err, data) => {

                if (err) {
                    return reject({
                        status: 500,
                        message: "Unable to read history."
                    });
                }

                // ADMIN
                if (role === "admin") {
                    return resolve(data);
                }

                // NORMAL USER
                const records =
                    data
                        .split("\n\n")
                        .filter(record =>
                            record.includes(
                                `Username: ${username}`
                            )
                        );

                if (records.length === 0) {
                    return reject({
                        status: 404,
                        message:
                            "No history found for this user."
                    });
                }

                resolve(
                    records.join("\n\n")
                );
            }
        );
    });
}

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