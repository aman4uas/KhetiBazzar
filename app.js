const express = require("express")
const app = express()
const bodyParser = require("body-parser")

app.set('view engine', 'ejs');
const year = new Date().getFullYear();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{
    
    res.render("landingpage", {year: year})
})
app.get("/signup", (req, res)=>{
    res.render("signup", {year: year})
})

app.listen(3000, ()=>{
    console.log("Port working at 3000")
})