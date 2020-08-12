const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");
const app = express();

app.use(bodyParser.json());

app.use("/api", router);

const port = process.env.port || process.env.NODE_ENV === "test" ? 5051 : 5050;

const server = app.listen(port, () => console.log(`Server Running on ${port}`));

module.exports = { app, server };
