require('dotenv').config({path:'../.env'});
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const PORT = process.env.port || 8000;
require('./db/conn.js');
const MongModel = require('./db/models/model.js');
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth.js");
var isLogin = false;
var loginData;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'hbs');
app.set('views', '../templates/views');

app.get("/", auth, (req, res) => {
});
app.post("/", async (req, res) => {
    var errorObj = {userError:false, passwordError: false};
    try {
        const result = await MongModel.find({ email: req.body.userId });
        if (result[0] == undefined) {
            errorObj.userError = true;
            throw new Error("User doesn't exists");
        }
        console.log(`Retreived data from the database ${result}`);
        const isMatch = await bcrypt.compare(req.body.pass, result[0].password);
        if (isMatch) {
            isLogin = true;
            loginData = result[0];
            const token = await result[0].authToken();
            res.cookie("jwt", token);
            res.redirect("/home");
        } else {
            errorObj.passwordError = true;
            throw new Error("Password not match");
        }
    } catch (err) {
        console.log(`Error occured while signing ${err}`);
        if(errorObj.userError) res.status(404).send("User doesn't exists");
        else if(errorObj.passwordError) res.status(401).send("Password incorrect");
        else res.status(505).send("Internal server Error");
    }
});
app.get("/home", async (req, res) => {
    isLogin? res.render("card.hbs", loginData) : res.redirect("/");
});
app.post("/data", async (req, res) => {
    try {
        if ((req.body.password).length < 8) throw new Error("Password must be of length 8");
        else if (req.body.password !== req.body.confirmPassword) throw new Error("Password and Confirm Password should be same");
        else {
            const result = new MongModel({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                gender: req.body.gender,
                languages: req.body.language,
                profession: req.body.profession,
                phone: req.body.phone,
                address: req.body.address
            });
            const token = await result.authToken();
            console.log(`Token ${token}`);
            res.cookie("jwt", token);
            const data = await result.save();
            console.log(`Data saved ${data}`);
            res.json({status:true, message:"Credentials saved. Now Login your account" });
        }
    } catch (error) {
        console.log(`Error occured while singing up ${error}`);
        res.send(JSON.stringify({status:false, message:`${error}`}));
    }
});
app.put("/updateData", async (req, res) => {
    try {
        let lang = [];
        console.log(req.body);
        ((req.body.language).length == 0)? lang = loginData.languages : lang = req.body.language;
        const updateResult = await MongModel.findOneAndUpdate(
            { email: req.body.oldEmail },
            {
                $set: {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    profession: req.body.profession,
                    phone: req.body.phone,
                    address: req.body.address,
                    languages: lang
                },
            },
            { new: true }
        );
        console.log(`Data updated ${updateResult}`);
    } catch (error) {
        console.log(`Error occured while updating the data ${error}`);
    }
})
app.delete("/deleteData", async (req, res) => {
    try {
        console.log(req.body.userEmail);
        const email = req.body.userEmail
        const result = await MongModel.findOneAndDelete({ email: email });
        console.log(`Data deleted successfully ${result}`);
        isLogin = false;
        loginData = null;
        res.sendStatus(204);
    } catch (error) {
        console.log(`Error occured while deleting the data ${error}`);
    }
});
app.get("/logout", auth, async(req, res)=>{
    try {
        res.clearCookie("jwt");
        isLogin = false;
        loginData = null;
        //await req.userData.save();
        console.log('Logout successful');
        res.redirect("/");
    } catch (error) {
        console.log(`Error occured while log out ${error}`);
    }
});
app.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`);
});