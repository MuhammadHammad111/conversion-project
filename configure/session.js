const session = require("express-session");

const sessionConfig = session({
    secret: "my-converter-secret",
    resave: false,
    saveUninitialized: false,

    cookie: {
        maxAge: 60 * 60 * 1000
    }
});

module.exports = sessionConfig;