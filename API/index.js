console.clear();
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const host = process.env.HOST;

const userController = require("./controllers/users.controller.js");

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", function (req, res) {
  res.status(200).json({
    message: `home -- Desafio FullStack api`,
  });
});

// login route
app.post("/login", userController.login);

// routing middleware
app.use("/users", require("./routes/users.routes.js"));
app.use("/tickets", require("./routes/tickets.routes.js"));
app.use("/states", require("./routes/states.routes.js"));
app.use("/departments", require("./routes/departments.routes.js"));

// handle invalid routes
app.all(/.*/, function (req, res) {
  res.status(404).json({ message: "The path specified could not be found" });
});
const server = app.listen(port, host, () =>
  console.log(`App listening at http://${host}:${port}/`)
);

module.exports = app;
module.exports = server;
