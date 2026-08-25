const bcrypt = require("bcrypt");

const userRepository = require("../repositories/userRepository");

// REGISTER
async function registerUser(username, password) {

    if (!username) {
        throw {
            status: 400,
            message: "Username is required."
        };
    }

    if (!password) {
        throw {
            status: 400,
            message: "Password is required."
        };
    }

    const existingUser =
        userRepository.findUserByUsername(username);

    if (existingUser) {
        throw {
            status: 409,
            message: "Username already exists."
        };
    }

    let role;

    if (username === "Hamad") {
        role = "admin";
    } else {
        role = "user";
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const newUser = {
        id: Date.now(),
        username,
        password: hashedPassword,
        role
    };

    userRepository.addUser(newUser);

    return {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
    };
}

// LOGIN
async function loginUser(username, password) {

    if (!username || !password) {
        throw {
            status: 400,
            message: "Username and password are required."
        };
    }

    const user =
        userRepository.findUserByUsername(username);

    if (!user) {
        throw {
            status: 401,
            message: "Invalid username or password."
        };
    }

    const validPassword =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!validPassword) {
        throw {
            status: 401,
            message: "Invalid username or password."
        };
    }

    return {
        id: user.id,
        username: user.username,
        role: user.role
    };
}

module.exports = {
    registerUser,
    loginUser
};