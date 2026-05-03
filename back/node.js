const express = require("express")
const cors = require("cors")
const mysql = require("mysql2")
const cookieParser = require("cookie-parser")
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
const port = 3000

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
})

connection.connect((err) => {
    if (err) {
        console.error("DB connection failed:", err.message)
    } else {
        console.log("Connected to DB successfully")
    }
})

app.get("/", (req, res) => {
    res.send("Server is running")
})

app.get("/users/all", (req, res) => {
    connection.query('select * from users', (err, result) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(result)
    })
})

app.post("/login", (req, res) => {
    if (!req.body) return res.status(400).send("body is required")
    const username = req.body.username
    if (!username) return res.status(400).send("username is required")
    connection.query(`select username from users where username=?`, [username], (err, result) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(result)
    })
})

app.post("/register", (req, res) => {
    if (!req.body) return res.status(400).send("body is required")
    const username = req.body.username
    if (!username) return res.status(400).send("username is required")
    connection.query(`insert into users(username) values(?)`, [username], (err, result) => {
        if (err) return res.status(500).send(err.message)
        res.cookie("token", username)
        res.status(200).send("Ok")
    })
})

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
})
