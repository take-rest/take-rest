const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello world!!!",
  });
});

app.use(bodyParser.json());

const port = process.env.port || process.env.NODE_ENV === "test" ? 5051 : 5050;

app.listen(port, () => console.log(`Server Running on ${port}`));

module.exports = { app };
