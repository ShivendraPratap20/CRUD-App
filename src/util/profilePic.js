const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const upload = multer({ dest: "uploads/"});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

module.exports = {
    upload,
    cloudinary
};