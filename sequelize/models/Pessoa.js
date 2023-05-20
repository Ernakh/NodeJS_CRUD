const {DataTypes} = require('sequelized');

const db = require('../db/conn');

const Pessoa = db.define('Pessoa', 
{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: 
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    ano_nascimento:
    {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = Pessoa;