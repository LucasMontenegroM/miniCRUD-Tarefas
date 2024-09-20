const Router = require("express").Router;
const router = Router();
const usuarioControlador = require("./controller/usuarioController");

//CRUD usuario
router.post("/usuario", usuarioControlador.createUsuario);
