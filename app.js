const express = require("express");
const sessionConfig = require("./config/session");

const authRoutes = require("./routes/authRoutes");
const conversionRoutes = require("./routes/conversionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(sessionConfig);

app.use("/", authRoutes);
app.use("/", conversionRoutes);
app.use("/", adminRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});