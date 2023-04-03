require('dotenv').config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const ejs = require("ejs")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")


/******** Middlewares ********/

const saltRounds = 10
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

/**** Middlewares ENDS ****/






/******** Database ********/

//mongoose.connect("mongodb://localhost:27017/khetiBazzarDB").then(()=> console.log("Connected to Database successfully !!")).catch(()=> console.log("Error connecting database !!"))
mongoose.connect(`mongodb+srv://amanhacks4u:${process.env.DB_PASSWORD}@cluster0.sg6mffa.mongodb.net/?retryWrites=true&w=majority`).then(()=> console.log("Connected to Database successfully !!")).catch(()=> console.log("Error connecting database !!"))

const userSchema = {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    profession: String
}
const User = new mongoose.model("User", userSchema)

/**** Database ENDS ****/






/******** User Specific Info ********/

let isAuthenticated = false
let currentUsername = null

/**** User Specific Info ENDS ****/





/******** Get API calls for routes ********/

app.get("/", (req, res)=>{
    const year = new Date().getFullYear();
    res.render("landingpage", {year: year})
})

app.get("/signup", (req, res)=>{
    res.render("signup", {userError: "", passError: ""})
})

app.get("/login", (req, res)=>{
    res.render("login", {userError: "", passError: ""})
})

/**** Get API calls for routes ENDS ****/



/******** Post API calls for routes ********/

app.post("/signup", (req, res)=>{
    User.findOne({email: req.body.username}).then((foundUser)=>{
        if(req.body.userPassword !== req.body.userPasswordConfirm){
            res.render("signup", {userError: "", passError: "Passwords did not match !!"})
        }
        else if(foundUser===null){
            bcrypt.hash(req.body.userPassword, saltRounds, function(err, hash) {
                if(err){
                    console.log(err)
                    res.render("error")
                }
                else{
                    const newUser = new User({
                        email: req.body.username,
                        password: hash,
                        firstName: req.body.fName,
                        lastName: req.body.lName,
                        profession: req.body.profession
                    })
                    newUser.save().then(()=>{
                        isAuthenticated = true
                        currentUsername = req.body.username
                        res.send("<h1>Hello World</h1>")
                    }).catch((err)=>{
                        console.log(err)
                        res.render("error")
                    })
                }
                
            })
        }
        else{
            res.render("signup", {userError: "Email already taken.."})
        }
    })
})

app.post("/login", (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}).then((foundUser)=>{
        if(foundUser===null){
            res.render("login", {userError: "Email does not exists..", passError: ""})
        }
        else{
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(err){
                    console.log(err)
                    res.render("error")
                }
                else{
                    if(result === true) {
                        isAuthenticated = true
                        currentUsername = req.body.username
                        res.send("<h1>Logged In </h1>")
                    }
                    else {
                        res.render("login", {passError: "You entered a wrong password.. TRY AGAIN !!", userError: ""})
                    }
                }
            })
        }
        
    })
})

/**** Post API calls for routes ENDS ****/


app.listen(process.env.PORT || 3000, ()=>{
    console.log("Port working at http://localhost:3000")
})