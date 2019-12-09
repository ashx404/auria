const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("dist"));
// parse application/json
app.use(bodyParser.json());

const myRouter = require("./router/router");

app.use(express.json());
app.use(express.static("public"));
app.use("/", myRouter);
module.exports = app;
