const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

                // SESSION
app.use( session({
        secret: "my-converter-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000 
        }
    })
);

            // USERS FILE
const usersFile = path.join(__dirname, "users.json");
// Create users.json if it does not exist
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(  usersFile,"[]" );
}

                // Read users
function getUsers() {

    const data = fs.readFileSync( usersFile, "utf8" );
       return JSON.parse(data);
}

                      // Save users
function saveUsers(users) {
    fs.writeFileSync( usersFile,JSON.stringify(users, null, 2)
    );
}

                         // RECORD FOLDER
const historyFolder = path.join(__dirname,"Record");

if (!fs.existsSync(historyFolder)) {
    fs.mkdirSync(historyFolder);
}

                         // SAVE HISTORY
function saveHistory(data) {

    const filePath = path.join(historyFolder, "Record.txt" );
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
    fs.appendFile(filePath,record,(err) => {
       if (err) {
                console.log(err);
            }
        }
    );

}

          // AUTHENTICATION MIDDLEWARE
// User must be logged in

function requireLogin(req, res, next) {

    if (!req.session.user) {
        return res.status(401).json({error: "Please login first"});
    }
    next();
}

// ADMIN MIDDLEWARE
function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({
            error: "Please login first."
        });
    }
    if (req.session.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required."});
    }
    next();
}

// REGISTER
// POST /register

app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    // Check username
    if (!username) {
        return res.status(400).json({
            error: "Username is required."
        });
    }

    // Check password
    if (!password) {
        return res.status(400).json({
            error: "Password is required."
        });
    }

    const users = getUsers();

    // Check duplicate username
    const existingUser = users.find(
        user => user.username === username
    );

    if (existingUser) {
        return res.status(409).json({
            error: "Username already exists."
        });
    }

    // YOU decide who is admin
    let role;
    if (username === "Hamad") {
        role = "admin";
    } else {
        role = "user";
    }
    // Hash password
    const hashedPassword = await bcrypt.hash( password, 10)

    // Create user
    const newUser = {
        id: Date.now(),
        username: username,
        password: hashedPassword,
        role: role
    };
    users.push(newUser);
    saveUsers(users);
    res.status(201).json({
        message: "Registration successful.",
        user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role
        }
    });

});

//Login
app.post("/login", async (req, res) => {

    const {  username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({
            error: "Username and password are required."
        });
    }

    const users = getUsers();
    // Find user
    const user = users.find(
        user => user.username === username
    );
    if (!user) {
        return res.status(401).json({ error: "Invalid username or password." });
    }
    // Compare password
    const validPassword = await bcrypt.compare(
        password,  user.password
    );
    if (!validPassword) {
        return res.status(401).json({
            error: "Invalid username or password."
        });
    }

    // CREATE SESSION
    req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    res.status(200).json({ message: "Login successful.", user: req.session.user
    });

});

// Logout
app.post( "/logout", requireLogin,(req, res) => {
     req.session.destroy( (err) => {
                if (err) {
                    return res.status(500).json({ error: "Unable to logout." });
                }
               res.status(200).json({ message: "Logout successful."});
            }
        );
    }
);

// CURRENT USER
app.get("/me",requireLogin,(req, res) => {
        res.status(200).json({ user: req.session.user});
    }
);
// CREATE CONVERSION
// POST /conversions

