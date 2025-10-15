const { body } = require("express-validator");

const loginValidation = [
    body("userId")
    .trim()
    .notEmpty().withMessage("Invalid use ID")
    .normalizeEmail()
    .isEmail().withMessage("Invalid user ID"),
    body("pass")
    .isLength({min:8}).withMessage("Password incorrect"),
];

const registerValidation = [
    body("fullName")
    .trim()
    .notEmpty().withMessage("Name is required"),
    body("email")
    .normalizeEmail()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
    body("password")
    .isLength({min:8}).withMessage("Password must be of 8 length"),
    body("confirmPassword")
    .custom((value, {req})=>{
        if(value !== req.body.confirmPassword)
            throw new Error("Password and confirm are not matched")
        return true
    })
];

module.exports = {
    loginValidation,
    registerValidation
}