const fs = require("fs");
const path = require("path");

const pool = require("../configure/db");

// FS CONFIGURATION
const historyFolder =
    path.join(__dirname, "../Record");

if (!fs.existsSync(historyFolder)) {

    fs.mkdirSync(historyFolder);
}

const historyFile =
    path.join(historyFolder, "Record.txt");

// SAVE HISTORY IN FS
function saveRecord(record) {

    fs.appendFile( historyFile,  record, err => {
if (err) {
     console.log(err);
            }

        }
    );
}
// CHECK FS FILE
function historyExists() {
    return fs.existsSync(historyFile);
}

// READ COMPLETE FS HISTORY
function getHistory(callback) {

    fs.readFile( historyFile,"utf8",callback );
}

// FIND USER HISTORY IN FS
function findHistoryInFS(username) {
    return new Promise((resolve, reject) => {
        // File does not exist
        if (!historyExists()) {
            return resolve(null);
        }
fs.readFile(  historyFile, "utf8",(err, data) => {
 if (err) {
   return reject(err);
                }
  // Split records
  const records = data.split(/\r?\n\r?\n/).filter(record =>  record.trim() !== "" );

// Find username
 const foundRecords = records.filter(record => {
 const lines = record.split(/\r?\n/);

 const usernameLine = lines.find(line =>line.startsWith( "Username:") );

 if (!usernameLine) {
        return false;
 }
const storedUsername =usernameLine .replace(  "Username:", "").trim();
  return ( storedUsername.toLowerCase() === username.toLowerCase() );

                    });

  // Not found
  if (foundRecords.length === 0) {
      return resolve(null);
                }
// Convert FS records to JSON
const jsonRecords =foundRecords.map(record => {

 const lines =record.split(/\r?\n/);
     const obj = {};
              lines.forEach(line => 
 {
    const [key, ...value ] = line.split(": ");
if ( key && value.length > 0)
 {
     obj[key.toLowerCase() ] =value.join(": "); }
    });
 return obj;

 });
resolve(jsonRecords);

            }
        );

    });
}

// FIND USER HISTORY IN DATABASE
async function findHistoryInDB(username) {

    const query = ` SELECT id, username,role,converter, from_unit, to_unit,  input_value,result, created_at
        FROM conversion_records WHERE LOWER(username) = LOWER($1) ORDER BY created_at DESC `;
    const result =
        await pool.query( query,[username]);

    // No records
    if (result.rows.length === 0) {

        return null;
    }

    return result.rows;
}


// GET ALL HISTORY FROM FS

function getAllHistoryFromFS() {

    return new Promise((resolve, reject) => {

        // File does not exist
        if (!historyExists()) {

            return resolve([]);
        }
 fs.readFile(  historyFile, "utf8",  (err, data) => {
 if (err) {
  return reject(err);
                }
 // Split records
const records =data.split(/\r?\n\r?\n/).filter(record => record.trim() !== "" );
// Convert to JSON
const jsonRecords = records.map(record => {
     const lines = record.split(/\r?\n/);
 const obj = {};
 lines.forEach(line => {
  const [key,  ...value ] = line.split(": ");
    if ( key && value.length > 0 ) {
  obj[ key.toLowerCase()] =value.join(": ");
                            }
 });
  return obj;
   });
  resolve(jsonRecords);
            }
        );

    });
}
// GET ALL HISTORY FROM DATABASE
async function getAllHistoryFromDB() {

    const query = `SELECT id, username, role,converter,from_unit,to_unit,input_value, result,created_at
        FROM conversion_records ORDER BY created_at DESC`;
    const result = await pool.query(query);
    return result.rows;
}

// EXPORT

module.exports = {

    saveRecord,

    historyExists,

    getHistory,

    findHistoryInFS,

    findHistoryInDB,

    getAllHistoryFromFS,

    getAllHistoryFromDB

};