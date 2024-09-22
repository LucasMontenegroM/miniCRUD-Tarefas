const Router = require("express").Router;
const router = Router();
const userControlador = require("./controllers/userController");

//CRUD usuario
router.post("/usuario", userControlador.createUser);

module.exports = router;
