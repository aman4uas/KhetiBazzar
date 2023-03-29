const express = require("express")
const app = express()
const bodyParser = require("body-parser")

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{
    const year = new Date().getFullYear();
    res.render("landingpage", {year: year})
})

app.listen(3000, ()=>{
    console.log("Port working at 3000")
})