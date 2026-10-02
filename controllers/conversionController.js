const conversionService = require("../services/conversionService");

const historyService = require("../services/historyService");

function createConversion(req, res) {

    try {
   const {converter, from, to, value } = req.body;
        let username = "Guest";
        let role = "guest";
if (req.session.user) { username = req.session.user.username;
            role = req.session.user.role;
        }
const result =conversionService.convert( converter,from, to,value );
    historyService.createHistory({ username, role, converter,from, to, input: value,result });

        res.status(201).json({ username, role, converter,from, to, input: value, result });
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Server error."
        });
    }
}

async function getHistory(req, res) {

    try {
        const { username, role } = req.session.user;
        const history =  await historyService.getUserHistory( username, role );
        res.status(200).send(history);
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message
        });
    }
}
async function searchHistory(req, res) {

    try {
        const username = req.params.username;

        const role = req.session.user.role;


 // Only admin can search any username
 if (role !== "admin") {
  return res.status(403).json({
                message: "Only admin can search other users."
            });
        }

  const result =  await historyService.getUserHistory( username, role    );
        res.json(result);

    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Server error"
        });
    }
}
module.exports = {
    createConversion,
    getHistory,
    searchHistory
};