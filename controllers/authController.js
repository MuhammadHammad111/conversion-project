const authService =require("../services/authService");

// REGISTER
async function register(req, res) {

    try {

        const { username, password } = req.body;

        const user =
            await authService.registerUser(
                username,
                password
            );

        res.status(201).json({
            message: "Registration successful.",
            user
        });

    } catch (error) {

        res.status(error.status || 500).json({
            error: error.message || "Server error."
        });
    }
}

// LOGIN
async function login(req, res) {

    try {

        const { username, password } = req.body;

        const user =await authService.loginUser(username,password );

        req.session.user = user;
        res.status(200).json({
            message: "Login successful.",
            user
        });

    } catch (error) {

        res.status(error.status || 500).json({
            error: error.message || "Server error."
        });
    }
}

// LOGOUT
function logout(req, res) {

    req.session.destroy(err => {

        if (err) {
            return res.status(500).json({
                error: "Unable to logout."
            });
        }

        res.status(200).json({
            message: "Logout successful."
        });
    });
}

// CURRENT USER
function getCurrentUser(req, res) {

    res.status(200).json({
        user: req.session.user
    });
}

module.exports = { register,
    login,
    logout,
    getCurrentUser
};