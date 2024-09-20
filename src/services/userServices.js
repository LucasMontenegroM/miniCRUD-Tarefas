require("dotenv").config();
const knex = require("../database/index");
const validator = require("validator");
const bcrypt = require("bcrypt");

function validarNomeUsuario(nome) {
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

        const jaExisteUsuario = await knex("usuario").select("*").where({ email }).first();
        if (jaExisteUsuario) {
            throw new Error("Já existe um usuário cadastrado com esse email.");
        }

        if (!validarNomeUsuario(nome)) {
            throw new Error("Nome inválido. O nome de usuário deve conter apenas letras, números e (_). Deve ter no mínimo 3 e máximo 16 caracteres");
        }

        const hash = await bcrypt.hash(senha, 10);

        await knex("usuario").insert({
            nome,
            data_nascimento: dataNascimento,
            email,
            password: hash,
            cep
        });
        
        return "Usuário registrado com sucesso!";
    } catch (erro) {
        console.error("Erro ao criar usuário: ", erro.message);
        throw new Error(erro.message);
    }
}

module.exports = {
    createUser
};
