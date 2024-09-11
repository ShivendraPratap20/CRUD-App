const jwt = require("jsonwebtoken");
const FormSchema = require("../db/models/model");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
            const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
            const userData = await FormSchema.find({ _id: verifyUser._id });
            (userData[0] != undefined) ? res.render("card.hbs", userData[0]) : res.render("form.hbs");
            req.token = token;
            req.userData = userData;
            next();
    } catch (error) {
        console.log(`Error occured in auth ${error}`);
        res.render("form.hbs");
    }
}
module.exports = auth;