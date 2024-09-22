const Router = require("express").Router;
const router = Router();
const userControlador = require("./controllers/userController");
const auth = require("./middleware/auth");

//CRUD usuario
router.post("/usuario", userControlador.createUser);
router.get("/usuario/all", auth, userControlador.getAllUsers);
router.get("/usuario/:id", auth, userControlador.getUserID);


router.post("/login", userControlador.login);


module.exports = router;
