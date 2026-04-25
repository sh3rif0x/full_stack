const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
port = 3000
app.get("/", (req, res) => {
    res.send("the default route")
})
app.listen(port, () => {
    console.log(`the app is runing on http://localhost:${port}`)
})