app.post("/conversions",(req, res) => {
        const {
            converter,
            from,
            to,value
        } = req.body;

        // USER INFORMATION

        let username = "Guest";
        let role = "guest";

        // If logged in
        if (req.session.user) {
            username = req.session.user.username;
            role =  req.session.user.role;
        }

        // CHECK CONVERTER
        const converters = ["length","weight","temperature"
        ];
        if (!converters.includes(converter)) {
            return res.status(400).json({
              error: "Available converters: length, weight, temperature"

            });
        }
        // CHECK VALUE
        if (typeof value !== "number") {
            return res.status(400).json({ error:  "Value must be a number."
            });

        }

        // AVAILABLE UNITS
  let availableUnits = [];

        switch (converter) {
            case "length": availableUnits = ["km", "m","cm"]
                break;
            case "weight": availableUnits = [ "kg","g","lb"];
                break;
            case "temperature":availableUnits = [ "c","f"];
                break;
        }
        // CHECK UNITS
        if ( !availableUnits.includes(from) ||!availableUnits.includes(to) )
             {
            return res.status(400).json({error: `Available units: ${availableUnits.join(", ")}`
            });
        }

        // CONVERSION
        let result;
        switch (converter) {
            // Length
            case "length":
                if (from === "km" && to === "m") 
            {
                result = value * 1000;

                }
                else if (  from === "m" && to === "km" )
                     {
                    result = value / 1000;
                }
                else if (from === "m" &&to === "cm") 
                    {
                    result = value * 100;
                }
                else if (from === "cm" &&to === "m" ) 
                    {
                 result = value / 100;
                }
                else if (from === "km" &&to === "cm")
                 {
                    result = value * 100000;
                }
                else if (from === "cm" && to === "km"  ) 
               {
                    result = value / 100000;
                }
                else if (from === to )
                 {
                    result = value;
                }
                break;
            // WEIGHT
          
            case "weight":
                if (from === "kg" && to === "g" ) 
                {
                    result = value * 1000;
                }
                else if (from === "g" && to === "kg" ) 
                {
                    result = value / 1000;
                }
                else if ( from === "kg" && to === "lb" ) 
                {
                    result = value * 2.20462;
                }
                else if ( from === "lb" &&to === "kg" )
                 {
                    result = value / 2.20462;
                }
                else if (from === "g" &&  to === "lb")
                 {
                    result = value / 453.592;
                }
                else if (from === "lb" &&to === "g" )
                 {
                    result = value * 453.592;
                }
                else if (  from === to) 
                {
                    result = value;
                }
                break;
            // TEMPERATURE
            case "temperature":
                if (from === "c" && to === "f")
                 {
                    result = (value * 9 / 5) + 32;
                }
                else if (from === "f" &&  to === "c" ) 
                    {
                    result =   (value - 32) * 5 / 9;
                }

                else if (
                    from === to
                ) {
                    result = value;
                }
                break;
        }
        // CHECK RESULT
        if (result === undefined) {
            return res.status(400).json({error: `Conversion from ${from} to ${to} is not available.`});
        }
        // SAVE HISTORY
        saveHistory({
            username,
            role,
            converter,
            from,
            to,
            input: value,
            result
        });

        // RESPONSE
        res.status(201).json({
            username,
            role,
            converter,
            from,
            to,
            input: value,
            result
        });
    }
);

// GET /history

app.get("/history", requireLogin,(req, res) => {
 const filePath = path.join( historyFolder,"Record.txt"
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error:"No history found."
            });
        }

        fs.readFile( filePath,"utf8",(err, data) => {
                if (err) {
                    return res.status(500).json({ error: "Unable to read history."  });
                }
                // ADMIN

                if (
                    req.session.user.role === "admin"
                ) {

                    return res.status(200).send(data);

                }
                // NORMAL USER
                const records = data
                    .split("\n\n")
                    .filter(record => {
                        return record.includes( `Username: ${req.session.user.username}` );
                    });
                if (records.length === 0) {
                    return res.status(404).json({ error: "No history found for this user."
                    });
                }
                res.status(200).send( records.join("\n\n") );

            }
        );

    }
);

// ADMIN - GET ALL USERS
// GET /users
app.get("/users", requireAdmin,(req, res) => {
        const users = getUsers();
        const safeUsers = users.map(
            user => ({
                id: user.id,
                username: user.username,
                role: user.role

            })
        );
        res.status(200).json({
            count: safeUsers.length,
            users: safeUsers
        });

    }
);


// ADMIN - GET ALL HISTORY


// GET /admin/history

app.get("/admin/history", requireAdmin,(req, res) => {
        const filePath = path.join( historyFolder, "Record.txt");

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({error:"No history found" });
        }

        fs.readFile( filePath,"utf8", (err, data) => {
             if (err) {
                    return res.status(500).json({
                        error:
                            "Unable to read history."

                    });

                }


                res.status(200).send(data);

            }
        );

    }
);

// SERVER
app.listen(3000,() => {
        console.log("Server running on port 3000");
    }
);