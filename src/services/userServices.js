require('dotenv').config();
const knex = require('../database/index');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

function validarNomeUser(nome) {
    const regex = /^[a-zA-Z0-9_]{3,16}$/;
    return regex.test(nome);
}

async function createUser(nome, email, senha, cep, dataNascimento) {
    try {
        
        email = validator.trim(email);

        if (!nome || !email || !senha || !cep || !dataNascimento) {
            throw new Error("Preencha todos os campos.");
        }

        if (!validator.isEmail(email)) {
            throw new Error("Email inválido");
        }

        const jaExisteUser = await knex("usuario").select("*").where({ email }).first();
        if (jaExisteUser) {
            throw new Error("Já existe um usuário cadastrado com esse email.");
        }

        if (!validarNomeUser(nome)) {
            throw new Error("Nome inválido. O nome de usuário deve conter apenas letras, números e (_). Deve ter no mínimo 3 e máximo 16 caracteres");
        }

        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(senha, salt);

        await knex("usuario").insert({
            nome: nome,
            data_nascimento: dataNascimento,
            email: email,
            senha: hash,
            cep: cep
        });
        
        return "Usuário registrado com sucesso!";

    } catch (erro) {
        console.error("Erro ao criar usuário: ", erro.message);
        throw new Error(erro.message);
    }
}

async function getAllUsers(){
    try{
        const allUsers = await knex("usuario").select("*");
        return allUsers;

    } catch(erro){
        throw new Error("erro ao buscar usuários: " + (erro));
    }
}

async function getUserID(id){
    
    try{
        const userExist = await knex("usuario").select("*").where({id:id}).first();
        if(!userExist){
            throw new Error("Não há usuário com esse id");
        }
        const user = {
            nome: userExist.nome,
            email: userExist.email,
            cep: userExist.cep,
            dataNascimento: userExist.dataNascimento
        }

        return user;
    }catch(erro){
        throw erro;
    }
}

async function updateUser(id, { nome, email, senha, cep, data_nascimento }) {
    try {
        const user = await knex("usuario").select("*").where({ id }).first();
        if (!user) {
            throw new Error("Usuário com esse ID não existe");
        }

        if (email) {
            email = validator.trim(email);
            if (!validator.isEmail(email)) {
                throw new Error("Email inválido");
            }
        }

        if (nome && !validarNomeUser(nome)) {
            throw new Error("O nome de usuário deve conter apenas letras, números e (_). Deve ter no mínimo 3 e máximo 16 caracteres");
        }

        let userUpdated = {
            nome,
            email,
            cep,
            data_nascimento, 
        };

        if (senha) {
            const salt = await bcrypt.genSalt(10);
            userUpdated.senha = await bcrypt.hash(senha, salt);
        }

        await knex("usuario").update(userUpdated).where({ id });
        return "Credenciais atualizadas.";
    } catch (erro) {
        throw erro;        
    }
}

//login
async function login(email,senha){
    try{
        email = validator.trim(email);
        if(!(validator.isEmail(email))){
            throw new Error("Email inválido");
        }
               
        const user = await knex("usuario").select("*").where({email: email}).first();
        if(!user){
            throw new Error("Usuário não foi encontrado.")
        }

        const senhaTrue = bcrypt.compareSync(senha, user.senha);
        
        if(!senhaTrue){
            throw new Error("senha incorreta.")
        }

        const userInfo = {
            id: user.id,
            nome: user.nome,
          };    

          const token = jwt.sign(userInfo, process.env.JWT_KEY, {expiresIn: '4h'});

          return token;

    }catch(erro){
        console.log("erro no login: " + erro);
        throw erro;
    }
    
}

module.exports = {
    createUser,
    getAllUsers,
    getUserID,
    updateUser,
    login
};
