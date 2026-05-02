const express = require("express")
const cors = require("cors")
const mysql = require("mysql")
const cookieParser = require("cookie-parser")
const app = express()
app.use(cors())
app.use(express.json())
const port = 3000
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})
app.use(cookieParser())
connection.connect((err) => {
    if (err) {
        throw err
        return
    }
    console.log("it is connecteed with the db suucessfully")
})
app.get("/users/all", (req, res) => {

    connection.query('select * from users', (err, result, fields) => {
        if (err) {
            throw err
            return
        }
        res.status(200).send(result)
    })
})


app.post("/login", (req, res) => {
    if (!req.body || req.body == undefined) {
        return res.status(400).send("body is required")
        return
    }
    const username = req.body.username;
    if (!username || username == undefined) {

        return res.status(400).send("username is required")
    }
    connection.query(`select username  from users where username=?`, [username], (err, result, fields) => {
        if (err) {
            throw err
            return
        }
        res.status(200).send(result)
    })
})


app.post("/register", (req, res) => {
    if (!req.body || req.body == undefined) {
        return res.loginstatus(400).send("body is required")
        return
    }
    const username = req.body.username;
    if (!username || username == undefined) {

        return res.status(400).send("username is required")
    }
    connection.query(`insert into users(username) values(?)`, [username], (err, result, fields) => {
        if (err) {
            throw err
            return
        }
        res.cookie("token", username)
        res.status(200).send("Ok")
    })

})

app.get("/", (req, res) => {
    res.send("it is the default route ")
})
app.listen(port, () => {
    console.log(`it is runing on http://localhost:${port}`)
})