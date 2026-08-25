const userRepository = require("../repositories/userRepository");

const historyService = require("../services/historyService");

// GET ALL USERS
function getUsers(req, res) {

    const users =
        userRepository.getUsers();

    const safeUsers =
        users.map(user => ({
            id: user.id,
            username: user.username,
            role: user.role
        }));

    res.status(200).json({
        count: safeUsers.length,
        users: safeUsers
    });
}

// GET ALL HISTORY
async function getAllHistory(req, res) {

    try {

        const history =
            await historyService.getAllHistory();

        res.status(200).send(history);

    } catch (error) {

        res.status(error.status || 500).json({
            error: error.message
        });
    }
}

module.exports = {
    getUsers,
    getAllHistory
};