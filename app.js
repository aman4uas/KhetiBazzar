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
let isAuthenticated = false

/**** Middlewares ENDS ****/



/******** Database ********/

mongoose.connect("mongodb://localhost:27017/khetiBazzarDB")

const userSchema = {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    profession: String
}
const User = new mongoose.model("User", userSchema)

/**** Database ENDS ****/




/******** Get API calls for routes ********/

app.get("/", (req, res)=>{
    const year = new Date().getFullYear();
    res.render("landingpage", {year: year})
})

app.get("/signup", (req, res)=>{
    res.render("signup")
})
app.post("/signup", (req, res)=>{
    res.send("<h1>Hello</h1>")
})

app.get("/login", (req, res)=>{
    res.render("login")
})

/**** Get API calls for routes ENDS ****/



/******** Post API calls for routes ********/

app.post("/signup", (req, res)=>{
    console.log(req.body)
    /*
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if(err){
            res.send("<h1>Ooops..Something went wrong !! <br /></h1> <p>Please try again..</p>")
            console.log(err)
        }
        else{
            const newUser = new User({
                email: req.body.username,
                password: hash,
                firstName: req.body.fName,
                lastName: req.body.lName,

            })
            newUser.save().then(()=>{
                isAuthenticated = true
                res.send("<h1>Hello World</h1>")
            }).catch((err)=>{
                console.log(err)
            })
        }
        
    })
    */
})

app.post("/login", (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}).then((foundUser)=>{
        bcrypt.compare(password, foundUser.password, function(err, result) {
            if(result === true) res.render("secrets")
        });
    })
})

/**** Post API calls for routes ENDS ****/


app.listen(process.env.PORT || 3000, ()=>{
    console.log("Port working at http://localhost:3000")
})