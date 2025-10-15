const userModel = require("../db/models/model");
const bcrypt = require("bcryptjs");


const landing = (req, res) => {
    if (req.authorize) {
        res.render("card.hbs", req.userData[0]);
    } else
        res.render("form.hbs");
};

const login = async (req, res) => {
    try {
        const {userId, pass} = req.body;
        const result = await userModel.find({ email: userId });
        if (result[0] == undefined) {
           res.status(404).json({status:"FAILED", message:"User doesn't exists"});
           return;
        }
        const isMatch = await bcrypt.compare(pass, result[0].password);
        if (!isMatch) {
            res.status(401).json({status:"FAILED", message:"Password incorrect"});
            return;
        } 
        const token = await result[0].authToken();
        res.cookie("jwt", token);
        res.redirect("/");
    } catch (err) {
        console.log(`Error occured while signing ${err}`);
        res.status(505).send("Internal server Error");
    }
}

const signup = async (req, res) => {
    try {
        const {fullName, email, password, confirmPassword, gender, profession, phone, address} = req.body;
        const result = new userModel({
            fullName,
            email,
            password,
            confirmPassword,
            gender,
            languages: req.body.language,
            profession,
            phone,
            address
        });
        const token = await result.authToken();
        console.log(`Token ${token}`);
        res.cookie("jwt", token);
        const data = await result.save();
        console.log(`Data saved ${data}`);
        res.json({ status: "SUCCESS", message: "Credentials saved. Now Login your account" });
    } catch (error) {
        console.log(`Error occured while singing up ${error}`);
        res.send(JSON.stringify({ status: false, message: `${error}` }));
    }
}

const modify = async (req, res) => {
    try {
        let lang = [];
        console.log(req.body);
        ((req.body.language).length == 0) ? lang = loginData.languages : lang = req.body.language;
        const updateResult = await userModel.findOneAndUpdate(
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
}

const remove = async (req, res) => {
    try {
        console.log(req.body.userEmail);
        const email = req.body.userEmail
        const result = await userModel.findOneAndDelete({ email: email });
        console.log(`Data deleted successfully ${result}`);
        res.sendStatus(204);
    } catch (error) {
        console.log(`Error occured while deleting the data ${error}`);
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        console.log('Logout successful');
        res.redirect("/");
    } catch (error) {
        console.log(`Error occured while log out ${error}`);
    }
}

module.exports = {
    landing,
    login,
    signup,
    modify,
    remove,
    logout
};