require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose =require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema= new mongoose.Schema({
  email: String,
  password:String
});



const User = new mongoose.model("User",userSchema);

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser =new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.render("secrets");
      }
    });
  });
});

app.post("/login",function(req,res){
  const username =req.body.username;
  const password =md5(req.body.password);

  User.findOne({email:username},function(err,userFound){
    if(err){
      console.log(err);
    }
    else{
      if(userFound){
        if(userFound.password===password){
          res.render("secrets");
        }
      }
    }
  });
});



app.listen(3000,function(){
  console.log("Server started on port 3000");
});
