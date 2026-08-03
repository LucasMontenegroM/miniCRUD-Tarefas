const bcrypt = require('bcrypt');
const userService = require('../services/userServices');
const { update } = require('../database');
const validator = require('validator');


async function createUser(req, res){
    try{
            const{nome, email, senha, cep, dataNascimento} = req.body;
            const createService = await userService.createUser(nome, email, senha, cep, dataNascimento);
                        
            res.json({status: true, message: createService});
            console.log('controlador executado.');

    }   catch(erro){
        console.log(erro);
        res.json({status: false, message: erro.message});
    }
}

async function getAllUsers(req, res){
    try{        
        const allUsers = await userService.getAllUsers();
         res.json({status: true, message: allUsers});
    } catch(erro){
        console.log(erro);
        res.json({status: false, message: erro.message});
    }
}

async function getUserID(req, res){
    try{
        const id = req.user.id;
        const readService = await userService.getUserID(id);
        res.json({status: true, message: readService});
        console.log('controlador executado');
    }catch(erro){
        console.log(erro);
        res.json({status: false, message: erro.message});
    }
}

async function updateUser(req, res) {
    try {
        const { nome, email, senha, cep, data_nascimento } = req.body;
        const id_user = req.user.id;

        const updateResult = await userService.updateUser(id_user, { nome, email, senha, cep, data_nascimento });

        res.json({ status: true, message: updateResult });
    } catch (erro) {
        console.log(erro);
        res.json({ status: false, message: erro.message });
    }
}

//login
async function login(req, res){
    try{
        
        const {email, senha} = req.body;
        const login = await userService.login(email, senha);

        res.json({status: true, token: login});

    }catch(erro){
        console.log(erro);
        res.json({status: false, message: erro.message});
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserID,
    updateUser,
    login
}