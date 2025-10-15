const Express = require("express");
const router = Express.Router();
const { landing, login, signup, modify, remove, logout } = require("../controller/ctrl");
const { loginValidation, registerValidation } = require("../util/validator");
const validation = require("../middleware/validation");

router.get("", landing);
router.post("/login", loginValidation, validation, login);
router.post("/register", registerValidation, validation, signup);
router.put("/updateData", modify);
router.delete("/deleteData", remove);
router.get("/logout", logout);

module.exports = router;