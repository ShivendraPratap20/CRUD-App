const userModel = require("../db/models/model");
const bcrypt = require("bcryptjs");
const { cloudinary } = require("../util/profilePic");
const { OAuth2Client } = require("google-auth-library");

const landing = (req, res) => {
    if (req.authorize) {
        res.render("card.hbs", req.userData[0]);
    } else
        res.render("form.hbs");
};

const login = async (req, res) => {
    try {
        const { userId, pass } = req.body;
        const result = await userModel.find({ email: userId });
        if (result[0] == undefined) {
            res.status(404).json({ status: "FAILED", message: "User doesn't exists" });
            return;
        }
        const isMatch = await bcrypt.compare(pass, result[0].password);
        if (!isMatch) {
            res.status(401).json({ status: "FAILED", message: "Password incorrect" });
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
        const { fullName, email, password, confirmPassword, gender, profession, phone, address } = req.body;
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
        console.log(req.file);
        const picResult = await cloudinary.uploader.upload(req.file.path);
        //console.log(picResult.secure_url);
        //((req.body.language).length == 0) ? lang = loginData.languages : lang = req.body.language;
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
        res.json({ status: "SUCCESS", data: picResult.secure_url })
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

const googleLoginHandler = async (req, res) => {
    try {
        console.log('Google request made');
        const params = new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            redirect_uri: 'http://localhost:8000/auth/google/callback',
            response_type: 'code',
            scope: 'openid email profile',
            state: "RANDOM_STRING",
        });

        res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
    } catch (error) {
        console.log(`Error while login in with google ${error}`)
    }
};

const googleCallbackHandler = async (req, res) => {
    try {
        const { code, state } = req.query;

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: 'http://localhost:8000/auth/google/callback',
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            return res.status(400).send('Token exchange failed')
        }

        const tokens = await tokenResponse.json();
        // tokens = { access_token, id_token, expires_in, scope, token_type, refresh_token? }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture, email_verified } = payload;

        if (!email_verified) {
            return res.status(400).send('Email not verified by Google');
        }

        let user = await userModel.findOne({ email: email });
        if (!user) {
            const result = new userModel({
                fullName: name,
                email,
            });
            user = await result.save();
        }
        console.log(`User is ${user}`)
        const token = await user.authToken();
        res.cookie("jwt", token);
        res.redirect("/");

    } catch (error) {
        console.log(`Error occured while handling google callback ${error}`)
        res.status(500).send(JSON.stringify({ status: false, message: `${error}` }));

    }
};

module.exports = {
    landing,
    login,
    signup,
    modify,
    remove,
    logout,
    googleLoginHandler,
    googleCallbackHandler
};