const express = require('express')
const mysql = require("mysql");
const cors = require("cors");
const connection = mysql.createConnection({
    host: "localhost",
    user: "app",
    password: "anna",
    database: "chat"
});
connection.connect();
const app = express()

app.use(cors());
app.use(express.json());

/*
POST: create account
GET: login
POST: create message
GET: get message
*/

app.post("/accounts/create", (req, res) => {
    connection.query("SELECT username FROM users WHERE username = ?", [req.body.username], (err, resp) => {
        if (err) console.log(err);
        if (resp.length) {
            return res.send({error: true, msg: "Username already exists."});
        }
        connection.query("INSERT INTO users (username, password) VALUES(?, ?)", [req.body.username, req.body.password], (err, resp) => {
            res.send({error: false, msg: "ok"});
        })
    })
})

app.get("/accounts/login", (req, res) => {
    connection.query("SELECT id FROM users WHERE username = ? AND password = ? LIMIT 1", [req.query.username, req.query.password], (err, resp) => {
        if (resp.length) return res.send({error: false, msg: "ok"});
        res.send({error: true, msg: "Invalid username or password"});
    });
});

app.get("/messages/get", (req, res) => {
    connection.query("SELECT author, content, date FROM messages ORDER BY date DESC LIMIT 100", (err, resp) => {
        res.send({messages: resp});
    });
});

app.post("/messages/create", (req, res) => {
    console.log(req.body);
    connection.query("SELECT id FROM users WHERE username = ? AND password = ? LIMIT 1", [req.body.username, req.body.password], (err, resp) => {
        if (err) console.log(err);
        if (!resp.length) return res.status(401).send({error: true, msg: "Invalid username or password."});
        const id = resp[0].id;
        connection.query("INSERT INTO messages (author, content, date) VALUES (?, ?, ?)", [id, req.body.content, Date.now()], (err, resp) => {
            if (err) console.log(err);
            res.send({error: false, msg: "ok"});
        });
    });
});
 
app.listen(8000, () => console.log("Ready!"));