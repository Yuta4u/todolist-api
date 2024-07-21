const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.options("*", cors()); // Pre-flight requests for all routes


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database");
});

app.get("/api/v1/todo", (req, res) => {
    const sql = "SELECT * FROM todo";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json({ status: 201, data: result });
    });
});

app.post("/api/v1/todo", (req, res) => {
    const { title, todo } = req.body;
    const sql = "INSERT INTO todo (title, todo) VALUES (?, ?)";
    db.query(sql, [title, todo], (err, result) => {
        if (err) throw err;
        res.status(201).json({ status: 201, msg: "Berhasil post todo" });
    });
});

app.put("/api/v1/todo", (req, res) => {
    const { id, title, todo } = req.body;
    const sql = "UPDATE todo SET title = ?, todo = ? WHERE id = ?";
    db.query(sql, [title, todo, id], (err, result) => {
        if (err) throw err;
        res.status(201).json({ status: 201, msg: "Berhasil edit todo", data: result });
    });
});

app.delete("/api/v1/todo/:id", (req, res) => {
    const todoId = req.params.id;
    const sql = `DELETE FROM todo WHERE id=${todoId}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ msg: "Berhasil delete todo" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
module.exports.handler = serverless(app);
