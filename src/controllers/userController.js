const bcrypt = require('bcrypt');
const userService = require('../services/userServices');


async function createUser(req, res){
    try{
            const{nome, email, senha, cep, dataNascimento} = req.body;
            const hashsenha = await bcrypt.hash(senha, 10);
            const createService = await userService.createUser(nome, email, hashsenha, cep, dataNascimento);
            res.json({status: true, message: createService});
            console.log('controlador executado.');

    }   catch(erro){
        console.log(erro);
        res.json({status: false, message: erro.message});
    }
}

module.exports={
    createUser
}