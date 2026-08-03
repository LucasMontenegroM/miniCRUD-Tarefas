const Router = require("express").Router;
const router = Router();
const userController = require("./controllers/userController");
const auth = require("./middleware/auth");

//CRUD usuario
router.post("/usuario", userController.createUser);
router.get("/usuario/all", auth, userController.getAllUsers);
router.get("/usuario/:id", auth, userController.getUserID);
router.patch("/usuario", auth, userController.updateUser);


router.post("/login", userController.login);


module.exports = router;
