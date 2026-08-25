const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "../data/users.json");

// Create data folder if needed
const dataFolder = path.join(__dirname, "../data");

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

// Create users.json if it doesn't exist
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]");
}

// Get all users
function getUsers() {
    const data = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(data);
}

// Save users
function saveUsers(users) {
    fs.writeFileSync(
        usersFile,
        JSON.stringify(users, null, 2)
    );
}

// Find user by username
function findUserByUsername(username) {
    const users = getUsers();

    return users.find(
        user => user.username === username
    );
}

// Add user
function addUser(user) {
    const users = getUsers();

    users.push(user);

    saveUsers(users);
}

module.exports = {
    getUsers,
    saveUsers,
    findUserByUsername,
    addUser
};