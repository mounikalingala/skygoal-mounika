const express = require("express")
const mongoose = require("mongoose")
const RegisterUser = require("./model")
const jwt = require("jsonwebtoken")
const middleware = require("./middleware")
const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://mounikagoudlingala:ZH2JwcrsiQeb5t1W@cluster0.n07ln9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(
    () => {
        console.log("DB connected")
    }
)
app.get("/", (req, res) => res.send("res"))

app.post("/register", async (req, res) => {
    try {

        const { username, email, password, confirmPassword } = req.body
        let exist = await RegisterUser.findOne({ email })
        if (exist) {
            return res.status(400).send("User Already Exist")
        }
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords are not matching")
        }
        let newUser = new RegisterUser({
            username, email, password, confirmPassword
        })
        await newUser.save()
        res.status(200).send("Register Successfully")

    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        let exist = await RegisterUser.findOne({ email })
        if (!exist) {
            return res.status(400).send("User Not Found")
        }
        if (exist.password !== password) {
            return res.status(400).send("Invalid Credentials")
        }
        let payload = {
            user: {
                id: exist.id
            }
        }
        jwt.sign(payload, "jwtoken", { expiresIn: 3600000 },
            (err, token) => {
                if (err) throw err
                return res.json({ token })
            }
        )
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Error")

    }
})

app.get("/home", middleware, async (req, res) => {
    try {
        let exist = await RegisterUser.findById(req.user.id)
        if (!exist) {
            return res.stat(400).send("User Not Found")
        }
        res.json(exist)
    } catch (err) {
        console.log(err)
        return res.stat(500).send("Server Error")
    }
})




app.listen(3005, () => {
    console.log("server is running")
})