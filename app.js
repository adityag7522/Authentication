//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret: secret, encryptedFields: ['password']});


const user = new mongoose.model("user",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    const newUser = new user({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    })
});

app.post("/login",function(req,res){
    const userName = req.body.username;
    const Password = req.body.password;

    user.findOne({email: userName}, function(err, foundUser){
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(foundUser){
                if(foundUser.password === Password){
                    res.render("secrets");
                }
                else
                {
                    // alert("Wrong Email or Password");
                    res.render("/");
                }
            }
            else{
                res.render("login");
            }
        }
    })

});


app.listen(3000,function(){console.log("Server Started !!");});
