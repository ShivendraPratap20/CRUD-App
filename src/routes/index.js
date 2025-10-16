const Express = require("express");
const router = Express.Router();
const validation = require("../middleware/validation");
const { upload } = require("../util/profilePic");
const { loginValidation, registerValidation } = require("../util/validator");
const { landing, login, signup, modify, remove, logout } = require("../controller/ctrl");

router.get("", landing);
router.post("/login", loginValidation, validation, login);
router.post("/register", registerValidation, validation, signup);
router.put("/updateData", upload.single("profilePic"), modify);
router.delete("/deleteData", remove);
router.get("/logout", logout);

module.exports = router;